import {PermissionsAndroid, PermissionStatus, Platform} from 'react-native';
import RNGeolocation from 'react-native-geolocation-service';

/**
 * Singleton pattern GeoLocation class to handle locations for android and iOS.
 *
 * Simplifies geo location access for different platforms.
 * Improves DX (I guess).
 */
export class GeoLocation {
  private static instance: GeoLocation;

  private constructor() {}

  public static getInstance(): GeoLocation {
    if (!GeoLocation.instance) {
      GeoLocation.instance = new GeoLocation();
    }

    return GeoLocation.instance;
  }

  /**
   * Requests location access automatically based on platform.
   *
   * @param accessLevel required access level (only for IOS)
   * @returns promise of permission status.
   */
  private requestAccess(
    accessLevel: RNGeolocation.AuthorizationLevel,
  ): Promise<RNGeolocation.AuthorizationResult | PermissionStatus> {
    if (Platform.OS === 'ios') {
      return RNGeolocation.requestAuthorization(accessLevel);
    } else if (Platform.OS === 'android') {
      return PermissionsAndroid.request(
        'android.permission.ACCESS_FINE_LOCATION',
      );
    }

    throw new Error(`Pltform type ${Platform.OS} isn't supported`);
  }

  /**
   * It'll try to get the current position.
   * If location permission is not given, it'll ask for permission automatically based on the platform.
   *
   * @param permissionLevel required permission level
   * @returns position or error
   */
  public async getGeoLocation(
    permissionLevel: RNGeolocation.AuthorizationLevel = 'whenInUse',
  ): Promise<RNGeolocation.GeoPosition> {
    return new Promise(async (resolve, reject) => {
      RNGeolocation.getCurrentPosition(
        position => {
          resolve(position);
        },
        async error => {
          if (error.code === 1) {
            try {
              const result = await this.requestAccess(permissionLevel);
              if (result === 'granted') {
                this.getGeoLocation();
              } else {
                reject('Permission denied');
              }
            } catch (reqError) {
              reject(reqError);
            }
          } else {
            reject(error);
          }
        },
        {timeout: 5000, enableHighAccuracy: true},
      );
    });
  }
}

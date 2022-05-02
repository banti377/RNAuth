import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {GeoLocation} from '../utils/geo-location/geo-location';

const Home = () => {
  useEffect(() => {
    GeoLocation.getInstance()
      .getGeoLocation()
      .then(res => {
        Alert.alert('Location', `${JSON.stringify(res.coords)}`);
      })
      .catch(error => {
        // Show user proper message or something.
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

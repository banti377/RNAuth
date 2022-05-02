import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useCallback, useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IoniIcons from 'react-native-vector-icons/Ionicons';
import {Button, StyleSheet, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import Home from './src/screens/Home';
import Settings from './src/screens/Settings';
import {COLORS} from './src/utils/constants';

const Tab = createBottomTabNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const onAuthStateChanged = useCallback(
    (authUser: any) => {
      setUser(authUser);
      if (initializing) {
        setInitializing(false);
      }
    },
    [initializing],
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    // unsubscribe on unmount
    return subscriber;
  }, [onAuthStateChanged]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    // We can return different navigator and have login, register, forgot-password etc screens here.
    return (
      <View style={styles.loadingContainer}>
        <Button
          onPress={() => {
            auth()
              .signInAnonymously()
              .then(() => {
                console.log('signed in anonymously');
              })
              .catch(() => {
                console.error('Error.');
              });
          }}
          title="Login"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarActiveTintColor: COLORS.primary,
            tabBarIcon: ({color, size}) => {
              return (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              );
            },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarActiveTintColor: COLORS.primary,
            tabBarIcon: ({color, size}) => {
              return <IoniIcons name="settings" color={color} size={size} />;
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

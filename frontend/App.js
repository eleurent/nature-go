import React, { useState, useContext } from 'react'; 
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, Button } from 'react-native';
// import * as React from 'react';
import { useAuth, AuthContext } from './authContext';
import HomeScreen from './screens/Home'
import SignInScreen from './screens/Login'
import SplashScreen from './screens/Splash';
import SpeciesListScreen from './screens/SpeciesList';
import SpeciesDetailScreen from './screens/SpeciesDetail';


const Stack = createNativeStackNavigator();


export default function App() {

  const { authState, authMethods } = useAuth();

  return (
    <AuthContext.Provider value = {{ authState, authMethods }}>
      <NavigationContainer>

        <Stack.Navigator screenOptions={{ headerTransparent: true, headerTitle: '' }}>
          {authState.isLoading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : (authState.userToken == null) ? (
            <Stack.Screen name="SignIn" component={SignInScreen}
              options={{
                title: 'Sign in',
                animationTypeForReplace: authState.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            // User is signed in
            <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Contents' }}/>
            <Stack.Screen name="SpeciesList" component={SpeciesListScreen} options={{ title: 'Botany' }} />
            <Stack.Screen name="SpeciesDetail" component={SpeciesDetailScreen} options={{ title: 'Species detail' }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}




const styles = StyleSheet.create({
});


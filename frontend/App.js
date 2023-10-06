import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth, AuthContext } from './contexts/AuthContext';
import { useQuiz, QuizContext } from './contexts/QuizContext';
import { useUserProfile, UserProfileContext } from './contexts/UserProfileContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLoadedAssets } from "./hooks/useLoadedAssets";
import HomeScreen from './screens/Home'
import SignInScreen from './screens/SignIn'
import SignUpScreen from './screens/SignUp'
import CharacterSelectionScreen from './screens/CharacterSelection';
import SpeciesListScreen from './screens/SpeciesList';
import SpeciesDetailScreen from './screens/SpeciesDetail';
import CameraScreen from './screens/Camera';
import ObservationConfirmScreen from './screens/ObservationConfirm';
import QuizDetailScreen from './screens/QuizDetail';
import QuizQuestionScreen from './screens/QuizQuestion';
import QuizResultScreen from './screens/QuizResult';
import ProfileScreen from './screens/Profile';
import LandingScreen from './screens/Landing';

const Stack = createNativeStackNavigator();


export default function App() {

  const isLoadingComplete = useLoadedAssets();
  const { authState, authMethods } = useAuth();
  const { profileState, profileMethods } = useUserProfile(authState);
  const { quizState, quizMethods } = useQuiz();

  useEffect(() => {
    if (authState.userToken) {
      profileMethods.fetchProfile();
    }
  }, [authState.userToken, profileMethods]);

  if (!isLoadingComplete || authState.isLoading)
    return null;
  return (
    <AuthContext.Provider value = {{ authState, authMethods }}>
    <UserProfileContext.Provider value={{ profileState, profileMethods }}>
    <QuizContext.Provider value= {{ quizState, quizMethods }}>
    <SafeAreaProvider>
      <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerTransparent: true, headerTitle: '', headerTintColor: 'black' }}>
          {authState.userToken === null ? (
            // User isn't signed in
            <>
              <Stack.Screen name="Landing" component={LandingScreen}/>
              <Stack.Screen name="SignIn" component={SignInScreen}/>
              <Stack.Screen  name="SignUp" component={SignUpScreen}/>
            </>
          ) : (
            // User is signed in
            <>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="SpeciesList" component={SpeciesListScreen}/>
            <Stack.Screen name="SpeciesDetail" component={SpeciesDetailScreen}/>
            <Stack.Screen name="Camera" component={CameraScreen} options={{ headerTintColor: 'white' }}/>
            <Stack.Screen name="ObservationConfirm" component={ObservationConfirmScreen}/>
            <Stack.Screen name="QuizDetail" component={QuizDetailScreen}/>
            <Stack.Screen name="QuizQuestion" component={QuizQuestionScreen}/>
            <Stack.Screen name="QuizResult" component={QuizResultScreen}/>
            <Stack.Screen name="Profile" component={ProfileScreen}/>
            <Stack.Screen name="CharacterSelection" component={CharacterSelectionScreen}/>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </QuizContext.Provider>
    </UserProfileContext.Provider>
    </AuthContext.Provider>
  );
}




const styles = StyleSheet.create({
});


import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth, AuthContext } from './contexts/authContext';
import { useQuiz, QuizContext } from './contexts/quizContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLoadedAssets } from "./hooks/useLoadedAssets";
import HomeScreen from './screens/Home'
import SignInScreen from './screens/SignIn'
import SignUpScreen from './screens/SignUp'
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
  const { quizState, quizMethods } = useQuiz();

  if (!isLoadingComplete || authState.isLoading)
    return null;
  return (
    <AuthContext.Provider value = {{ authState, authMethods }}>
    <QuizContext.Provider value= {{quizState, quizMethods }}>
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
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </QuizContext.Provider>
    </AuthContext.Provider>
  );
}




const styles = StyleSheet.create({
});


import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth, AuthContext } from './authContext';
import { useQuiz, QuizContext } from './quizContext';
import HomeScreen from './screens/Home'
import SignInScreen from './screens/Login'
import SpeciesListScreen from './screens/SpeciesList';
import SpeciesDetailScreen from './screens/SpeciesDetail';
import QuizDetailScreen from './screens/QuizDetail';
import { useLoadedAssets } from "./hooks/useLoadedAssets";

const Stack = createNativeStackNavigator();


export default function App() {

  const isLoadingComplete = true; //useLoadedAssets();
  const { authState, authMethods } = useAuth();
  const { quizState, quizMethods } = useQuiz();

  if (!isLoadingComplete || authState.isLoading)
    return null;
  return (
    <AuthContext.Provider value = {{ authState, authMethods }}>
    <QuizContext.Provider value= {{quizState, quizMethods }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTransparent: true, headerTitle: '' }}>
          {authState.userToken === null ? (
            // User isn't signed in
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
            <Stack.Screen name="QuizDetail" component={QuizDetailScreen} options={{ title: 'Quiz detail' }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QuizContext.Provider>
    </AuthContext.Provider>
  );
}




const styles = StyleSheet.create({
});


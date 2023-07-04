import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth, AuthContext } from './authContext';
import HomeScreen from './screens/Home'
import SignInScreen from './screens/Login'
import SplashScreen from './screens/Splash';
import SpeciesListScreen from './screens/SpeciesList';
import SpeciesDetailScreen from './screens/SpeciesDetail';
// import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';


const Stack = createNativeStackNavigator();


function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}


export default function App() {

  const [cacheIsReady, setCacheIsReady] = useState(false);
  const { authState, authMethods } = useAuth();


  // Load any resources or data that you need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // SplashScreen.preventAutoHideAsync();
        const imageAssets = cacheImages([
          require('./assets/images/page-background.png'),
        ]);
        const fontAssets = cacheFonts([]);

        await Promise.all([...imageAssets, ...fontAssets]);
      } catch (e) {
        // You might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setCacheIsReady(true);
        // SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);



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


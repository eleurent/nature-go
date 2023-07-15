import Ionicons from "@expo/vector-icons/Ionicons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { Asset } from 'expo-asset';


function cacheImages(images) {
    return images.map(image => {
        if (typeof image === 'string') {
            console.log("Prefetch")
            console.log(image)
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
}

function cacheFonts(fonts) {
    return fonts.map(font => Font.loadAsync(font));
}

export function useLoadedAssets() {
    const [isLoadingComplete, setLoadingComplete] = React.useState(false);

    // Load any resources or data that we need prior to rendering the app
    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHideAsync();

                const imageAssets = cacheImages([
                    require('../assets/images/page-background.png'),
                    require('../assets/images/page-background-2.png'),
                ]);
                const fontAssets = cacheFonts([Ionicons.font]);

                await Promise.all([...imageAssets, ...fontAssets]);
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setLoadingComplete(true);
                SplashScreen.hideAsync();
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    return isLoadingComplete;
}

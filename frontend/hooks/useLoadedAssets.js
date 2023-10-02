import Ionicons from "@expo/vector-icons/Ionicons";
import {
    OldStandardTT_400Regular,
    OldStandardTT_700Bold,
} from '@expo-google-fonts/old-standard-tt';
import { SpecialElite_400Regular } from '@expo-google-fonts/special-elite';
import { Tinos_400Regular_Italic, Tinos_400Regular } from '@expo-google-fonts/tinos';
import {
    DancingScript_400Regular,
    DancingScript_500Medium,
    DancingScript_600SemiBold,
    DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';
import { Parisienne_400Regular } from '@expo-google-fonts/parisienne';
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


const AVATAR_PATHS = [
    { full: require(`../assets/images/avatars/girl_1_full.png`), bubble: require(`../assets/images/avatars/girl_1_bubble.png`) },
    { full: require(`../assets/images/avatars/girl_2_full.png`), bubble: require(`../assets/images/avatars/girl_2_bubble.png`) },
    { full: require(`../assets/images/avatars/girl_3_full.png`), bubble: require(`../assets/images/avatars/girl_3_bubble.png`) },
    { full: require(`../assets/images/avatars/boy_1_full.png`), bubble: require(`../assets/images/avatars/boy_1_bubble.png`) },
    { full: require(`../assets/images/avatars/boy_2_full.png`), bubble: require(`../assets/images/avatars/boy_2_bubble.png`) },
    { full: require(`../assets/images/avatars/boy_3_full.png`), bubble: require(`../assets/images/avatars/boy_3_bubble.png`) },
    { full: require(`../assets/images/avatars/woman_1_full.png`), bubble: require(`../assets/images/avatars/woman_1_bubble.png`) },
    { full: require(`../assets/images/avatars/woman_2_full.png`), bubble: require(`../assets/images/avatars/woman_2_bubble.png`) },
    { full: require(`../assets/images/avatars/woman_3_full.png`), bubble: require(`../assets/images/avatars/woman_3_bubble.png`) },
    { full: require(`../assets/images/avatars/man_1_full.png`), bubble: require(`../assets/images/avatars/man_1_bubble.png`) },
    { full: require(`../assets/images/avatars/man_2_full.png`), bubble: require(`../assets/images/avatars/man_2_bubble.png`) },
    { full: require(`../assets/images/avatars/man_3_full.png`), bubble: require(`../assets/images/avatars/man_3_bubble.png`) },
]

Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
}

export function useLoadedAssets() {
    const [isLoadingComplete, setLoadingComplete] = React.useState(false);

    // Load any resources or data that we need prior to rendering the app
    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHideAsync();

                // Avatar selected randomly --> This should be obtained from API /api/profile/
                global.avatar = AVATAR_PATHS.sample()

                const imageAssets = cacheImages([
                    require('../assets/images/page-background.png'),
                    require('../assets/images/page-background-2.png'),
                    global.avatar.full,
                ]);

                const fontAssets = cacheFonts([
                    Ionicons.font,
                    { OldStandardTT_400Regular },
                    { OldStandardTT_700Bold },
                    { SpecialElite_400Regular },
                    { Tinos_400Regular_Italic },
                    { Tinos_400Regular },
                    { DancingScript_400Regular },
                    { Parisienne_400Regular },
                ]);

                await Promise.all([...imageAssets, ...fontAssets]);
                // await new Promise(r => setTimeout(r, 1000));
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

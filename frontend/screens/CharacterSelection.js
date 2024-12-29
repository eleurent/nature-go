import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet, Dimensions, ImageBackground, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UserProfileContext } from '../contexts/UserProfileContext';

// We use a fork of the original react-native-swiper to get a bugfix, see https://github.com/leecade/react-native-swiper/issues/1053
import Swiper from 'react-native-swiper';

AVATAR_PATHS = global.AVATAR_PATHS;

const updateAvatar = async (profileMethods, navigation, selectedAvatarName) => {
    try {
        await profileMethods.updateAvatarAsync(selectedAvatarName);
        navigation.replace('Home');
    } catch (error) {
        console.error('Could not set avatar:', error.message);
    }
};

export default function CharacterSelectionScreen({ navigation }) {
    const { profileState, profileMethods } = useContext(UserProfileContext);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedAvatarName = Object.keys(AVATAR_PATHS)[selectedIndex];

    const renderCharacters = () => {
        return Object.keys(AVATAR_PATHS).map((avatarName, index) => (
            <View style={styles.characterContainer} key={avatarName}>
                <Image source={AVATAR_PATHS[avatarName].full} style={styles.characterImage} />
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <Swiper style={styles.wrapper} showsButtons={true} activeDotColor="black" onIndexChanged={setSelectedIndex} loadMinimal={true} >
                    {renderCharacters()}
                </Swiper>
                <TouchableOpacity style={styles.button} onPress={() => updateAvatar(profileMethods, navigation, selectedAvatarName)}>
                    <Text style={styles.buttonText}>This is me</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    containerInsideImage: {
        flex: 1,
        flexDirection: 'column'
    },
    wrapper: {
    },
    characterContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    characterImage: {
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').height - 200,
        resizeMode: 'contain',
    },
    button: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 30,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
    },
    buttonText: {
        fontSize: 24,
        fontFamily: 'Parisienne_400Regular',
    }
});

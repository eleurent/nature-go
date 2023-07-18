import React from 'react';
import { View, Text, TouchableOpacity, Image, Button, ImageBackground, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Constants from 'expo-constants'

import {
    useFonts,
    OldStandardTT_400Regular,
    OldStandardTT_700Bold,
} from '@expo-google-fonts/old-standard-tt';

const API_URL = Constants.expoConfig.extra.API_URL;
const URL_CREATE_OBSERVATION = API_URL + 'api/species/observation/'

const pickImageAsync = async (navigation) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
    });

    if (!result.canceled) {
        let formData = new FormData();
        formData.append('image', result.assets[0].uri);
        formData.append('location', 'London');
        formData.append('date', '2023-06-29');
        formData.append('species', '');
        axios.post(URL_CREATE_OBSERVATION, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        .then(response => {
            console.log(response);
            console.log(response.data.species);
            navigation.navigate('SpeciesDetail', { id: response.data.species })
        })
        .catch(error => console.log(error));
    } else {
        console.log('You did not select any image.');
    }
};

const CategoryButton = (props) => {
    const opacity = props.disabled ? 0.3 : 1;
    return (
        <TouchableOpacity
            style={[styles.categoryContainer, { 'opacity': opacity }]}
            activeOpacity={0.5}
            onPress={props.onPress}>
            <Image style={styles.categoryImage}
                source={props.imageSource}
            />
            <Text style={styles.categoryLabel}>{props.label}</Text>
        </TouchableOpacity>
    );
}

export default function HomeScreen({ navigation }) {

    let [fontsLoaded] = useFonts({
        OldStandardTT_400Regular,
        OldStandardTT_700Bold,
    });
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <View style={styles.containerInsideImage}>
                    <Text style={styles.title}>CONTENTS.</Text>
                    <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                    <View style={styles.categoryRowContainer}>
                        <View style={{ flex: 1 }}></View>
                        <CategoryButton 
                            onPress={() => navigation.navigate('SpeciesList')}
                            imageSource={require('../assets/images/botany.png')}
                            label={'BOTANY'}
                        />
                        <View style={{ flex: 1 }}></View>
                    </View>
                    <View style={styles.categoryRowContainer}>
                        <CategoryButton
                            disabled
                            imageSource={require('../assets/images/entomology.png')}
                            label={'ENTOMOLOGY'}
                        />
                        <View style={{ flex: 1 }}></View>
                        <CategoryButton
                            disabled
                            imageSource={require('../assets/images/ornithology.png')}
                            label={'ORNITHOLOGY'}
                        />
                    </View>
                    <View style={styles.categoryRowContainer}>
                        <View style={{ flex: 1 }}></View>
                        <CategoryButton
                            onPress={() => navigation.navigate('QuizDetail')}
                            imageSource={require('../assets/images/university.png')}
                            label={'UNIVERSITY'}
                        />
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity
                        style={styles.categoryContainer}
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('Profile')}>
                        <Image style={styles.avatarImage}
                            source={require('../assets/images/avatar_bubble.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: 'auto'}}>
                    <View style={styles.categoryRowContainer}>
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity
                            style={styles.avatarTouchable}
                            activeOpacity={0.5}
                            onPress={() => pickImageAsync(navigation)}>
                            <Image style={[styles.categoryImage, styles.cameraImage]}
                                source={require('../assets/images/binoculars.png')}
                            />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    containerInsideImage: {
        flex: 1, 
        flexDirection: 'column'
    },
    title: {
        fontSize: 30,
        marginTop: 5,
        marginBottom: -5,
        letterSpacing: 5.0,
        textAlign: 'center',
        fontFamily: 'OldStandardTT_400Regular',
        paddingVertical: 20,
    },
    separator: {
        width: 200,
        height: 5,
        marginHorizontal: 'auto',
        marginBottom: 20,
    },
    categoryRowContainer: {
        height: 120,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    categoryContainer: {
        width: 110,
        height: 120,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
    },
    categoryImage: {
        width: 100,
        height: 100,
    },
    cameraImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderColor: 'black',
        borderWidth: 2,
    },
    categoryLabel: {
        // fontFamily: 'OldStandardTT_400Regular',
        // fontStyle: 'normal',
        fontSize: 14.3846,
        lineHeight: 18,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        color: '#000',
    },
    avatarContainer: {
        position: 'absolute',
        bottom: 5,
        left: -10,
        zIndex: 1
    },
    avatarTouchable: {
    },
    avatarImage: {
        width: 70,
        height: 75,
    }
});

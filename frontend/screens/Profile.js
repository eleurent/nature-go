import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Button } from 'react-native';
import { useFonts, SpecialElite_400Regular } from '@expo-google-fonts/special-elite';
import { Tinos_400Regular_Italic, Tinos_400Regular } from '@expo-google-fonts/tinos';
import axios from 'axios';
import Constants from 'expo-constants';
import { AuthContext } from '../authContext';

export default function ProfileScreen({ navigation, route }) {

    let [fontsLoaded] = useFonts({
        SpecialElite_400Regular,
        Tinos_400Regular_Italic,
        Tinos_400Regular,
    });

    const { authMethods } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <View style={styles.containerInsideImage}>

                <Button title="Sign out" onPress={authMethods.signOut}/>
                </View>
            </ImageBackground>
        </View>
    );
};


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
        marginTop: 60,
        flexDirection: 'column'
    },
});

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Pressable, TouchableOpacity } from 'react-native';

export default function LandingScreen({ navigation, route }) {

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/launch.png')} style={styles.containerImage}>
                <View style={{ flex: 1 }}></View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('SignUp') }}>
                    <Text style={styles.text}>Sign up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('SignIn') }}>
                    <Text style={styles.text}>Sign in</Text>
                </TouchableOpacity>
            </View>
            </ImageBackground>
        </View>
    );
}

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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30
    },
    button: {
        marginHorizontal: 20
    },
    text: {
        fontSize: 24,
        color: 'white'
    }
})
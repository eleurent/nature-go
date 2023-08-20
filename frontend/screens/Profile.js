import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Button } from 'react-native';
import { AuthContext } from '../authContext';

export default function ProfileScreen({ navigation, route }) {
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

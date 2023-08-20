import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { AuthContext } from '../authContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignInScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const { authState, authMethods } = React.useContext(AuthContext);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background-2.png')} style={styles.containerImage}>
                <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                        contentContainerStyle={{ flex: 1, justifyContent: 'center', }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                <Text style={styles.title}>THIS JOURNAL BELONGS TO</Text>
                <TextInput
                    placeholder="Username"
                    placeholderTextColor={'#dcb'}
                    style = {styles.textField}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                <Text style={styles.subtitle}>CREDENTIALS</Text>

                <TextInput
                    placeholder="Password"
                    placeholderTextColor={'#dcb'}
                    style={styles.textField}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry
                />
                <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                {authState.signInErrorMessage && <Text style={{ color: 'red' }}>{authState.signInErrorMessage}</Text>}
                <TouchableOpacity style={styles.button} onPress={() => { 
                    authMethods.signIn({ username, password })
                        .catch(error => setError(error.message));
                    }}>
                    <Text style={styles.text}>Sign in</Text>
                </TouchableOpacity>
                </KeyboardAwareScrollView>
                </SafeAreaView>
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
    },
    title: {
        fontSize: 20,
        letterSpacing: 1.5,
        textAlign: 'center',
        fontFamily: 'OldStandardTT_700Bold',
        marginBottom: 20,
        marginTop: 60,
    },
    subtitle: {
        fontSize: 17,
        letterSpacing: 1.7,
        textAlign: 'center',
        fontFamily: 'OldStandardTT_400Regular',
        paddingBottom: 20,
    },
    textField: {
        textAlign: 'center',
        fontSize: 24,
    },
    separator: {
        width: 220,
        height: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 5,
        marginBottom: 100,
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
        textAlign: 'center'
    }
})
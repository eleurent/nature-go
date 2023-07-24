import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { AuthContext } from '../authContext';

export default function SignUpScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');

    const { authState, authMethods } = React.useContext(AuthContext);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background-2.png')} style={styles.containerImage}>
                <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>
                <TextInput
                    placeholder="First Name"
                    placeholderTextColor={'#dcb'}
                    style = {styles.textField}
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    placeholder="Last Name"
                    placeholderTextColor={'#dcb'}
                    style = {styles.textField}
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    placeholder="Username"
                    placeholderTextColor={'#dcb'}
                    style = {styles.textField}
                    value={username}
                    onChangeText={setUsername}
                />
                <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                <Text style={styles.subtitle}>CREDENTIALS</Text>

                <TextInput
                    placeholder="Password"
                    placeholderTextColor={'#dcb'}
                    style={styles.textField}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                {authState.signUpErrorMessage && <Text style={{ color: 'red' }}>{authState.signUpErrorMessage}</Text>}
                <TouchableOpacity style={styles.button} onPress={() => { 
                    authMethods.signUp({ username, password, first_name: firstName, last_name: lastName })
                        .catch(error => setError(error.message));
                    }}>
                    <Text style={styles.text}>Sign Up</Text>
                </TouchableOpacity>
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
    title: {
        fontSize: 20,
        letterSpacing: 1.5,
        textAlign: 'center',
        fontFamily: 'OldStandardTT_700Bold',
        paddingVertical: 20,
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
        fontSize: 32,
    },
    separator: {
        width: 220,
        height: 5,
        marginHorizontal: 'auto',
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

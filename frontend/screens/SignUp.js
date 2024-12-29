import React from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Image, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignUpScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');

    const { authState, authMethods } = React.useContext(AuthContext);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background-2.png')} style={styles.containerImage}>
                <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flex: 1, justifyContent: 'center', }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>
                <View style={styles.sectionContainer}>
                    <Text style={styles.subtitle}>Personal Information</Text>
                    <TextInput
                        placeholder="First Name"
                        placeholderTextColor={'#dcb'}
                        style={styles.textField}
                        value={firstName}
                        onChangeText={setFirstName}
                        multiline={true} /* See https://github.com/facebook/react-native/issues/28794#issuecomment-1152167549 */
                    />
                    <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                    <TextInput
                        placeholder="Last Name"
                        placeholderTextColor={'#dcb'}
                        style={styles.textField}
                        value={lastName}
                        onChangeText={setLastName}
                        multiline={true} /* See https://github.com/facebook/react-native/issues/28794#issuecomment-1152167549 */
                    />
                    <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.subtitle}>Credentials</Text>
                    <TextInput
                        placeholder="Username"
                        placeholderTextColor={'#dcb'}
                        style = {styles.textField}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                        multiline={true} /* See https://github.com/facebook/react-native/issues/28794#issuecomment-1152167549 */
                    />
                    <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={'#dcb'}
                        style={styles.textField}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        multiline={true} /* See https://github.com/facebook/react-native/issues/28794#issuecomment-1152167549 */
                        secureTextEntry
                    />
                    <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                </View>
                {authState.signUpErrorMessage && <Text style={{ color: 'red' }}>{authState.signUpErrorMessage}</Text>}
                <TouchableOpacity style={styles.button} onPress={() => { 
                    authMethods.signUp({ username, password, first_name: firstName, last_name: lastName })
                        .catch(error => setError(error.message));
                    }}>
                    <Text style={styles.text}>Sign Up</Text>
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
        textAlign: 'left',
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
        marginBottom: 10,
        opacity: 0.3,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30
    },
    button: {
        marginLeft: 20,
        marginRight: 20,
    },
    text: {
        fontSize: 24,
        textAlign: 'center',
    },
    sectionContainer: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.1)', // slight white overlay to visually separate sections
        borderRadius: 10,
    }
})

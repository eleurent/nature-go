import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { AuthContext } from '../authContext';

export default function SignInScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const { authState, authMethods } = React.useContext(AuthContext);

    return (
        <View style={{ "marginTop":120 }}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {authState.signInErrorMessage && <Text style={{ color: 'red' }}>{authState.signInErrorMessage}</Text>}
            <Button title="Sign in" onPress={() => {
                authMethods.signIn({ username, password })
                    .catch(error => setError(error.message));
            }} />
        </View>
    );
}
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    
    const handleLogin = () => {
        axios.post(
            'http://localhost:8000/api/auth/login/',
            { username: username, password: password },
        ).then(response => {
            axios.defaults.headers.common.Authorization = `Token ${response.data.token}`;
        }).catch(error => {console.error(error)})
    }

    const getObservations = () => {
        axios.get('http://localhost:8000/api/observations/', {

        }).then(response => {
            console.log(response);
        });
    }

    return (
        <View>
            <Text>Username:</Text>
            <TextInput value={username} onChangeText={setUsername} />
            <Text>Password:</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry={true} />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Observations" onPress={getObservations} />
        </View>
    );
}

export default Login;
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { AuthContext } from '../authContext';

export default function SignInScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const { authState, authMethods } = React.useContext(AuthContext);

    return (
        <View>
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

// const Login = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

    

//     const getObservations = () => {
//         axios.get('http://localhost:8000/api/observations/', {

//         }).then(response => {
//             console.log(response);
//         });
//     }

//     return (
//         <View>
//             <Text>Username:</Text>
//             <TextInput value={username} onChangeText={setUsername} />
//             <Text>Password:</Text>
//             <TextInput value={password} onChangeText={setPassword} secureTextEntry={true} />
//             <Button title="Login" onPress={handleLogin} />
//             <Button title="Observations" onPress={getObservations} />
//         </View>
//     );
// }

import React, { useReducer } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants'


const API_URL = Constants.expoConfig.extra.API_URL;
const LOGIN_URL = API_URL + 'api/auth/login/'
const LOGOUT_URL = API_URL + 'api/auth/logout/'
const REGISTER_URL = API_URL + 'api/auth/register/'
const PROFILE_URL = API_URL + 'api/profile/'  // For testing token

async function getItemAsync(key) {
    if (Platform.OS !== 'web') {
        return await SecureStore.getItemAsync(key);
    } else {
        return await AsyncStorage.getItem(key);
    }
}

async function setItemAsync(key, value) {
    if (Platform.OS !== 'web') {
        if (value == null)
            return await SecureStore.deleteItemAsync(key);
        return await SecureStore.setItemAsync(key, value);
    } else {
        if (value == null)
            return await AsyncStorage.removeItem(key);
        return AsyncStorage.setItem(key, value);
    }
}


export const AuthContext = React.createContext();


const authReducer = (prevState, action) => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...prevState,
                userToken: action.token,
                isLoading: false,
            };
        case 'SIGN_IN':
            return {
                ...prevState,
                userToken: action.token,
            };
        case 'SIGN_IN_ERROR':
            return {
                ...prevState,
                signInErrorMessage: action.message,
            };
        case 'SIGN_OUT':
            return {
                ...prevState,
                userToken: null,
            };
    }
};
const initialState = {
    isLoading: true,
    userToken: null,
    signInErrorMessage: null
};

export const useAuth = () => {

    const [authState, dispatch] = useReducer(authReducer, initialState);

    const authMethods = React.useMemo(
        () => ({
            signIn: async (data) => {
                axios.post(LOGIN_URL, { username: data.username, password: data.password }
                ).then(response => {
                    const userToken = response.data.token;
                    axios.defaults.headers.common.Authorization = `Token ${userToken}`;
                    try {
                        setItemAsync('userToken', userToken);
                    } catch (e) { console.error(e); }
                    dispatch({ type: 'SIGN_IN', token: userToken });
                }).catch(error => {
                    console.error('Login error', error);
                    let message = (error.code == 'ERR_BAD_REQUEST') ? 'Invalid username or password.' : error.message;
                    dispatch({ type: 'SIGN_IN_ERROR', message: message });
                })
            },
            signOut: () => {
                axios.get(LOGOUT_URL).catch(() => {})
                axios.defaults.headers.common.Authorization = null;
                try {
                    setItemAsync('userToken', null);
                } catch (e) { console.error(e); }
                dispatch({ type: 'SIGN_OUT' });
            },
            signUp: async (data) => {
                axios.post(REGISTER_URL, {
                    username: data.username, 
                    password: data.password,
                    first_name: data.first_name,
                    last_name: data.last_name
                })
                .then(response => {
                    const userToken = response.data.token;
                    axios.defaults.headers.common.Authorization = `Token ${userToken}`;
                    try {
                        setItemAsync('userToken', userToken);
                    } catch (e) { console.error(e); }
                    dispatch({ type: 'SIGN_IN', token: userToken });
                })
                .catch(error => {
                    console.error('Registration error', error);
                    let message = error.message;
                    dispatch({ type: 'SIGN_IN_ERROR', message: message });
                })
            },
            
        }),
        []
    );

    React.useEffect(() => {
        const restoreTokenAsync = async () => {
            let userToken;
            try {
                userToken = await getItemAsync('userToken');
            } catch (e) { console.error(e); }
            if (userToken) {
                console.log('Found user token: ' + userToken);
                // Check token validity
                axios.get(PROFILE_URL, { headers: { Authorization: `Token ${userToken}` } }).then(() => {
                    axios.defaults.headers.common.Authorization = `Token ${userToken}`;
                    dispatch({ type: 'RESTORE_TOKEN', token: userToken });
                }).catch(error => {
                    console.log("Invalid token, response status: " + error.response.status)
                    axios.defaults.headers.common.Authorization = null;
                    try {
                        setItemAsync('userToken', null);
                    } catch (e) { console.error(e); }
                    dispatch({ type: 'RESTORE_TOKEN', token: null });
                });
            } else {
                dispatch({ type: 'RESTORE_TOKEN', token: null });
            }
        };
        restoreTokenAsync();
    }, []);

    return { authState, authMethods };
};


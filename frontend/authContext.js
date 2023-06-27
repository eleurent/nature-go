import React, { useReducer } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';


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

const LOGIN_URL = 'http://localhost:8000/api/auth/login/'
const LOGOUT_URL = 'http://localhost:8000/api/auth/logout/'
const REGISTER_URL = 'http://localhost:8000/api/auth/register/'


export const AuthContext = React.createContext();


const authReducer = (prevState, action) => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            console.log('Found user token: ' + action.token);
            return {
                ...prevState,
                userToken: action.token,
                isLoading: false,
            };
        case 'SIGN_IN':
            return {
                ...prevState,
                isSignout: false,
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
                isSignout: true,
                userToken: null,
            };
    }
};
const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    signInErrorMessage: null
};

export const useAuth = () => {

    const [authState, dispatch] = useReducer(authReducer, initialState);

    React.useEffect(() => {
        const bootstrapAsync = async () => {
            let userToken;
            try {
                userToken = await getItemAsync('userToken');
                if (userToken) {
                    axios.defaults.headers.common.Authorization = `Token ${userToken}`;
                }
            } catch (e) { console.error(e);}
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };
        bootstrapAsync();
    }, []);

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
                axios.post(LOGOUT_URL).catch(() => {})
                axios.defaults.headers.common.Authorization = null;
                try {
                    setItemAsync('userToken', null);
                } catch (e) { console.error(e); }
                dispatch({ type: 'SIGN_OUT' });
            },
            signUp: async (data) => {
                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
        }),
        []
    );

    return { authState, authMethods };
};


import React, { useReducer } from 'react';
import axios from 'axios';
import Constants from 'expo-constants'


const API_URL = Constants.expoConfig.extra.API_URL;
const USER_PROFILE_URL = API_URL + 'api/profile/';

export const UserProfileContext = React.createContext();


const profileReducer = (prevState, action) => {
    switch (action.type) {
        case 'SET_PROFILE':
            return {
                ...prevState,
                profile: action.profile,
                avatar: action.profile.avatar ? global.AVATAR_PATHS[action.profile.avatar]: {},
            };
    }
};
const initialState = {
    profile: null,
    avatar: {}
};

export const useUserProfile = () => {
    const [profileState, dispatch] = useReducer(profileReducer, initialState);

    const profileMethods = React.useMemo(
        () => ({
            fetchProfile: async () => {
                axios.get(USER_PROFILE_URL).then(response => {
                    dispatch({ type: 'SET_PROFILE', profile: response.data });
                }).catch(error => {
                    console.log(error);
                    dispatch({ type: 'SET_PROFILE', profile: null });
                })
            },
            maybeSelectCharacter: (profileState, navigation) => {
                if (profileState.profile !== null && !profileState.profile.avatar) {
                    console.log('User avatar is empty, redirecting to character selection.')
                    navigation.replace('CharacterSelection');
                }
            },
            updateAvatarAsync: async (avatarName) => {
                let formData = new FormData();
                formData.append('avatar', avatarName);
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                };
                const response = await axios.patch(USER_PROFILE_URL, formData, config);
                dispatch({ type: 'SET_PROFILE', profile: response.data });
            }
        }),
        []
    );

    return { profileState, profileMethods };
};

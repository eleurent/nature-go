import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform, FlatList, Image } from 'react-native';
import { useFonts, SpecialElite_400Regular } from '@expo-google-fonts/special-elite';
import axios from 'axios';
import Constants from 'expo-constants'


const API_URL = Constants.expoConfig.extra.API_URL;
const QUIZ_GET_URL = API_URL + 'api/university/quiz/get_or_create/'



export default function SpeciesListScreen({ navigation, route }) {

    const [quiz, setQuiz] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(QUIZ_GET_URL);
                setQuiz(response.data);
            } catch (err) {
                console.error('Could not get a quizz')
            }
        };

        fetchQuiz();
    }, []);


    return (
        <View style={styles.container} >
        <ImageBackground source={require('../assets/images/page-background-2.png')} style={styles.containerImage}>
                <View style={styles.outline}>
                    <Text>UNIVERSITY OF OXFORD</Text>
                    <Text>{JSON.stringify(quiz)}</Text>
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
        justifyContent: 'center',
    },
    outline: {
        borderStyle: 'solid',
        padding: 20,
    }
});

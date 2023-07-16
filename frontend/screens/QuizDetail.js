import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform, FlatList, Image } from 'react-native';
import QuizButton from '../components/QuizButton'
import axios from 'axios';
import Constants from 'expo-constants'
import {
    useFonts,
    OldStandardTT_700Bold,
    OldStandardTT_400Regular,
} from '@expo-google-fonts/old-standard-tt';


const API_URL = Constants.expoConfig.extra.API_URL;
const QUIZ_GET_URL = API_URL + 'api/university/quiz/get_or_create/'



export default function QuizDetailScreen({ navigation, route }) {

    const [quiz, setQuiz] = useState(null);

    let [fontsLoaded] = useFonts({
        OldStandardTT_700Bold,
        OldStandardTT_400Regular
    });


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
                    <Text style={styles.title}>UNIVERSITY OF OXFORD</Text>
                    <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                    <Text style={styles.subtitle}>EXAMINATION PAPERS</Text>
                    <Text style={[styles.subtitle, {fontSize: 13}]}>FOR THE YEAR 1823,</Text>
                    {/* <Text styles={{}}>{JSON.stringify(quiz)}</Text> */}
                    <QuizButton label="Take the exam"/>
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
        resizeMode: 'cover',
        borderStyle: 'solid',
        borderWidth: 1.5,
        flex: 1,
        margin: 30,
        padding: 10,
        marginTop: 60,
    },
    title: {
        fontSize: 20,
        letterSpacing: 1.5,
        textAlign: 'center',
        fontFamily: 'OldStandardTT_700Bold',
        paddingVertical : 20,
    },
    subtitle: {
        fontSize: 17,
        letterSpacing: 1.7,
        textAlign: 'center',
        fontFamily: 'OldStandardTT_400Regular',
        paddingBottom : 10,
    },
    separator: {
        width: 220,
        height: 5,
        marginHorizontal: 'auto',
        marginBottom: 20,
    }
});

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform, FlatList, Image } from 'react-native';
import QuizButton from '../components/QuizButton'
import {
    useFonts,
    OldStandardTT_700Bold,
    OldStandardTT_400Regular,
} from '@expo-google-fonts/old-standard-tt';
import { QuizContext } from '../quizContext';

export default function QuizDetailScreen({ navigation, route }) {

    let [fontsLoaded] = useFonts({
        OldStandardTT_700Bold,
        OldStandardTT_400Regular
    });

    const { quizState, quizMethods } = useContext(QuizContext);
    useEffect(() => {
        quizMethods.getOrCreateQuiz();
    }, []);

    return (
        <View style={styles.container} >
        <ImageBackground source={require('../assets/images/page-background-2.png')} style={styles.containerImage}>
                <View style={styles.outline}>
                    <Text style={styles.title}>UNIVERSITY OF OXFORD</Text>
                    <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                    <Text style={styles.subtitle}>EXAMINATION PAPERS</Text>
                    <Text style={[styles.subtitle, {fontSize: 13}]}>FOR THE YEAR 1823,</Text>
                    <QuizButton label="Take the exam" onPress={() => {navigation.navigate('QuizQuestion', { id: 0 })}}/>
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
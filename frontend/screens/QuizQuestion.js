import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform, FlatList, Image } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import {
    useFonts,
    OldStandardTT_700Bold,
    OldStandardTT_400Regular,
} from '@expo-google-fonts/old-standard-tt';

import QuizButton from '../components/QuizButton'
import { QuizContext } from '../contexts/quizContext';

async function onPressContinue(id, quizState, quizMethods, navigation) {
    if (id < quizState.quiz.multiple_choice_questions.length - 1) {
        navigation.push('QuizQuestion', { id: id + 1 });
    } else {
        await quizMethods.answerQuiz(quizState);
        navigation.navigate('QuizResult');
    }
}

export default function QuizQuestionScreen({ navigation, route }) {

    let [fontsLoaded] = useFonts({
        OldStandardTT_700Bold,
        OldStandardTT_400Regular
    });

    const { quizState, quizMethods } = useContext(QuizContext);

    if (!fontsLoaded | ! quizState.quiz)
        return null;

    const question = quizState.quiz.multiple_choice_questions[route.params.id];
    return (
        <View style={styles.container} >
            <ImageBackground source={require('../assets/images/page-background-2.png')} style={styles.containerImage}>
                <View style={styles.outline}>
                    <Text style={styles.question}>{question.question }</Text>
                    <FlatList
                        style={{ marginTop: 40 }}
                        vertical
                        numColumns={1}
                        showsVerticalScrollIndicator={Platform.OS === 'web'}
                        data={question.choices}
                        contentContainerStyle={{}}
                        renderItem={({ item, index }) => {
                            return (
                                <QuizButton
                                    key={index}
                                    label={item}
                                    theme="question"
                                    selected={quizMethods.isQuestionSelected(quizState, route.params.id, index)}
                                    onPress={() => {quizMethods.selectQuestion(route.params.id, index);}}
                                />
                            );
                        }}
                    />
                    <QuizButton label="Continue" onPress={
                        () => onPressContinue(route.params.id, quizState, quizMethods, navigation)
                        } />
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
        // borderStyle: 'solid',
        // borderWidth: 1.5,
        flex: 1,
        margin: 30,
        padding: 10,
        marginTop: 60,
    },
    question: {
        fontSize: 29,
        letterSpacing: 1.5,
        textAlign: 'center',
        paddingVertical: 20,
    },

});

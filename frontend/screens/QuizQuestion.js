import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform, FlatList, Image } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
    useFonts,
    OldStandardTT_700Bold,
    OldStandardTT_400Regular,
} from '@expo-google-fonts/old-standard-tt';

import QuizButton from '../components/QuizButton'
import { QuizContext } from '../contexts/quizContext';

async function onPressContinue(id, quizState, quizMethods, navigation) {
    if (!quizMethods.isQuestionAnswered(quizState, id)) {
        quizMethods.answerQuiz(quizState);
    } else if (id < quizState.quiz.multiple_choice_questions.length - 1) {
        navigation.replace('QuizQuestion', { id: id + 1 });
    } else {
        await quizMethods.answerQuiz(quizState);
        navigation.replace('QuizResult');
    }
}

export default function QuizQuestionScreen({ navigation, route }) {

    let [fontsLoaded] = useFonts({
        OldStandardTT_700Bold,
        OldStandardTT_400Regular
    });
    const { quizState, quizMethods } = useContext(QuizContext);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props) => (
                <HeaderBackButton
                    {...props}
                    backImage={() => (
                        <Ionicons name='close' size={24} color='#000' />
                    )}
                    onPress={() => {
                        navigation.replace('QuizDetail');
                    }}
                />
            )
        });
    });

    if (!fontsLoaded | ! quizState.quiz)
        return null;

    const question = quizState.quiz.multiple_choice_questions[route.params.id];
    const hasSelectedAnswer = quizState.answers[route.params.id] !== null;
    const hasAnswered = quizMethods.isQuestionAnswered(quizState, route.params.id);
    const isCorrect = quizMethods.isAnswerCorrect(quizState, route.params.id);
    return (
        <View style={styles.container} >
            <ImageBackground source={require('../assets/images/page-background-2.png')} style={styles.containerImage}>
                {hasAnswered && isCorrect ? 
                <View style={styles.successContainer}>
                    <Ionicons name='md-checkmark-circle' size={30} color='#659900'/><Text style={styles.succesText}>Amazing!</Text>
                </View>: 
                hasAnswered && !isCorrect ?
                <View style={[styles.successContainer, styles.failureContainer]}>
                    <Ionicons name='md-close-circle' size={30} color='#d00'/><Text style={[styles.succesText, styles.failureText]}>Incorrect</Text>
                </View> :
                null}
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
                                    disabled={hasAnswered}
                                    onPress={() => quizMethods.selectQuestion(route.params.id, index)}
                                />
                            );
                        }}
                    />
                    <QuizButton
                        label={(hasSelectedAnswer ? (hasAnswered ? (isCorrect ? "Continue" : "Got it") : "Check") : "Continue").toUpperCase()}
                        theme={hasSelectedAnswer ? (hasAnswered ? (isCorrect ? "" : "failure") : "") : "disabled"}
                        disabled={!hasSelectedAnswer}
                        onPress={
                            () => onPressContinue(route.params.id, quizState, quizMethods, navigation)
                        }
                    />
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
    successContainer: {
        height: 140,
        backgroundColor: '#efffb6',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        padding: 15
    },
    failureContainer: {
        backgroundColor: '#ffccb6',
    },
    succesText: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#659900',
        marginLeft: 10,
    },
    failureText: {
        color: '#d00',
    },
});

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform, FlatList, Image } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import {
    useFonts,
    OldStandardTT_700Bold,
    OldStandardTT_400Regular,
} from '@expo-google-fonts/old-standard-tt';
import { QuizContext } from '../quizContext';

export default function QuizResultScreen({ navigation, route }) {

    let [fontsLoaded] = useFonts({
        OldStandardTT_700Bold,
        OldStandardTT_400Regular
    });

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props) => (
                <HeaderBackButton
                    {...props}
                    onPress={() => {
                        navigation.popToTop();
                        navigation.navigate('QuizDetail');
                    }}
                />
            )
        });
    });
    
    const { quizState, quizMethods } = useContext(QuizContext);
    const success = quizState.quiz.multiplechoiceuseranswer_set.every((item) => item.is_correct);
    return (
        <View style={styles.container} >
        <ImageBackground source={require('../assets/images/page-background-2.png')} style={styles.containerImage}>
                <View style={styles.outline}>
                    <Text style={styles.title}>EXAMINATION RESULT</Text>
                    <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                    <Text style={styles.text}>
                        {
                            success ? 'We are pleased to inform you that you have passed your examination.' 
                                    : 'We regret to inform you that you have failed your examination.'
                        }
                    </Text>
                    <FlatList
                        style={styles.resultsList}
                        horizontal
                        showsHorizontalScrollIndicator={Platform.OS === 'web'}
                        data={quizState.quiz.multiplechoiceuseranswer_set}
                        contentContainerStyle={{}}
                        renderItem={({ item, index }) => {
                            return item.is_correct ? (
                                <Text key={index} style={[styles.result, {color: 'green'}]}>✓</Text>
                            ) : (
                                <Text key={index} style={[styles.result, { color: 'red' }]}>✗</Text>
                            );
                        }}
                    />
                    <Text style={styles.text}>
                        {
                            success ? 'Your performance was excellent.' 
                                    : 'Your performance was not satisfactory.'
                        }
                    </Text>
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
    text: {
        fontSize: 17,
        fontFamily: 'OldStandardTT_400Regular',  // Special Elite
    },
    separator: {
        width: 220,
        height: 5,
        marginHorizontal: 'auto',
        marginBottom: 20,
    },
    resultsList: {
        marginVertical: 20, 
        marginHorizontal: 'auto',
    },
    result: {
        fontSize: 25,
    }
});

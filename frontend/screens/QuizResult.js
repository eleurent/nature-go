import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ImageBackground, StyleSheet, Platform, FlatList, Image, Animated, Easing } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HeaderBackButton } from '@react-navigation/elements';
import { QuizContext } from '../contexts/QuizContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function QuizResultScreen({ navigation, route }) {

    const fadeAnim = new Animated.Value(0);
    const [totalXP, setTotalXP] = useState(0);
    const { quizState, quizMethods } = useContext(QuizContext);
    const success = quizState.quiz.multiplechoiceuseranswer_set.every((item) => item.is_correct);
    const isQuestionCorrect = (item) => item.breakdown.find((reason) => 'Correctness' in reason.reason).value
    const questionDifficulty = (item) => item.breakdown.find((reason) => 'Difficulty' in reason.reason).reason.Difficulty


    useEffect(() => {
        if (quizState.quiz.xp) {
            fadeAnim.addListener(({ value }) => setTotalXP(Math.round(value)));
            Animated.timing(fadeAnim, {
                toValue: quizState.quiz.xp.total,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
        }
    }, [quizState.quiz]);


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
                        style={{ marginTop: 10, marginBottom: 10 }}
                        vertical
                        numColumns={1}
                        showsVerticalScrollIndicator={Platform.OS === 'web'}
                        data={quizState.quiz.xp.breakdown}
                        contentContainerStyle={{}}
                        renderItem={({ item, index }) => {
                            return (
                                <View key={index} style={styles.breakdownContainer}>
                                    {
                                        isQuestionCorrect(item) ? 
                                        <Ionicons name='checkmark-circle' size={30} color='#659900' style={{marginTop: -3}}/> : 
                                        <Ionicons name='close-circle' size={30} color='#d00' style={{ marginTop: -3 }} />
                                    }
                                    <Text style={styles.breakdownReason}>{questionDifficulty(item)}</Text>
                                    <Text style={styles.breakdownValue}>{Math.round(item.total)} XP</Text>
                                </View>
                            );
                        }}
                    />
                    <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                    <View style={styles.totalContainer}>
                        <Text style={styles.total}>TOTAL</Text>
                        <Animated.Text style={[styles.total, styles.totalValue]}>{totalXP} XP</Animated.Text>
                    </View>


                    <Text style={[styles.text, {textAlign: 'center'}]}>
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
        marginTop: 100,
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
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20,
    },
    resultsList: {
        marginVertical: 20, 
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    result: {
        fontSize: 25,
        fontFamily: 'OldStandardTT_400Regular',  // Special Elite
    },
    breakdownContainer: {
        flexDirection: "row",
        marginBottom: 10,
        marginTop: 5,
    },
    totalContainer: {
        flexDirection: "row",
        marginBottom: 10,
        marginTop: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    total: {
        // fontFamily: "Tinos_400Regular",
        fontSize: 24,
        color: "#444",
    },
    totalValue: {
        color: "#F35",
        marginLeft: 5
    },
    breakdownReason: {
        fontSize: 18,
        color: "#444",
        marginRight: 10,
        marginLeft: 10,
        fontFamily: 'OldStandardTT_400Regular',  // Special Elite
    },
    breakdownValue: {
        marginLeft: 'auto',
        fontSize: 16,
        color: "#F35",
    },

});

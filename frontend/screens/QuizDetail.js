import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ImageBackground, StyleSheet, Platform, FlatList, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import QuizButton from '../components/QuizButton';
import { QuizContext } from '../contexts/QuizContext';

const toRomanNumeral = num => {
    const lookup = [
        ['M', 1000],
        ['CM', 900],
        ['D', 500],
        ['CD', 400],
        ['C', 100],
        ['XC', 90],
        ['L', 50],
        ['XL', 40],
        ['X', 10],
        ['IX', 9],
        ['V', 5],
        ['IV', 4],
        ['I', 1],
    ];
    return lookup.reduce((acc, [k, v]) => {
        acc += k.repeat(Math.floor(num / v));
        num = num % v;
        return acc;
    }, '');
};

export default function QuizDetailScreen({ navigation, route }) {

    const { quizState, quizMethods } = useContext(QuizContext);
    useEffect(() => {
        quizMethods.getOrCreateQuiz();
        console.log(quizState.quiz)
    }, []);

    const getSpecies = ({ species, species_name }) => ({ species, species_name });
    const quizSpecies = quizState.quiz?.multiple_choice_questions?.map(getSpecies);
    const uniqueSpecies = [...new Set(quizSpecies)];
    const hasQuiz = uniqueSpecies.length > 0;

    return (
        <View style={styles.container} >
        <ImageBackground source={require('../assets/images/page-background-2.png')} style={styles.containerImage}>
            <View style={styles.outline}>
                <Text style={styles.title}>UNIVERSITY OF OXFORD</Text>
                <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                <Text style={styles.subtitle}>EXAMINATION PAPERS</Text>
                <Text style={[styles.subtitle, {fontSize: 13}]}>{'FOR THE YEAR ' + (new Date().getFullYear() - 200) + ','}</Text>
                <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                <Text style={[styles.subtitle, { fontSize: 25 }]}>Syllabus</Text>
                {hasQuiz ?
                <FlatList
                            style={{ marginTop: 30, marginBottom: 10, marginLeft: 20, marginRight: 20 }}
                    vertical
                    scrollEnabled={false}
                    numColumns={1}
                    showsVerticalScrollIndicator={Platform.OS === 'web'}
                    data={uniqueSpecies}
                    contentContainerStyle={{}}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => navigation.navigate('SpeciesDetail', { 'id': item.species })} >
                                <Text style={styles.syllabusSpeciesName}>{toRomanNumeral(index+1)}. {item.species_name}</Text>
                            </TouchableOpacity>
                        );
                    }}
                /> : <Text style={styles.emptyQuizText}>
                    Before exam season starts, I should take a field trip and gather observations.
                    </Text>
                }
                    <QuizButton label="Take the exam" theme={hasQuiz ? "" : "disabled"} disabled={!hasQuiz} onPress={() => {navigation.replace('QuizQuestion', { id: 0 })}}/>
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
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20,
    },
    emptyQuizText: {
        marginBottom: 'auto',
        marginTop: 150,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 20,
        fontFamily: 'Tinos_400Regular',
        textAlign: 'center'
    },
    syllabusSpeciesName: {
        fontFamily: 'OldStandardTT_400Regular',
        fontSize: 20,
        marginBottom: 50,
        textDecorationLine: 'underline'
    }
});

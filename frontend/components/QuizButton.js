import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text, TouchableHighlight } from 'react-native';



export default function QuizButton({ label, theme, onPress, selected }) {

    if (theme === "question") {
        return (
            <View
                style={[styles.buttonContainer, {}]}
            >
                <TouchableHighlight 
                    style={[
                        styles.button,
                        styles.choiceButton,
                        selected ? styles.selectedButton : {}
                    ]}
                    onPress={onPress}
                    activeOpacity={0.85}
                    underlayColor={'#7AB5D7'}
                >
                    <Text 
                        style={[
                            styles.buttonLabel,
                            styles.choiceButtonLabel,
                            selected ? styles.selectedChoiceButtonLabel : {}]}
                    >{label}</Text>
                </TouchableHighlight>
            </View>
        );
    }
    return (
        <View style={styles.buttonContainer}>
            <Pressable 
                style={({ pressed }) => [
                    styles.button,
                    pressed ? styles.pressedButton : {}
                ]} 
                onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 283,
        // marginHorizontal: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#64C242',

        overflow: 'visible',
    },
    choiceButton: {
        backgroundColor: "none", 
        borderWidth: 1,
        borderColor: "#ababab",
        borderRadius: 18,
    },
    pressedButton: {
        backgroundColor: '#539F38',
    },
    selectedButton: {
        backgroundColor: '#DEF1FE',
        borderColor: '#8AD4FD'
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 22,
    },
    choiceButtonLabel: {
        color: '#333',
    },
    selectedChoiceButtonLabel: {
        color: '#359AD7',
    },
});
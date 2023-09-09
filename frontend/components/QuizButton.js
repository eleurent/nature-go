import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text, TouchableHighlight, TouchableOpacity } from 'react-native';



export default function QuizButton({ label, theme, onPress, selected, styleOverride }) {

    if (theme === "question") {
        return (
            <View
                style={[styles.buttonContainer, {}]}
            >
                <TouchableHighlight 
                    style={[styles.buttonTouchable, styles.choiceButtonTouchable, selected ? styles.selectedButtonTouchable : {}]}
                    onPress={onPress}
                    activeOpacity={0.85}
                    underlayColor={'#7AB5D7'}
                >
                    <View style={[
                        styles.button,
                        styles.choiceButton,
                    ]}>
                        <Text 
                            style={[
                                styles.buttonLabel,
                                styles.choiceButtonLabel,
                                selected ? styles.selectedChoiceButtonLabel : {}]}
                        >{label}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
    return (
        <View style={[styles.buttonContainer, styleOverride]}>
            <Pressable 
                style={({ pressed }) => [
                    styles.button,
                    styles.buttonTouchable,
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
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    buttonTouchable: {
        borderRadius: 10,
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    choiceButtonTouchable: {
        borderWidth: 1,
        borderColor: "#ababab",
        borderRadius: 18,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#64C242',
        overflow: 'visible',
    },
    choiceButton: {
        backgroundColor: "none", 
    },
    pressedButton: {
        backgroundColor: '#539F38',
    },
    selectedButtonTouchable: {
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
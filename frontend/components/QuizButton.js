import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text, TouchableHighlight } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';



export default function QuizButton({ label, theme, onPress, selected, disabled, styleOverride }) {

    if (theme === "question") {
        return (
            <View
                style={[styles.buttonContainer, {}]}
            >
                <TouchableHighlight 
                    style={[styles.buttonTouchable, styles.choiceButtonTouchable, selected ? styles.selectedButtonTouchable : {}]}
                    disabled={disabled}
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
    else if (theme === "disabled") {
        return (
            <View style={[styles.buttonContainer, styleOverride]}>
                <Pressable
                    disabled={disabled}
                    style={({ pressed }) => [
                        styles.button,
                        styles.buttonTouchable,
                        styles.disabledButton,
                    ]}
                    onPress={onPress}>
                    <Text style={[styles.buttonLabel, styles.disabledButtonLabel]}>{label}</Text>
                </Pressable>
            </View>
        );
    }
    else if (theme === "failure") {
        return (
            <View style={[styles.buttonContainer, styleOverride]}>
                <Pressable
                    disabled={disabled}
                    style={({ pressed }) => [
                        styles.button,
                        styles.buttonTouchable,
                        styles.failureButton,
                    ]}
                    onPress={onPress}>
                    <Text style={[styles.buttonLabel, styles.failureButtonLabel]}>{label}</Text>
                </Pressable>
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
        width: '100%',
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
    disabledButton: {
        backgroundColor: '#dce2e6',
    },
    failureButton: {
        backgroundColor: '#e00',
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

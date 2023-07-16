import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';



export default function QuizButton({ label, theme, onPress }) {

    const [selected, setSelected] = useState(false);

    function onSelect() {
        setSelected(!selected);
        // onPress();
    }

    if (theme === "question") {
        return (
            <View
                style={[styles.buttonContainer, {}]}
            >
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        styles.choiceButton,
                        pressed ? styles.pressedButton : selected? styles.selectedButton : {}
                    ]} onPress={onSelect}
                >
                    <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
                </Pressable>
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
        marginHorizontal: 'auto',
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
        shadowColor: 'black',
        shadowOffset: {
            height: 5
        },
        shadowOpacity: 1,
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
        backgroundColor: '#00f',
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 22,
    },
});
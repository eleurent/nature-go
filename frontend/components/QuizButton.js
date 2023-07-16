import { StyleSheet, View, Pressable, Text } from 'react-native';

export default function QuizButton({ label, theme, onPress }) {
    // if (theme === "question") {
    //     return (
    //         <View
    //             style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18 }]}
    //         >
    //             <Pressable
    //                 style={[styles.button, { backgroundColor: "#fff" }]}
    //                 onPress={onPress}
    //             >
    //                 <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
    //             </Pressable>
    //         </View>
    //     );
    // }
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={({ pressed }) => [styles.button, pressed ? styles.pressedButton: {}]} onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 283,
        height: 55,
        marginHorizontal: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: 40,
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
    pressedButton: {
        backgroundColor: '#539F38',
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 22,
    },
});
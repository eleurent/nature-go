import React, { useState, useRef } from "react";
import { Button, StyleSheet, Text, View, Modal, Image, Platform, Animated, Easing } from "react-native";
import QuizButton from "./QuizButton";
import { FlatList } from "react-native-gesture-handler";


const parseReason = (reason) => {
    if ('Rarity' in reason){
        if (reason.Rarity === 'Common')
            return 'Common species';
        else if (reason.Rarity === 'Uncommon')
            return 'Uncommon species';
        else if (reason.Rarity === 'Rare')
            return 'Rare species';
        else if (reason.Rarity === 'Epic')
            return 'Epic species';
        else if (reason.Rarity === 'Legendary')
            return 'Legendary species';
    } else if ('Familiarity' in reason) {
        if (reason.Familiarity === 'New')
            return 'New species discovered!';
        if (reason.Familiarity === 'Unfamiliar')
            return 'Unfamiliar';
        else if (reason.Familiarity === 'Familiar')
            return 'Familiar';
        else if (reason.Familiarity === 'Expert')
            return 'Expert';
    }   
    // Default case:
    return JSON.stringify(reason);
}

function XPModal({ isVisible, xpData, onClose }) {
    
    const fadeAnim = new Animated.Value(0);
    const [totalXP, setTotalXP] = useState(0);

    // trigger the animation when the modal appears
    React.useEffect(() => {
        if (isVisible && xpData) {
            fadeAnim.addListener(({ value }) => setTotalXP(Math.round(value)));
            Animated.timing(fadeAnim, {
                toValue: xpData.total,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible]);

    if (!xpData) return null;
    return (
        <Modal visible={isVisible} onBackdropPress={onClose} transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <FlatList
                        style={{ marginTop: 10, marginBottom: 10 }}
                        vertical
                        numColumns={1}
                        showsVerticalScrollIndicator={Platform.OS === 'web'}
                        data={xpData.breakdown}
                        contentContainerStyle={{}}
                        renderItem={({ item, index }) => {
                            return (
                                <View key={index} style={styles.totalContainer}>
                                    <Text style={styles.breakdownReason}>{parseReason(item.reason).toUpperCase()}</Text>
                                    <Text style={styles.breakdownValue}>{item.value} XP</Text>
                                </View>
                            );
                        }}
                    />
                    <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                    <View style={styles.totalContainer}>
                        <Text style={styles.total}>TOTAL</Text>
                        <Animated.Text style={[styles.total, styles.totalValue]}>{totalXP} XP</Animated.Text>
                    </View>
                    <QuizButton label="OK" onPress={onClose} styleOverride={{width: 200}}/>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modal: {
        backgroundColor: "#fdf4e3",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
        shadowColor: "#333",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.15
    },
    totalContainer: {
        flexDirection: "row",
        marginBottom: 10,
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
    separator: {
        width: 200,
        height: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20,
    },
    breakdownReason: {
        fontSize: 14,
        color: "#444",
        marginRight: 10,
    },
    breakdownValue: {
        marginLeft: 'auto',
        fontSize: 14,
        color: "#F35",
    },
});

export default XPModal;

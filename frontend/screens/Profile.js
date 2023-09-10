import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/authContext';

const XPBar = (props) => {
    return (
        <View style={styles.xpBarBackground}>
            <View style={styles.xpBarForeground}></View>
        </View>
    )
}

export default function ProfileScreen({ navigation, route }) {
    const { authMethods } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <SafeAreaView style={styles.containerInsideImage}>
                    <View style={styles.header}>
                        <Image source={require('../assets/images/avatar_full.png')} style={styles.avatar}/>
                        <View style={styles.statsContainer}>
                            <Text style={styles.title}>Undergraduate</Text>
                            <XPBar/>
                            <Text style={styles.xpText}>165 / 200 XP</Text>
                            <Text style={styles.level}>2</Text>
                            <Text style={styles.levelText}>LEVEL</Text>
                            <View style={styles.statsTable}>
                                <View style={styles.statsRow}>
                                    <Text style={styles.statsKey}>Major</Text>
                                    <Text style={styles.statsValue}>Botany</Text>
                                </View>
                                <View style={styles.statsRow}>
                                    <Text style={styles.statsKey}>Species discovered</Text>
                                    <Text style={styles.statsValue}>8</Text>
                                </View>
                                <View style={styles.statsRow}>
                                    <Text style={styles.statsKey}>Exams passed</Text>
                                    <Text style={styles.statsValue}>2</Text>
                                </View>
                                <View style={styles.statsRow}>
                                    <Text style={styles.statsKey}>Exams failed</Text>
                                    <Text style={styles.statsValue}>6</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                    {/* <Button title="Sign out" onPress={authMethods.signOut} /> */}
                    <TouchableOpacity style={styles.button} onPress={authMethods.signOut}>
                        <Text style={styles.buttonText}>Sign out</Text>
                    </TouchableOpacity>
                </SafeAreaView>
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
    },
    containerInsideImage: {
        flex: 1,
        marginTop: 60,
        flexDirection: 'column'
    },
    header: {
        flexDirection: 'row',
    },
    avatar: {
        width: 140,
        height: 'auto',
        marginLeft: 20,
        aspectRatio: 9/20,
    },
    statsContainer: {
        marginLeft: 20,
    },
    title: {
        fontSize: 25,
        fontFamily: 'OldStandardTT_400Regular',
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    xpBarBackground: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#999',
        borderRadius: 5,
        width: 168,
        height: 9,
    },
    xpBarForeground: {
        marginTop: 1,
        marginLeft: 1,
        backgroundColor: '#F5C92D',
        borderRadius: 4.8,
        width: 95,
        height: 7,
    },
    xpText: {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: 12,
        fontFamily: 'OldStandardTT_400Regular',
    },
    level: {
        marginTop: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: 44,
        fontFamily: 'OldStandardTT_400Regular',
    },
    levelText: {
        marginTop: -5,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: 12,
        fontFamily: 'OldStandardTT_400Regular',
    },
    statsTable: {
        marginTop: 40,
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    statsKey: {
        fontSize: 15,
        fontFamily: 'OldStandardTT_700Bold',
    },
    statsValue: {
        fontSize: 15,
        fontFamily: 'OldStandardTT_400Regular',
        marginLeft: 'auto',
    },
    separator: {
        width: 200,
        height: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 20,
        marginBottom: 20,
    },
    button: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    buttonText: {
        fontSize: 24,
        fontFamily: 'Tinos_400Regular',
    }
});

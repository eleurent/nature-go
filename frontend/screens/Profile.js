import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, Pressable, FlatList, Modal, Button } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import { UserProfileContext } from '../contexts/UserProfileContext';
import XPBar from '../components/XPBar';
import ImageModal from '../components/ImageModal';
import BadgeList from '../components/BadgeList';

const API_URL = Constants.expoConfig.extra.API_URL;


export default function ProfileScreen({ navigation, route }) {
    const { authMethods } = useContext(AuthContext);
    const { profileState, profileMethods } = useContext(UserProfileContext);
    const [modalVisible, setModalVisible] = useState(false);
    const profileData = profileState.profile;

    useEffect(() => {
        profileMethods.fetchProfile();
        profileMethods.fetchBadges(); 
    }, []);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <SafeAreaView style={styles.containerInsideImage}>
                    <View style={styles.header}>
                        <Pressable style={styles.avatarContainer} onPress={() => setModalVisible(true)}>
                            <Image source={profileState.avatar?.full} style={styles.avatar} />
                        </Pressable>
                        <View style={styles.statsContainer}>
                            <Text style={styles.title}>Undergraduate</Text>
                            <XPBar data={profileData} />
                            <Text style={styles.xpText}>{profileData ? (profileData.xp - profileData.current_level_xp) : 0} / {profileData ? (profileData.next_level_xp - profileData.current_level_xp) : 0} XP</Text>
                            <Text style={styles.level}>{profileData ? profileData.level : 0}</Text>
                            <Text style={styles.levelText}>LEVEL</Text>
                            <View style={styles.statsTable}>
                                <View style={styles.statsRow}>
                                    <Text style={styles.statsKey}>Major</Text>
                                    <Text style={styles.statsValue}>Botany</Text>
                                </View>
                                <View style={styles.statsRow}>
                                    <Text style={styles.statsKey}>Observations made</Text>
                                    <Text style={styles.statsValue}>{profileData ? profileData.observations_count : 0}</Text>
                                </View>
                                <View style={styles.statsRow}>
                                    <Text style={styles.statsKey}>Species discovered</Text>
                                    <Text style={styles.statsValue}>{profileData ? profileData.species_count : 0}</Text>
                                </View>
                                <View style={styles.statsRow}>
                                    <Text style={styles.statsKey}>Exams taken</Text>
                                    <Text style={styles.statsValue}>{profileData ? profileData.quiz_count : 0}</Text>
                                </View>
                                <View style={styles.statsRow}>
                                    <Text style={styles.statsKey}>Mean exam score</Text>
                                    <Text style={styles.statsValue}>{profileData ? (profileData.quiz_mean_score * 100).toFixed(0) : 0}%</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Image source={require('../assets/images/separator.png')} style={styles.separator}/>
                    <BadgeList badgeData={profileState?.badges}/>
                    <TouchableOpacity style={styles.button} onPress={authMethods.signOut}>
                        <Text style={styles.buttonText}>Sign out</Text>
                    </TouchableOpacity>
                    <ImageModal modalVisible={modalVisible} setModalVisible={setModalVisible} modalBadgeImage={profileState.avatar?.full} backgroundColor='rgba(230,200,150,0.5)'/>
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
    avatarContainer: {
        flex: 1,
        marginLeft: 10,
        height: 320,
    },
    avatar: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    statsContainer: {
        flex: 1.2,
        marginLeft: 10,
        marginRight: 10,
    },
    title: {
        fontSize: 25,
        fontFamily: 'OldStandardTT_400Regular',
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
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
    },
});

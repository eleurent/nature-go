import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, Pressable, FlatList, Modal, Button } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import { UserProfileContext } from '../contexts/UserProfileContext';
import ImageModal from '../components/ImageModal';

const API_URL = Constants.expoConfig.extra.API_URL;

const XPBar = ({data}) => {
    const maxWidth = styles.xpBarBackground.width - 2;
    let width = data ? (data.xp - data.current_level_xp) / (data.next_level_xp - data.current_level_xp) * maxWidth : 0;

    return (
        <View style={styles.xpBarBackground}>
            <View style={[styles.xpBarForeground, {width}]}></View>
        </View>
    )
}

export const BADGE_IMAGES = {
    corvid_connoisseur: {
      uri: require('../assets/images/badges/duck.png')
    },
    owl_observer: {
      uri: require('../assets/images/badges/raptors.png')
    }
  }

const BadgeListView = ({ badgeData }) => {
    const [selectedBadge, setSelectedBadge] = useState(null);
  
    // Assuming a function to fetch badge images based on the badge name
    const fetchBadgeImage = async (badgeName) => {
      // ... your implementation to fetch image URLs 
    };
  
    useEffect(() => {
      // Fetch badge images when the component mounts or badgeData changes
      // ... your implementation to update the badgeData with image URLs
    }, [badgeData]);
  

    const renderBadgeItem = ({ item }) => {
        const badgeName = item.badge.name.toLowerCase().replace(/ /g, '_'); // Convert to snake_case
        const imageSource = BADGE_IMAGES[badgeName]; // Adjust path if needed
    
        return (
          <TouchableOpacity onPress={() => setSelectedBadge(item)}>
            <Image source={imageSource?.uri} style={styles.badgeImage} />
          </TouchableOpacity>
        );
      };
  
    const renderModalContent = () => {
        const badgeName = selectedBadge.badge.name.toLowerCase().replace(/ /g, '_'); // Convert to snake_case
        const imageSource = BADGE_IMAGES[badgeName]; // Adjust path if needed

        return (
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Image source={imageSource?.uri} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{selectedBadge.badge.name}</Text>
            <Text>{selectedBadge.badge.description}</Text>
            {selectedBadge.badge.species_list && (
                <View>
                <Text style={styles.speciesTitle}>Species:</Text>
                {selectedBadge.badge.species_list.map(species => (
                    <Text key={species}>
                    {species} {selectedBadge.badge.species_observed.includes(species) ? '(Observed)' : ''}
                    </Text>
                ))}
                </View>
            )}
            <Button title="Close" onPress={() => setSelectedBadge(null)} />
            </View>
        </View>
        );
    };
  
    return (
      <View>
        <FlatList
          data={badgeData}
          renderItem={renderBadgeItem}
          keyExtractor={(item) => item.badge.name}
          numColumns={2} // Adjust for your desired layout
        />
        <Modal visible={selectedBadge !== null} animationType="slide" onRequestClose={() => setSelectedBadge(null)}>
          {selectedBadge && renderModalContent()}
        </Modal>
      </View>
    );
  };

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
                    <BadgeListView badgeData={profileState?.badges}/>
                    <TouchableOpacity style={styles.button} onPress={authMethods.signOut}>
                        <Text style={styles.buttonText}>Sign out</Text>
                    </TouchableOpacity>
                    <ImageModal modalVisible={modalVisible} setModalVisible={setModalVisible} modalImage={profileState.avatar?.full} backgroundColor='rgba(230,200,150,0.5)'/>
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
    xpBarBackground: {
        marginRight: 'auto',
        marginLeft: 'auto',
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
    },
    badgesContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    badgeImage : {
        width: 96,
        height: 96,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    speciesTitle: {
        fontWeight: 'bold',
        marginTop: 10,
    },
});

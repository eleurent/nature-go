import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, FlatList, Platform, ScrollView } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements'
import axios from 'axios';
import Constants from 'expo-constants'
import ObservationCarousel from '../components/ObservationCarousel';
import ImageModal from '../components/ImageModal';
import Animated from 'react-native-reanimated';
import { Badge } from '@rneui/themed';

const API_URL = Constants.expoConfig.extra.API_URL;
const SPECIES_DETAILS_URL = (id) => API_URL + `api/species/${id}/`
const SPECIES_OBSERVATIONS_URL = (id) => API_URL + `api/species/${id}/observations/`


const RarityBadge = ({ rarity }) => {

    const rarityStyles = {
        'Very Common': { backgroundColor: '#333', borderColor: '#333' },
        'Common': { backgroundColor: '#333', borderColor: '#333' },
        'Uncommon': { backgroundColor: '#070', borderColor: '#070' },
        'Rare': { backgroundColor: '#05f', borderColor: '#05f' },
        'Legendary': { backgroundColor: '#e60', borderColor: '#e60' },
    };

    return (
      <Badge
        value={rarity}
        status="primary"
        badgeStyle={rarityStyles[rarity]}
        textStyle={{color:"#efe"}}
      />
    );
  };
  
export default function SpeciesDetailScreen({ navigation, route }) {

    const [speciesDetails, setSpeciesDetails] = useState({});
    const [speciesObservations, setSpeciesObservations] = useState([]);
    const [modalImage, setModalImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        const fetchSpeciesDetails = async () => {
            const response = await axios.get(SPECIES_DETAILS_URL(route.params.id));
            console.log(response.data);
            setSpeciesDetails(response.data);
        };
        const fetchSpeciesObservations = async () => {
            const response = await axios.get(SPECIES_OBSERVATIONS_URL(route.params.id));
            console.log(response.data);
            setSpeciesObservations(response.data);
        };

        fetchSpeciesDetails();
        fetchSpeciesObservations();
    }, []);

    let illustration_url = ("illustration_url" in speciesDetails) ? 
                           speciesDetails.illustration_url.replace('http://localhost/', API_URL) : null;
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <ScrollView>
                <Animated.Image
                    style={styles.illustrationImage}
                    resizeMode='contain'
                    source={{ uri: illustration_url }}
                    placeholder='empty'
                    sharedTransitionTag={"species" + route.params.id}
                />
                <View style={styles.textContainer}>
                    <Text style={[styles.speciesName, styles.nameContainer]}>{speciesDetails.display_name ? speciesDetails.display_name : "Name"}</Text>
                    <Text style={[styles.speciesScientificName, styles.nameContainer, {marginBottom: 5}]}>{speciesDetails.scientificNameWithoutAuthor ? speciesDetails.scientificNameWithoutAuthor : "Scientific name"}</Text>
                    {speciesDetails.rarity ? <RarityBadge rarity={speciesDetails.rarity} /> : null}
                    <FlatList
                        style={{ marginBottom: 20 }}
                        vertical
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={Platform.OS === 'web'}
                        data={speciesDetails.descriptions}
                        contentContainerStyle={{}}
                        renderItem={({ item, index }) => {
                            return (
                                <Text key={index} style={styles.descriptionText}>
                                    { item }
                                </Text>
                            );
                        }}
                    />
                </View>
                <ImageModal modalVisible={modalVisible} setModalVisible={setModalVisible} modalImage={modalImage}/>
                <ObservationCarousel observations={speciesObservations} onImagePress={(image) => {setModalImage(image); setModalVisible(true);}}/>
                </ScrollView>
            </ImageBackground>
        </View>
    )
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
    illustrationImage: {
        marginTop: 60,
        width: 375,
        height: 375
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    nameContainer: {
        textAlign: 'center',
    },
    speciesName: {
        marginTop: 10,
        fontFamily: 'SpecialElite_400Regular',
        fontWeight: 400,
        fontSize: 20,
        color: '#331100',
        opacity: 0.9
    },
    speciesScientificName: {
        // fontFamily: 'Tinos_400Regular_Italic',
        fontSize: 12,
        color: '#332200',
        opacity: 0.7
    },
    descriptionText: {
        fontFamily: 'SpecialElite_400Regular',
        fontSize: 15,
        // fontFamily: 'Parisienne_400Regular',
        // fontSize: 20,
        color:  '#332200',
        opacity: 0.7,
        marginTop: 30,
        paddingHorizontal: 20,
        textAlign: 'justify',
    },
});

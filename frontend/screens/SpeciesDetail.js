import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, FlatList, Platform } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements'
import axios from 'axios';
import Constants from 'expo-constants'
import ObservationCarousel from '../components/ObservationCarousel';
import ObservationImageModal from '../components/ObservationImageModal';
import Animated from 'react-native-reanimated';

const API_URL = Constants.expoConfig.extra.API_URL;
const SPECIES_DETAILS_URL = (id) => API_URL + `api/species/${id}/`
const SPECIES_OBSERVATIONS_URL = (id) => API_URL + `api/species/${id}/observations/`


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

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => {
                navigation.navigate('SpeciesList');
              }}
            />
          ),
        });
      }, [navigation]);

    let illustration_url = ("illustration_url" in speciesDetails) ? 
                           speciesDetails.illustration_url.replace('http://localhost/', API_URL) : null;
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <Animated.Image
                    style={styles.illustrationImage}
                    resizeMode='contain'
                    source={{ uri: illustration_url }}
                    placeholder='empty'
                    sharedTransitionTag={"species" + route.params.id}
                />
                <View style={styles.textContainer}>
                    <Text style={[styles.speciesName, styles.nameContainer]}>{speciesDetails.display_name ? speciesDetails.display_name : "Name"}</Text>
                    <Text style={[styles.speciesScientificName, styles.nameContainer]}>{speciesDetails.scientificNameWithoutAuthor ? speciesDetails.scientificNameWithoutAuthor : "Scientific name"}</Text>
                    <FlatList
                        style={{ marginTop: 60 }}
                        vertical
                        numColumns={2}
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
                <ObservationImageModal modalVisible={modalVisible} setModalVisible={setModalVisible} modalImage={modalImage}/>
                <ObservationCarousel observations={speciesObservations} onImagePress={(image) => {setModalImage(image); setModalVisible(true);}}/>
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
        fontSize: 14,
        color:  '#332200',
        opacity: 0.7,
        marginTop: 30,
        paddingHorizontal: 20,
        textAlign: 'justify',
    },
});

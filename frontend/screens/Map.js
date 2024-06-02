import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, Pressable } from 'react-native';
import Constants from 'expo-constants'
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import MapView, { Marker } from '../components/CustomMapView';

const API_URL = Constants.expoConfig.extra.API_URL;
const SPECIES_LIST_URL = API_URL + 'api/species/'
const SPECIES_OBSERVATIONS_URL = (id) => API_URL + `api/species/${id}/observations/`


export default function MapScreen({ navigation, route }) {
    const [speciesList, setSpeciesList] = useState([]);
    const [speciesObservations, setSpeciesObservations] = useState({});

    useEffect(() => {
        const fetchSpeciesListandObservations = async () => {
            const response = await axios.get(SPECIES_LIST_URL);
            setSpeciesList(response.data);
            const observations = {};
            for (const species of response.data) {
              observations[species.id] = await fetchSpeciesObservations(species.id);
            }
            setSpeciesObservations(observations);
          };

        const fetchSpeciesObservations = async (species_id) => {
            response = await axios.get(SPECIES_OBSERVATIONS_URL(species_id));
            return response.data;
        };

        fetchSpeciesListandObservations();
        
    }, []);

    let locations = Object.values(speciesObservations).flatMap(observations => observations.map(obs => obs.location));
    locations = locations.filter(location => location.latitude !== null);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <SafeAreaView style={styles.containerInsideImage}>
                <MapView
                    style={styles.map}
                    scrollEnabled={true}
                    zoomEnabled={true}
                >
                {locations && locations.map((coordinate, index) => <Marker key={index} coordinate={coordinate}/>)}
                </MapView>
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
    map: {
        width: '100%',
        height: '90%',
    },
});

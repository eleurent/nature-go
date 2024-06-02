import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, Pressable } from 'react-native';
import Constants from 'expo-constants'
import axios from 'axios';
import MapView, { Marker } from '../components/CustomMapView';

const API_URL = Constants.expoConfig.extra.API_URL;
const SPECIES_LIST_URL = API_URL + 'api/species/'
const SPECIES_OBSERVATIONS_URL = (id) => API_URL + `api/species/${id}/observations/`

const SPECIES_TYPE_TO_COLOR = {bird: 'red', plant: 'green'}


const formatDate = (datetime) => {
    const dateObj = new Date(datetime);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    const nthNumber = (number) => {
        if (number > 3 && number < 21) return "th";
        switch (number % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };
    return `${day}${nthNumber(day)} of ${month} ${year - 200}.`;
}

export default function MapScreen({ navigation, route }) {
    const [speciesList, setSpeciesList] = useState({});
    const [speciesObservations, setSpeciesObservations] = useState({});

    useEffect(() => {
        const fetchSpeciesListandObservations = async () => {
            const response = await axios.get(SPECIES_LIST_URL);
            const speciesList = {};
            for (const species of response.data) {
                speciesList[species.id] = species;
            }
            setSpeciesList(speciesList);
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

    let allObservations = Object.values(speciesObservations).flatMap(observations => observations);
    allObservations = allObservations.filter(obs => obs.location.latitude !== null);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <MapView
                    style={styles.map}
                    scrollEnabled={true}
                    zoomEnabled={true}
                >
                {allObservations && allObservations.map((obs, index) => 
                    <Marker
                        key={index}
                        coordinate={obs.location}
                        pinColor={SPECIES_TYPE_TO_COLOR[speciesList[obs.species].type]}
                        title={speciesList[obs.species].display_name}
                        description={formatDate(obs.datetime)}/>
                )}
                </MapView>
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
        height: '100%',
    },
});

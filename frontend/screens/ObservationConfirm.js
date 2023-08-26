import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Platform, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants'
import { FlatList } from 'react-native-gesture-handler';

const API_URL = Constants.expoConfig.extra.API_URL;
const OBSERVATION_URL = (id) => API_URL + `api/species/observation/${id}/`
const NUM_CANDIDATES = 3; // Number of candidates to display
const PROBABILITY_THRESHOLD = 0.25; // Minimum probability to display a candidate


const SpeciesCandidate = (props) => {
    return (
        <View style={styles.candidateContainer}>
            <Image style={styles.candidateImage}
                resizeMode='contain'
                source={{ uri: props.item.images[0].url.s }}
            />
            <View style={styles.textContainer}>
                <Text style={styles.speciesName}>{props.item.species.commonNames[0]}</Text>
                <Text style={styles.speciesScientificName}>{props.item.species.scientificNameWithoutAuthor}</Text>
            </View>
            <TouchableOpacity
                style={styles.validateButton}
                activeOpacity={0.5}
                onPress={props.onPress}>
                <Text style={styles.categoryLabel}>Validate</Text>
            </TouchableOpacity>
        </View>
    );
}

const confirmSpeciesAsync = async (observation_id, species_index, navigation) => {
    let formData = new FormData();
    formData.append('species', species_index);
    axios.patch(OBSERVATION_URL(observation_id), formData)
        .then(response => {
            console.log(response);
            navigation.navigate('SpeciesDetail', { id: response.data.species })
        })
        .catch(error => console.log(error));
};


export default function ObservationConfirmScreen({ navigation, route }) {

    const [observation, setObservation] = useState(null);
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
        const fetchObservation = async () => {
            const response = await axios.get(OBSERVATION_URL(route.params.id));
            console.log(response.data);
            console.log(response.data.image);
            setObservation(response.data);
            setImageURL(response.data.image);
        };

        fetchObservation();
    }, []);

    let has_results = observation && observation.identification_response && observation.identification_response.results;
    let topNResults = has_results 
    ? observation.identification_response.results
        .filter(candidate => candidate.score >= PROBABILITY_THRESHOLD)
        .slice(0, NUM_CANDIDATES) 
    : [];
    console.log(topNResults);
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                {imageURL && (
                    <Image
                        style={styles.coverImage}
                        source={{ uri: imageURL }}
                    />
                )}
                {has_results ? <FlatList
                    style={{ marginTop: 60 }}
                    vertical
                    numColumns={1}
                    showsVerticalScrollIndicator={Platform.OS === 'web'}
                    data={topNResults}
                    contentContainerStyle={{}}
                    renderItem={({ item, index }) => {
                        return (
                            <SpeciesCandidate
                                key={index} item={item} onPress={() => confirmSpeciesAsync(observation.id, index, navigation)}
                            />
                        );
                    }}
                />: null}
            </ImageBackground>
        </View>
    )
};


const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column' },
    containerImage: { flex: 1, resizeMode: 'cover' },
    coverImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover'
    },
    candidateContainer: { 
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginVertical: 10, 
        marginHorizontal: 10 
    },
    textContainer: {
        flex: 1,
        marginLeft: 8,
        justifyContent: 'space-between' // Added this to distribute vertical space
    },
    candidateImage: { 
        width: 100, 
        height: 100, 
        borderRadius: 50 
    },
    speciesName: {
        fontFamily: 'SpecialElite_400Regular',
        fontWeight: 400,
        fontSize: 20,
        color: '#331100',
        opacity: 0.9,
        marginBottom: 10,
    },
    speciesScientificName: { 
        fontFamily: 'Tinos_400Regular_Italic', 
        fontSize: 14, 
        color: '#332200',
        marginTop: 10
    },
    validateButton: { 
        width: 80, 
        paddingVertical: 5, 
        paddingHorizontal: 10, 
        borderRadius: 10, 
        backgroundColor: '#4CAF50', 
        alignItems: 'center' 
    },
    categoryLabel: { color: 'white' }
});

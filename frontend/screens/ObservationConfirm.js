import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Platform, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants'
import { FlatList } from 'react-native-gesture-handler';

const API_URL = Constants.expoConfig.extra.API_URL;
const OBSERVATION_URL = (id) => API_URL + `api/species/observation/${id}/`



const SpeciesCandidate = (props) => {
    return (
        <View style={styles.candidateContainer}>
            <Image style={styles.candidateImage}
                resizeMode='contain'
                source={{ uri: props.item.images[0].url.s }}
            />
            <Text style={styles.speciesScientificName}>{props.item.species.scientificName}</Text>
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

    useEffect(() => {
        const fetchObservation = async () => {
            const response = await axios.get(OBSERVATION_URL(route.params.id));
            console.log(response.data);
            setObservation(response.data);
        };

        fetchObservation();
    }, []);

    let has_results = observation && observation.identification_response && observation.identification_response.results;
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                {has_results ? <FlatList
                    style={{ marginTop: 60 }}
                    vertical
                    numColumns={1}
                    showsVerticalScrollIndicator={Platform.OS === 'web'}
                    data={observation.identification_response.results}
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
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    candidateContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    candidateImage: {
        width: 64,
        height: 64
    },
    speciesName: {
        fontFamily: 'SpecialElite_400Regular',
        fontWeight: 400,
        fontSize: 20,
        color: '#331100',
        opacity: 0.9
    },
    speciesScientificName: {
        fontFamily: 'Tinos_400Regular_Italic',
        fontSize: 12,
        color: '#332200',
        opacity: 0.7
    },
    validateButton: {
        marginLeft: 10,
        borderWidth: 1,
        borderColor: "#ababab",
        borderRadius: 18,
    },
});

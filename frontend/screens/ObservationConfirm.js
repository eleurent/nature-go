import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Platform, TouchableOpacity , ActivityIndicator} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants'
import { FlatList } from 'react-native-gesture-handler';
import XPModal from '../components/XPModal';
import { CommonActions } from '@react-navigation/native';

const API_URL = Constants.expoConfig.extra.API_URL;
const URL_CREATE_OBSERVATION = API_URL + 'api/species/observation/'
const OBSERVATION_URL = (id) => API_URL + `api/species/observation/${id}/`
const NUM_CANDIDATES = 3; // Number of candidates to display
const PROBABILITY_THRESHOLD = 0.10; // Minimum probability to display a candidate


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

const postObservationImageAsync = async (imageBase64, gpsLocation, datetime, observation, setObservation, setIsLoading) => {
    if (imageBase64 && !observation) {
        let formData = new FormData();
        console.log(gpsLocation);
        console.log(datetime);
        formData.append('image', imageBase64);
        formData.append('location', JSON.stringify(gpsLocation));
        formData.append('datetime', datetime);
        axios.post(URL_CREATE_OBSERVATION, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            setObservation(response.data);
            setIsLoading(false);
        }).catch(error => {
            console.log(error.message);
            setIsLoading(false);
        })
    }
};

const confirmSpeciesAsync = async (observation_id, species_index, onConfirmResponse) => {
    let formData = new FormData();
    formData.append('species', species_index);
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 10000 // 10 seconds
    };
    axios.patch(OBSERVATION_URL(observation_id), formData, config)
        .then(response => {
            onConfirmResponse(response);
        })
        .catch(error => console.log(error));
};


const goToSpeciesDetails = (navigation, observation) => {
    navigation.dispatch((state) => {
        //update navigation state as you want.
        const routes = [
            { name: 'Home' },
            { name: 'SpeciesList' },
            { name: 'SpeciesDetail', params: { id: observation.species } }, //you can also add params 
        ];

        return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
        });
    });
}

export default function ObservationConfirmScreen({ navigation, route }) {

    const [observation, setObservation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [xpModalVisible, setXPModalVisible] = useState(false);
    const imageBase64 = route.params.imageBase64;
    const gpsLocation = route.params.gpsLocation;
    const datetime = route.params.datetime;

    useEffect(() => {
        postObservationImageAsync(imageBase64, gpsLocation, datetime, observation, setObservation, setIsLoading);
    }, []);

    let has_results = observation && observation.identification_response && observation.identification_response.results;
    let topNResults = has_results ? observation.identification_response.results.filter(candidate => candidate.score >= PROBABILITY_THRESHOLD).slice(0, NUM_CANDIDATES) : [];
    const onConfirmResponse = (response) => { setObservation(response.data); setXPModalVisible(true); };

    const onXPModalClose = () => {
        setXPModalVisible(false);

        // Timeout needed to prevent iOS crash, presumably from chaining modal and navigation transitions?
        // see https://github.com/react-navigation/react-navigation/issues/11259
        setTimeout(() => { goToSpeciesDetails(navigation, observation); }, 100);

    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                {imageBase64 ? (
                    <Image
                        style={styles.coverImage}
                        source={{ uri: `data:image/png;base64,${imageBase64}` }}
                    />
                ) : null}
                { isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={80} color="#00ff00" />
                        <Text>Identifying the plant...</Text>
                    </View>
                ) :
                (has_results ? 
                    <FlatList
                        style={{ marginTop: 60 }}
                        vertical
                        numColumns={1}
                        showsVerticalScrollIndicator={Platform.OS === 'web'}
                        data={topNResults}
                        contentContainerStyle={{}}
                        renderItem={({ item, index }) => {
                            return (
                                <SpeciesCandidate
                                    key={index}
                                    item={item}
                                    onPress={() => confirmSpeciesAsync(observation.id, index, onConfirmResponse)}
                                />
                            );
                        }}
                    />
                : null)}
                <XPModal isVisible={xpModalVisible} xpData={observation?.xp} onClose={onXPModalClose}/>
            </ImageBackground>
        </View>
    );
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
        justifyContent: 'space-between'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'SpecialElite_400Regular'
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

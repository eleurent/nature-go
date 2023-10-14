import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Platform, TouchableOpacity , ActivityIndicator} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants'
import { FlatList } from 'react-native-gesture-handler';
import XPModal from '../components/XPModal';
import { CommonActions } from '@react-navigation/native';
import { ObservationContext } from '../contexts/ObservationContext';

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
                <Text style={styles.speciesName}>{props.item.species.commonNames.size ? props.item.species.commonNames[0] : props.item.species.scientificNameWithoutAuthor}</Text>
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

const maybeSendObservationImageAsync = async (observationState, observationMethods, setIsLoading) => {
    if (observationState.image && !observationState.data) {
        let formData = new FormData();
        console.log('posting observation with location ' + JSON.stringify(observationState.location));
        console.log('posting observation with datetime ' + JSON.stringify(observationState.datetime));
        formData.append('image', observationState.image);
        formData.append('location', JSON.stringify(observationState.location));
        formData.append('datetime', observationState.datetime);
        axios.post(URL_CREATE_OBSERVATION, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            observationMethods.setObservationData(response.data);
            setIsLoading(false);
        }).catch(error => {
            console.log(error.message); // TODO(eleurent): handle identification error?
            setIsLoading(false);
        })
    } else {
        setIsLoading(false);
    }
};

const confirmSpeciesAsync = async (observation_id, species_index, onConfirmResponse) => {
    let formData = new FormData();
    formData.append('species', species_index);
    axios.patch(OBSERVATION_URL(observation_id), formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    }).then(response => {
        onConfirmResponse(response);
    }).catch(error => console.log(error));
};


const goToSpeciesDetails = (navigation, observationData) => {
    navigation.dispatch((state) => {
        //update navigation state as you want.
        const routes = [
            { name: 'Home' },
            { name: 'SpeciesList' },
            { name: 'SpeciesDetail', params: { id: observationData.species } }, //you can also add params 
        ];

        return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
        });
    });
}

export default function ObservationSelectScreen({ navigation, route }) {

    const { observationState, observationMethods } = useContext(ObservationContext);
    const [isLoading, setIsLoading] = useState(true);
    const [xpModalVisible, setXPModalVisible] = useState(false);

    useEffect(() => {
        maybeSendObservationImageAsync(observationState, observationMethods, setIsLoading);
    }, []);

    let has_results = observationState.data && observationState.data.identification_response && observationState.data.identification_response.results;
    let topNResults = has_results ? observationState.data.identification_response.results.filter(candidate => candidate.score >= PROBABILITY_THRESHOLD).slice(0, NUM_CANDIDATES) : [];
    let emptyResults = has_results && topNResults.length === 0;

    const onConfirmResponse = (response) => { observationMethods.setObservationData(response.data); setXPModalVisible(true); };

    const onXPModalClose = () => {
        setXPModalVisible(false);

        // Timeout needed to prevent iOS crash, presumably from chaining modal and navigation transitions?
        // see https://github.com/react-navigation/react-navigation/issues/11259
        setTimeout(() => { goToSpeciesDetails(navigation, observationState.data); }, 100);
        setTimeout(() => { observationMethods.clearObservation(); }, 200);

    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                {observationState.image ? (
                    <Image
                        style={styles.coverImage}
                        source={{ uri: `data:image/png;base64,${observationState.image}` }}
                    />
                ) : null}
                { isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={80} color="#00ff00" />
                        <Text>Identifying the plant...</Text>
                    </View>
                ) :
                (has_results ?
                    (!emptyResults ?  
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
                                    onPress={() => confirmSpeciesAsync(observationState.data.id, index, onConfirmResponse)}
                                />
                            );
                        }}
                    />
                    : <Text style={styles.emptyResults}>I don't recognize this specimen. Maybe I should get closer?</Text>)
                : null)}
                <XPModal isVisible={xpModalVisible} xpData={observationState?.data?.xp} onClose={onXPModalClose}/>
            </ImageBackground>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column' },
    containerImage: { flex: 1, resizeMode: 'cover' },
    coverImage: {
        width: '100%',
        height: 250,
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
    categoryLabel: { color: 'white' },
    emptyResults: {
        fontSize: 24,
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 'auto',
        marginBottom: 'auto',
        fontFamily: 'Tinos_400Regular'
    },
});

import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';
import { useFonts, SpecialElite_400Regular } from '@expo-google-fonts/special-elite';
import { Tinos_400Regular_Italic, Tinos_400Regular } from '@expo-google-fonts/tinos';
import axios from 'axios';
import Constants from 'expo-constants'
import Carousel from '../components/Carousel';

const API_URL = Constants.expoConfig.extra.API_URL;
const SPECIES_DETAILS_URL = (id) => API_URL + `api/species/${id}/`
const SPECIES_OBSERVATIONS_URL = (id) => API_URL + `api/species/${id}/observations/`


export default function SpeciesDetailScreen({ navigation, route }) {

    const [speciesDetails, setSpeciesDetails] = useState({});
    const [speciesObservations, setSpeciesObservations] = useState([]);
    let [fontsLoaded] = useFonts({
        SpecialElite_400Regular,
        Tinos_400Regular_Italic,
        Tinos_400Regular,
    });

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
                <Image style={styles.illustrationImage}
                    resizeMode='contain'
                    source={{uri: illustration_url}}
                />
                <View style={styles.textContainer}>
                    <Text style={[styles.speciesName, styles.nameContainer]}>{speciesDetails.display_name}</Text>
                    <Text style={[styles.speciesScientificName, styles.nameContainer]}>{speciesDetails.scientificName}</Text>
                    <Text style={styles.descriptionText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse gravida magna non feugiat dapibus. Maecenas luctus lacus et tortor rutrum, in vulputate elit pharetra. Fusce rhoncus ipsum id neque ultrices, eu efficitur nisi luctus. Maecenas tristique justo at interdum pulvinar. Nunc non venenatis ipsum, sit amet venenatis ligula
                    </Text>
                </View>
                <Carousel images={ speciesObservations.map(o => {
                    return o.image.replace('http://localhost/', API_URL);
                }) }/>
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

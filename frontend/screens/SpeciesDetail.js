import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, ImageBackground } from 'react-native';
import { useFonts, SpecialElite_400Regular } from '@expo-google-fonts/special-elite';
import { Tinos_400Regular_Italic } from '@expo-google-fonts/tinos';
import axios from 'axios';
const SPECIES_DETAILS_URL = 'http://localhost:8000/api/species/'


export default function SpeciesDetailScreen({ navigation, route }) {

    const [speciesDetails, setSpeciesDetails] = useState([]);
    let [fontsLoaded] = useFonts({
        SpecialElite_400Regular,
        Tinos_400Regular_Italic,
    });

    useEffect(() => {
        const fetchSpeciesDetails = async () => {
            const response = await axios.get(SPECIES_DETAILS_URL + route.params.id + '/');
            console.log(response.data);
            setSpeciesDetails(response.data);
        };

        fetchSpeciesDetails();
    }, []);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <Image style={styles.illustrationImage}
                    source={speciesDetails.illustration_url}
                />
                <View style={styles.nameContainer}>
                    <Text style={styles.speciesName}>{speciesDetails.name}</Text>
                    <Text style={styles.speciesScientificName}>{speciesDetails.scientificName}</Text>
                </View>
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
    nameContainer: {
        flex: 1,
        flexDirection: 'column',
        textAlign: 'center',
    },
    speciesName: {
        fontFamily: 'SpecialElite_400Regular',
        fontWeight: 400,
        fontSize: 20,
    },
    speciesScientificName: {
        fontFamily: 'Tinos_400Regular_Italic',
        fontSize: 12,
    },
});

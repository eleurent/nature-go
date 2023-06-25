import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';
const SPECIES_DETAILS_URL = 'http://localhost:8000/api/species/'


export default function SpeciesDetailScreen({ navigation, route }) {


    const [speciesDetails, setSpeciesDetails] = useState([]);

    useEffect(() => {
        const fetchSpeciesDetails = async () => {
            const response = await axios.get(SPECIES_DETAILS_URL + route.params.id + '/');
            setSpeciesDetails(response.data);
        };

        fetchSpeciesDetails();
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{speciesDetails.name}</Text>
            <Text>{speciesDetails.scientificName}</Text>
        </View>
    );
};

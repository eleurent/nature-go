import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';

const SPECIES_LIST_URL = 'http://localhost:8000/api/species/'


export default function SpeciesListScreen({ navigation, route }) {

    const [speciesList, setSpeciesList] = useState([]);

    useEffect(() => {
        const fetchSpeciesList = async () => {
            const response = await axios.get(SPECIES_LIST_URL);
            setSpeciesList(response.data);
        };

        fetchSpeciesList();
    }, []);

    return (
        <>{
            speciesList.map((data) => {
                return (
                    <Button key={data.id} title={data.name} onPress={() => navigation.navigate('SpeciesDetail', { id: data.id })} />
                );
            })
        }</>
    );
};
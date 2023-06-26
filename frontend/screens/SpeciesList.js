import React, { useState, useEffect } from 'react';
import { View, Text, Button, ImageBackground, StyleSheet } from 'react-native';
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

    navigation.setOptions({
        headerShown: true,
        headerTransparent: true,
    });


    return (
        <View style={styles.container} >
        <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
        {
            speciesList.map((data) => {
                return (
                    <Button key={data.id} title={data.name} onPress={() => navigation.navigate('SpeciesDetail', { id: data.id })} />
                );
            })
        }
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
        justifyContent: 'center',
    },
});

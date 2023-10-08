import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform, FlatList, Image } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants'
import Animated from 'react-native-reanimated';
import { classifyRarity } from '../utils/rarityComputation';


const API_URL = Constants.expoConfig.extra.API_URL;
const SPECIES_LIST_URL = API_URL + 'api/species/'



const SpeciesButton = (props) => {
    let image_url = props.imageSource;
    image_url = image_url.replace('http://localhost/', API_URL)

    const rarityStyles = {
        'Very Common': { backgroundColor: 'rgba(128, 128, 128, 0.5)' },
        'Common': { backgroundColor: 'rgba(128, 128, 128, 0.5)' },
        'Uncommon': { backgroundColor: 'rgba(0, 128, 0, 0.5)' },
        'Rare': { backgroundColor: 'rgba(0, 0, 255, 0.5)' },
        'Legendary': { backgroundColor: 'rgba(255, 165, 0, 0.5)' },
    };
    

    const buttonStyle = {
        ...styles.categoryContainer,
        ...rarityStyles[props.rarity],
    };

    return (
        <TouchableOpacity
            style={buttonStyle}
            activeOpacity={0.5}
            onPress={props.onPress}>
            <Animated.Image style={styles.categoryImage}
                resizeMode='contain'
                source={{uri: image_url}}
                sharedTransitionTag={"species" + props.index}
            />
            <Text style={styles.categoryLabel}>{props.label}</Text>
        </TouchableOpacity>
    );
}


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
        <View style={styles.container} >
        <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
        <FlatList
            style = {{ marginTop: 60 }}
            vertical
            numColumns = { 2 }
            showsVerticalScrollIndicator={Platform.OS === 'web'}
            data={speciesList}
            contentContainerStyle={{}}
            renderItem={({ item, index }) => {
                return (
                    <SpeciesButton
                        key={item.id} label={item.display_name} 
                        onPress={() => navigation.navigate('SpeciesDetail', { id: item.id })}
                        imageSource={item.illustration_url}
                        index={item.id}
                        rarity={classifyRarity(item)}
                    />
                );
            }}
        />
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
    categoryContainer: {
        width: 120,
        height: 140,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        margin: 5,
    },
    categoryImage: {
        width: 120,
        height: 120,
    },
    categoryLabel: {
        fontFamily: 'SpecialElite_400Regular',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: 18,
        lineHeight: 18,
        display: 'flex',
        textAlign: 'center',
        color: '#000',
    },
});

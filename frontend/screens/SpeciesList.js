import { Image } from 'expo-image';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform, FlatList } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants'


const API_URL = Constants.expoConfig.extra.API_URL;
const SPECIES_LIST_URL = API_URL + 'api/species/'



const SpeciesButton = (props) => {
    let image_url = props.imageSource;
    image_url = image_url.replace('http://localhost/', API_URL)

    const rarityStyles = {
        'Very Common': { color: '#333' },
        'Common': { color: '#333' },
        'Uncommon': { color: '#070' },
        'Rare': { color: '#05f' },
        'Legendary': { color: '#e60' },
    };

    return (
        <TouchableOpacity
            style={styles.categoryContainer}
            activeOpacity={0.5}
            onPress={props.onPress}>
            <Image style={styles.categoryImage}
                contentFit='contain'
                source={{uri: image_url}}
                cachePolicy={'disk'}
                // sharedTransitionTag={"species" + props.index}
            />
            <Text style={[styles.categoryLabel, rarityStyles[props.rarity]]}>{props.label}</Text>
        </TouchableOpacity>
    );
}

const ListHeader = ({ speciesCount }) => (
    <Text style={styles.numSpeciesDiscovered}>{speciesCount} species discovered.</Text>
);


export default function SpeciesListScreen({ navigation, route }) {

    const [speciesList, setSpeciesList] = useState(null);

    useEffect(() => {
        const fetchSpeciesList = async () => {
            if (!route?.params?.type) {
                console.log('Must specify a valid species type.');
                return;
            }
            const response = await axios.get(SPECIES_LIST_URL + route.params.type + '/');
            setSpeciesList(response.data);
        };

        fetchSpeciesList();
    }, []);


    return (
        <View style={styles.container} >
        <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
        {
        (!speciesList) ?
         null : 
        (speciesList.length === 0) ? (
            <Text style={styles.emptyMessage}>{`I haven't found anything yet.\n\n Time to do some fieldwork!`}</Text>
        ) : (
            <FlatList
                style = {styles.speciesList}
                vertical
                numColumns = { 2 }
                showsVerticalScrollIndicator={Platform.OS === 'web'}
                data={speciesList}
                contentContainerStyle={{}}
                ListHeaderComponent={<ListHeader speciesCount={speciesList.length} />}
                renderItem={({ item, index }) => {
                    return (
                        <SpeciesButton
                            key={item.id} label={item.display_name} 
                            onPress={() => navigation.navigate('SpeciesDetail', { id: item.id })}
                            imageSource={item.illustration_url}
                            index={item.id}
                            rarity={item.rarity}
                        />
                    );
                }}
            />
        )}
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
    speciesList: {},
    categoryContainer: {
        width: 120,
        height: 147,
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
        marginTop: 3,
    },
    emptyMessage: {
        fontFamily: 'OldStandardTT_400Regular',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        color: '#222',
    },
    numSpeciesDiscovered: {
        fontFamily: 'OldStandardTT_400Regular',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 55,
        marginBottom: 20,
        color: '#222',
    },
});

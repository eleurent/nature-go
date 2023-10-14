import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Platform, TouchableOpacity , ActivityIndicator, ScrollView} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants'
import { FlatList } from 'react-native-gesture-handler';
import { ObservationContext } from '../contexts/ObservationContext';
import MapView, { Marker } from '../components/CustomMapView';
import { Ionicons } from '@expo/vector-icons';

const API_URL = Constants.expoConfig.extra.API_URL;



const ImageType = ({ selected, onSelect, name, text }) => {
    const color = selected ? 'green' : 'gray';
    return (
        <TouchableOpacity onPress={onSelect} style={{marginLeft: 20}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                    name={ name }
                    size={32}
                    color={color}
                />
                <Text style={{ fontSize: 24, marginLeft: 5, color: color }}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};



export default function ObservationConfirmScreen({ navigation, route }) {
    const [statusMessage, setStatusMessage] = useState(null);
    const { observationState, observationMethods } = useContext(ObservationContext);
    const [selectedImageType, setSelectedImageType] = useState('leaf');

    useEffect(() => {
    
    }, []);

    let initialRegion = undefined;
    let coordinate = undefined;
    if (observationState?.location?.latitude) {
        initialRegion = {
            latitude: observationState?.location?.latitude,
            longitude: observationState?.location?.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
        coordinate = observationState?.location;
    }
    
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <ScrollView>
                {observationState.image ? (
                    <Image
                        style={styles.coverImage}
                        source={{ uri: `data:image/png;base64,${observationState.image}` }}
                    />
                ) : null}
                {statusMessage ? (
                    <View style={styles.statusMessageContainer}>
                        <ActivityIndicator size={80} color="#fff" />
                        <Text style={styles.statusMessage}>{statusMessage}</Text>
                    </View>
                ) : null}
                <View style={{flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', marginTop: 20}}>
                    <ImageType
                        name="leaf"
                        text="leaf"
                        selected={selectedImageType === 'leaf'}
                        onSelect={() => setSelectedImageType('leaf')}
                    />
                    <ImageType
                        name="flower-outline"
                        text="flower"
                        selected={selectedImageType === 'flower'}
                        onSelect={() => setSelectedImageType('flower')}
                    />
                </View>
                <MapView
                    style={styles.map}
                    initialRegion={initialRegion}
                    scrollEnabled={false}
                    zoomEnabled={false}
                >
                    {coordinate ? <Marker coordinate={coordinate} /> : null}
                </MapView>
                <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('ObservationSelect', {})}}>
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column' },
    containerImage: { flex: 1, resizeMode: 'cover' },
    coverImage: {
        width: '100%',
        height: 450,
        resizeMode: 'cover'
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
    statusMessageContainer: {
        position: "absolute",
        top: '40%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    statusMessage: {
        fontSize: 24,
        fontFamily: 'Tinos_400Regular',
        color: 'white',
    },
    map: {
        marginTop: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 256,
        height: 200,
    },
    button: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    buttonText: {
        fontSize: 24,
        fontFamily: 'Tinos_400Regular',
    }
});

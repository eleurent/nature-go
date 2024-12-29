import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Pressable, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Constants from 'expo-constants'
import axios from 'axios';
import MapView, { Marker } from '../components/CustomMapView';

const API_URL = Constants.expoConfig.extra.API_URL;
const SPECIES_OBSERVATIONS_URL = API_URL + `api/species/observation/`

const SPECIES_TYPE_TO_COLOR = {bird: 'red', plant: 'green'}

const formatDate = (datetime) => {
    const dateObj = new Date(datetime);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    const nthNumber = (number) => {
        if (number > 3 && number < 21) return "th";
        switch (number % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };
    return `${day}${nthNumber(day)} of ${month} ${year - 200}.`;
}

export default function MapScreen({ navigation, route }) {
    const [observations, setObservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchObservations = async () => {
            const response = await axios.get(SPECIES_OBSERVATIONS_URL);
            setObservations(response.data);
            setIsLoading(false);
          };

        fetchObservations();
        
    }, []);

    let validObservations = observations.filter(obs => 
        (obs.location != null) &&
        (obs.location.latitude != null) &&
        (obs.location.longitude != null)
    );
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                
                <MapView
                    style={styles.map}
                    scrollEnabled={true}
                    zoomEnabled={true}
                >
                {validObservations && validObservations.map((obs, index) => 
                    <Marker
                        key={index}
                        coordinate={obs.location}
                        pinColor={SPECIES_TYPE_TO_COLOR[obs.type]}
                        title={obs.species_display_name}
                        description={formatDate(obs.datetime)}
                        pointerEvents="auto" //See https://github.com/react-native-maps/react-native-maps/issues/2410, does not seem to work though... 
                    />
                )}
                </MapView>
                { isLoading ? (
                    <View style={styles.loadingContainer} pointerEvents="none">
                        <ActivityIndicator size={"large"} color="#660000"/>
                    </View>
                ) : null}
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
    containerInsideImage: {
        flex: 1,
        marginTop: 60,
        flexDirection: 'column'
    },
    map: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'SpecialElite_400Regular'
    },
});

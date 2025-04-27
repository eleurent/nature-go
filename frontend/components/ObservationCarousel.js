import React from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import MapView, { Marker } from './CustomMapView';

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

const CarouselCell = ({ obs, onImagePress, onMapPress, onLongPressObservation }) => {
    let initialRegion = undefined;
    let coordinate = undefined;
    if (obs.location?.latitude) {
        initialRegion = {
            latitude: obs.location?.latitude,
            longitude: obs.location?.longitude,
            latitudeDelta: 0.0922*32,
            longitudeDelta: 0.0421*32,
        };
        coordinate = obs.location;
    }

    const handleLongPress = () => {
        // Call the passed handler with the observation ID
        if (onLongPressObservation) {
            onLongPressObservation(obs.id);
        }
    };

    return (
        // Wrap the content in TouchableOpacity or Pressable to detect long press
        <TouchableOpacity
            style={styles.carouselCell}
            onLongPress={handleLongPress} // Add the long press handler
            activeOpacity={0.8} // Optional: visual feedback on press
        >
            <View style={styles.imageContainer}>
                {/* Use Pressable for the image itself if you need separate onPress */}
                <Pressable style={styles.image} onPress={() => onImagePress(obs.image)}>
                    <Image style={styles.image} source={{ uri: obs.image }} cachePolicy='memory' />
                </Pressable>
                <Pressable onPress={() => onMapPress(initialRegion, coordinate)}>
                    <MapView
                        style={styles.map}
                        initialRegion={initialRegion}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        // Make map non-interactive for long press on cell
                        pointerEvents="none"
                    >
                        {coordinate ? <Marker coordinate={coordinate}/> : null}
                    </MapView>
                </Pressable>
            </View>
            <Text style={styles.dateText}>{formatDate(obs.datetime)}</Text>
        </TouchableOpacity>
    )
}


export default function ObservationCarousel( {observations, onImagePress, onMapPress, onLongPressObservation} ) {
    if (!observations)
        return null;

    return (
        <View
            style={styles.scrollContainer}
        >
            <ScrollView
                horizontal
                // pagingEnabled
                showsHorizontalScrollIndicator={true}
            >
                {observations.map((obs) => (
                    <CarouselCell obs={obs} key={obs.id} onImagePress={onImagePress} onMapPress={onMapPress} onLongPressObservation={onLongPressObservation}/>
                ))}
            </ScrollView>
        </View>
    );

}

const styles = StyleSheet.create({
    scrollContainer: {
        height: 180,
    },
    carouselCell: {
        flexDirection: 'column',
        alignItems: 'center',
        height: 160,
        width: 312,
        marginLeft: 30,
        padding: 10,
        borderRadius: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    imageContainer: {
        height: 128,
        width: 266,
        flexDirection: 'row',
    },
    image: {
        width: 128,
        height: 128,
        marginRight: 10,
    },
    map: {
        width: 128,
        height: 128,
    },
    dateText: {
        marginTop: 5,
        fontFamily: 'SpecialElite_400Regular',
        fontSize: 14,
    }
});

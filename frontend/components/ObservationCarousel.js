import React from 'react';
import { View, ScrollView, Image, StyleSheet, Text } from 'react-native';
import MapView from 'react-native-maps';

export default function ObservationCarousel( {observations} ) {
    if (observations) {
        return (
            <View
                style={styles.scrollContainer}
            >
                <ScrollView
                    horizontal
                    // pagingEnabled
                    showsHorizontalScrollIndicator={true}
                >
                    {observations.map((obs, i) => (
                    <View style={styles.carouselCell} key={i}>
                        <View style = {styles.imageContainer}>
                            <Image style={styles.image} source={{uri: obs.image}}/>
                            <MapView style={styles.map} />
                        </View>
                        <Text style={styles.dateText}>18th of June 1823.</Text>
                    </View>
                    ))}
                </ScrollView>
            </View>
        );
    }
    return null;
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
        marginLeft: 10,
        padding: 10,
        borderRadius: '15px',
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

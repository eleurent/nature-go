import React from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';

export default function Carousel( {images} ) {
    if (images) {
        return (
            <View
                style={styles.scrollContainer}
            >
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={true}
                >
                    {images.map((image, i) => (
                        <Image style={styles.image} source={image} key={i}/>
                    ))}
                </ScrollView>
            </View>
        );
    }
    return null;
}

const styles = StyleSheet.create({
    scrollContainer: {
        height: 64,
    },
    image: {
        width: 64,
        height: 64,
    },
});

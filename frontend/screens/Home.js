import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProfileContext } from '../contexts/UserProfileContext';

const CategoryButton = (props) => {
    const opacity = props.disabled ? 0.3 : 1;
    return (
        <TouchableOpacity
            style={[styles.categoryContainer, { 'opacity': opacity }]}
            activeOpacity={0.5}
            onPress={props.onPress}>
            <Image style={styles.categoryImage}
                source={props.imageSource}
            />
            <Text style={styles.categoryLabel}>{props.label}</Text>
        </TouchableOpacity>
    );
}

export default function HomeScreen({ navigation }) {
    const { profileState, profileMethods } = useContext(UserProfileContext);
    useEffect(() => {   
        profileMethods.maybeSelectCharacter(profileState, navigation);
    }, [profileState]);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <SafeAreaView style={{flex: 1}}>
                <View style={styles.containerInsideImage}>
                    <Text style={styles.title}>CONTENTS.</Text>
                    <Image source={require('../assets/images/separator.png')} style={styles.separator} />
                    <View style={styles.categoryRowContainer}>
                        <View style={{ flex: 1 }}></View>
                        <CategoryButton 
                            onPress={() => navigation.navigate('SpeciesList', {type: 'plant'})}
                            imageSource={require('../assets/images/botany.png')}
                            label={'BOTANY'}
                        />
                        <View style={{ flex: 1 }}></View>
                    </View>
                    <View style={styles.categoryRowContainer}>
                        <CategoryButton
                            disabled
                            imageSource={require('../assets/images/entomology.png')}
                            label={'ENTOMOLOGY'}
                        />
                        <View style={{ flex: 1 }}></View>
                        <CategoryButton
                            onPress={() => navigation.navigate('SpeciesList', {type: 'bird'})}
                            imageSource={require('../assets/images/ornithology.png')}
                            label={'ORNITHOLOGY'}
                        />
                    </View>
                    <View style={styles.categoryRowContainer}>
                        <View style={{ flex: 1 }}></View>
                        <CategoryButton
                            onPress={() => navigation.navigate('QuizDetail')}
                            imageSource={require('../assets/images/university.png')}
                            label={'UNIVERSITY'}
                        />
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity
                        style={styles.categoryContainer}
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('Profile')}>
                        <Image style={styles.avatarImage}
                                source={profileState.avatar.bubble}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: 'auto'}}>
                    <View style={styles.categoryRowContainer}>
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity
                            style={styles.avatarTouchable}
                            activeOpacity={0.5}
                                onPress={() => navigation.navigate('Camera')}>
                            <Image style={[styles.categoryImage, styles.cameraImage]}
                                source={require('../assets/images/binoculars.png')}
                            />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    containerInsideImage: {
        flex: 1, 
        flexDirection: 'column'
    },
    title: {
        fontSize: 30,
        marginTop: 5,
        marginBottom: -5,
        letterSpacing: 5.0,
        textAlign: 'center',
        fontFamily: 'OldStandardTT_400Regular',
        paddingVertical: 20,
    },
    separator: {
        width: 200,
        height: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20,
    },
    categoryRowContainer: {
        height: 120,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    categoryContainer: {
        width: 110,
        height: 120,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
    },
    categoryImage: {
        width: 100,
        height: 100,
    },
    cameraImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderColor: 'black',
        borderWidth: 2,
    },
    categoryLabel: {
        fontFamily: 'OldStandardTT_400Regular',
        fontStyle: 'normal',
        fontSize: 14.3846,
        lineHeight: 18,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        color: '#000',
    },
    avatarContainer: {
        position: 'absolute',
        bottom: 5,
        left: -10,
        zIndex: 1
    },
    avatarTouchable: {
    },
    avatarImage: {
        width: 85,
        height: 85,
        resizeMode: "contain",
    }
});

import React, { useContext } from 'react';
import { AuthContext } from '../authContext';
import { View, Text, TouchableOpacity, Image, Button, ImageBackground, StyleSheet } from 'react-native';


export default function HomeScreen({ navigation }) {
    const { authMethods } = useContext(AuthContext);
    navigation.setOptions({
        headerShown: true,
        headerTransparent: true,
    });

    return (
        <View style={styles.container} >
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <View>
                    <View style={styles.categoryRowContainer}>
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity
                            style = {styles.categoryContainer}
                            activeOpacity={0.5}
                            onPress={() =>
                                navigation.navigate('SpeciesList')
                            }>
                            <Image style={styles.categoryImage}
                                source={require('../assets/images/botany.png')}
                            />
                            <Text style = {styles.categoryLabel}>BOTANY</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}></View>
                    </View>
                    <View style={styles.categoryRowContainer}>
                        <TouchableOpacity
                            style={[styles.categoryContainer, { 'opacity': 0.3 }]}
                            activeOpacity={0.3}>
                            <Image style={styles.categoryImage}
                                source={require('../assets/images/entomology.png')}
                            />
                            <Text style={styles.categoryLabel}>ENTOMOLOGY</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity
                            style={[styles.categoryContainer, {'opacity': 0.3}]}
                            activeOpacity={0.3}>
                            <Image style={styles.categoryImage}
                                source={require('../assets/images/ornithology.png')}
                            />
                            <Text style={styles.categoryLabel}>ORNITHOLOGY</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.categoryRowContainer}>
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity
                            style={styles.categoryContainer}
                            activeOpacity={0.5}
                            onPress={() =>
                                navigation.navigate('SpeciesList')
                            }>
                            <Image style={styles.categoryImage}
                                source={require('../assets/images/university.png')}
                            />
                            <Text style={styles.categoryLabel}>UNIVERSITY</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>
                {/* <Button title="Sign out" onPress={authMethods.signOut} /> */}
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
    categoryRowContainer: {
        height: 120,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
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
    categoryLabel: {
        fontFamily: 'Old Standard TT',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: 14.3846,
        lineHeight: 18,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        color: '000000',
    },
});

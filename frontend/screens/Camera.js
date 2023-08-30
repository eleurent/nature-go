import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import IconButton from '../components/IconButton'



const pickImageAsync = async (navigation) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        allowsEditing: true,
        quality: 1,
    });

    if (!result.canceled) {
        navigation.navigate('ObservationConfirm', { imageBase64: result.assets[0].base64, isLoading: true });
    } else {
        console.log('You did not select any image.');
    }
};

const takePictureAsync = async (camera, navigation) => {
    if (camera) {
        const data = await camera.takePictureAsync({ base64: true, exif: true, quality: 0. });
        navigation.navigate('ObservationConfirm', { imageBase64: data.base64, isLoading: true });
    }
};

export default function CameraScreen({ navigation }) {
    const [cameraPermission, setCameraPermission] = useState(null);
    const [galleryPermission, setGalleryPermission] = useState(null);

    const [camera, setCamera] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    const permissionFunction = async () => {
        const cameraPerm = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(cameraPerm.status === 'granted');
        if (cameraPermission === false)
            alert('Permission for camera access needed.');

        const galleryPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
        setGalleryPermission(galleryPerm.status === 'granted');
        if (galleryPermission === false)
            alert('Permission for galley access needed.');
    };

    useEffect(() => {
        permissionFunction();
    }, []);

        return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <Camera
                    ref={(ref) => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={'1:1'}
                />
                    <View style={styles.pictureButton}><IconButton icon="camera" size={64} color="#fff" onPress={() => takePictureAsync(camera, navigation)}/></View>
                    <View style={styles.galleryButton}><IconButton icon="image" size={32} color="#fff" onPress={() => pickImageAsync(navigation)}/></View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    fixedRatio: {
        flex: 1,
        // aspectRatio: 1,
    },
    pictureButton: {
        position: 'absolute',
        alignContent: 'center',
        bottom: 40,
        left: 0,
        right: 0,
        height: 50,
    },
    galleryButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
});
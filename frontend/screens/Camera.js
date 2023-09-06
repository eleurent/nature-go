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
            alert('Permission for camera access needed. Status: ' + cameraPerm.status);

        const galleryPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
        setGalleryPermission(galleryPerm.status === 'granted');
        if (galleryPermission === false)
            alert('Permission for galley access needed. Status: ' + galleryPerm.status);
    };

    useEffect(() => {
        permissionFunction();
    }, []);

    galleryColor = galleryPermission ? "#fff" : "#f00";
    cameraColor = cameraPermission ? "#fff" : "#f00";

    return (
        <View style={styles.container}>
            <Camera
                ref={(ref) => setCamera(ref)}
                style={styles.cameraContainer}
                type={type}
                ratio={'16:9'}
            >
                <View style={styles.cameraView}>
                    <IconButton icon="image" size={32} color={galleryColor} onPress={() => pickImageAsync(navigation)} extra_style={styles.galleryButtonContainer} />
                    <IconButton icon="camera" size={70} color={cameraColor} onPress={() => takePictureAsync(camera, navigation)} extra_style={styles.captureButton}/>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
    },
    cameraView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        backgroundColor: "transparent",
    },
    captureButton: {
        width: 70,
        height: 70,
        marginBottom: 50,
    },
    galleryButtonContainer: {
        position: "absolute",
        left: 20,
        bottom: 30,
    },
});
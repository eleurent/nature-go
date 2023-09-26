import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import IconButton from '../components/IconButton'


const pickImageAsync = async (navigation) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        allowsEditing: false,  // See https://docs.expo.dev/versions/latest/sdk/imagepicker/#known-issues
        exif: true,
        quality: 1,
    });

    if (!result.canceled) {
        // Get location
        // Getting location from exif data works on iOS (when the image has location), but not on Android
        // See https://github.com/expo/expo/issues/17399
        console.log('Image exif: ' + JSON.stringify(result.assets[0].exif))
        const datetime = result.assets[0].exif.DateTimeDigitized;
        let gpsLocation = {
            latitude: result.assets[0].exif.GPSLatitude,
            longitude: result.assets[0].exif.GPSLongitude,
        }
        if (!(gpsLocation.latitude && gpsLocation.longitude)) {
            // This additional step should make it work on Android, but it fails because of a new issue
            // See https://github.com/expo/expo/issues/24172
            console.log(result.assets[0].assetId)
            // let info = await MediaLibrary.getAssetInfoAsync(result.assets[0].assetId)
            // console.log(info.location)
        }
        
        navigation.navigate('ObservationConfirm', { imageBase64: result.assets[0].base64, isLoading: true, gpsLocation, datetime });
    } else {
        console.log('You did not select any image.');
    }
};

const takePictureAsync = async (camera, navigation) => {
    if (camera) {
        const data = await camera.takePictureAsync({ base64: true, exif: true, quality: 0. });
        gpsLocation = {
            "latitude": 0,
            "longitude": 0,
        } // TODO: use expo-location
        datetime = null; // Auto-now in backend
        navigation.navigate('ObservationConfirm', { imageBase64: data.base64, isLoading: true, gpsLocation, datetime });
    }
};

export default function CameraScreen({ navigation }) {
    const [cameraPermission, setCameraPermission] = useState(null);
    const [galleryPermission, setGalleryPermission] = useState(null);

    const [camera, setCamera] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    const permissionFunction = async () => {
        let cameraPerm = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(cameraPerm.status === 'granted');
        if (cameraPerm.status !== 'granted') {
            console.log('Permission for camera access needed. Status: ' + cameraPerm.status);
            await ImagePicker.requestCameraPermissionsAsync();
            cameraPerm = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(cameraPerm.status === 'granted');
        }

        let galleryPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
        setGalleryPermission(galleryPerm.status === 'granted');
        if (galleryPerm.status !== 'granted') {
            console.log('Permission for galley access needed. Status: ' + galleryPerm);
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            galleryPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
            setGalleryPermission(galleryPerm.status === 'granted');
        }
    };

    useEffect(() => {
        permissionFunction();
    }, []);

    let galleryColor = galleryPermission ? "#fff" : "#f00";
    let cameraColor = cameraPermission ? "#fff" : "#f00";

    return (Platform.OS !== 'web') ? (
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
    ) : (
        <View style={styles.container}>
            {/* TODO Camera is not working on web, getting Uncaught Error: Invalid hook call. */}
            <View style={styles.cameraView}>
                <IconButton icon="image" size={32} color={galleryColor} onPress={() => pickImageAsync(navigation)} extra_style={styles.galleryButtonContainer} />
                <IconButton icon="camera" size={70} color={cameraColor} onPress={() => takePictureAsync(camera, navigation)} extra_style={styles.captureButton} />
            </View>
            <Text>Web</Text>
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
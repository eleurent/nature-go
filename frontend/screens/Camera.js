import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, View, Platform, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import IconButton from '../components/IconButton'
import { ObservationContext } from '../contexts/ObservationContext';
import { useIsFocused } from '@react-navigation/native';

function parseDate(dateString) {
    // The date format is YYYY:MM:DD HH:MM:SS
    let datePattern = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

    if (datePattern.test(dateString)) {
        let parts = dateString.split(' ');
        let dateParts = parts[0].split(':');
        let timeParts = parts[1].split(':');
        let year = parseInt(dateParts[0]);
        let month = parseInt(dateParts[1]) - 1;
        let day = parseInt(dateParts[2]);
        let hours = parseInt(timeParts[0]);
        let minutes = parseInt(timeParts[1]);
        let seconds = parseInt(timeParts[2]);
        return new Date(year, month, day, hours, minutes, seconds).toISOString();
    } else {
        return new Date().toISOString();
    }
}

const pickImageAsync = async (navigation, observationMethods) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        allowsEditing: false,  // See https://docs.expo.dev/versions/latest/sdk/imagepicker/#known-issues
        exif: true,
        quality: 0,
    });

    if (!result.canceled) {
        navigation.navigate('ObservationConfirm', {});

        observationMethods.setObservationImage(result.assets[0].base64);
        const datetime = parseDate(result.assets[0].exif.DateTimeDigitized);
        observationMethods.setObservationDatetime(datetime);
        // Get location
        // Getting location from exif data works on iOS (when the image has location), but not on Android
        // See https://github.com/expo/expo/issues/17399
        console.log('Image exif: ' + JSON.stringify(result.assets[0].exif))

        function gpsCoordinateWithReference(coordinate, ref) {
            return !ref || ref === "S" || ref === "W" ? -coordinate : coordinate;
        }

        const exifData = result.assets[0].exif;
        let gpsLocation = {
            latitude: gpsCoordinateWithReference(exifData.GPSLatitude, exifData.GPSLatitudeRef),
            longitude: gpsCoordinateWithReference(exifData.GPSLongitude, exifData.GPSLongitudeRef),
        }
        if (!(gpsLocation.latitude && gpsLocation.longitude)) {
            // This additional step should make it work on Android, but it fails because of a new issue
            // See https://github.com/expo/expo/issues/24172
            console.log(result.assets[0].assetId)
            let info = await MediaLibrary.getAssetInfoAsync(result.assets[0].assetId)
            console.log(info)
        }
        observationMethods.setObservationLocation(gpsLocation);
    } else {
        console.log('You did not select any image.');
    }
};

const takePictureAsync = (cameraRef, navigation, observationMethods) => {
    if (cameraRef.current) {
        // setStatusMessage('Taking a closer look...');
        // setStatusMessage('Checking map and compass...');
        navigation.navigate('ObservationConfirm', {});

        /* Set image */
        cameraRef.current.takePictureAsync({ base64: true, exif: true, quality: 0. }).then(data => observationMethods.setObservationImage(data.base64));
        /* Set datetime */
        datetime = new Date().toISOString();
        observationMethods.setObservationDatetime(datetime);
        /* Set location */
        Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Low}).then(location => {
            console.log(location);
            const gpsLocation = {
                "latitude": location.coords.latitude,
                "longitude": location.coords.longitude,
            };
            console.log(gpsLocation);
            observationMethods.setObservationLocation(gpsLocation);
        });
    }
};

export default function CameraScreen({ navigation }) {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [galleryPermission, setGalleryPermission] = useState(null);

    const { observationState, observationMethods } = useContext(ObservationContext);
    const [facing, setFacing] = useState('back');
    const cameraRef = useRef(null);


    const permissionFunction = async () => {
        requestCameraPermission();
        
        let galleryPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
        setGalleryPermission(galleryPerm.status === 'granted');
        if (galleryPerm.status !== 'granted') {
            console.log('Permission for galley access needed. Status: ' + galleryPerm);
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            galleryPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
            setGalleryPermission(galleryPerm.status === 'granted');
        }

        let locationStatus = await Location.requestForegroundPermissionsAsync();
        await Location.enableNetworkProviderAsync();
        if (locationStatus.status !== 'granted') {
            console.log('Permission to access location was denied: ' + JSON.stringify(locationStatus));
            await Location.requestForegroundPermissionsAsync();
            await Location.enableNetworkProviderAsync();
        }
    };


    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused)
            observationMethods.clearObservation();
        permissionFunction();
    }, [isFocused]);

    let galleryColor = galleryPermission ? "#fff" : "#f00";
    let cameraColor = cameraPermission ? "#fff" : "#f00";

    const cameraEnabled = cameraPermission && (Platform.OS !== 'web');
    if (!cameraEnabled)
        return <View style={styles.container}></View>

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.cameraContainer}
                facing={facing}
            >
                <View style={styles.cameraView}>
                    <View style={styles.galleryButtonContainer}>
                        <IconButton icon="image" size={32} color={galleryColor} onPress={() => pickImageAsync(navigation, observationMethods)}/>
                    </View>
                    <IconButton icon="camera" size={70} color={cameraColor} onPress={() => takePictureAsync(cameraRef, navigation, observationMethods)} extra_style={styles.captureButton}/>
                </View>
            </CameraView>
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
        left: 30,
        bottom: 55,
    },
});
import React from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView, { Marker } from './CustomMapView';

export default function ObservationMapModal({ modalVisible, setModalVisible, initialRegion, coordinate, backgroundColor='rgba(0,0,0,0.5)' }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={[styles.modalContainer, {backgroundColor}]} >
                <TouchableOpacity activeOpacity={1} style={styles.untouchableChild}>
                <MapView
                    style={styles.modalMap}
                    initialRegion={initialRegion}
                    scrollEnabled={true}
                    zoomEnabled={true}
                >
                    {coordinate ? <Marker coordinate={coordinate}/> : null}
                </MapView>
                </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    parentWithoutTouchEvents: {
        width: '100%',
        height: '50%',
        resizeMode: 'contain',
    },
    untouchableChild: {
        width: '100%',
        height: '50%',
    },
    modalMap: {
        width: '100%',
        height: '100%',
    },
});

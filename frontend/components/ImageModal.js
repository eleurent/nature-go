import React from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { Image } from 'expo-image';

export default function ObservationImageModal({ modalVisible, setModalVisible, modalImage, backgroundColor='rgba(0,0,0,0.5)' }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={[styles.modalContainer, {backgroundColor}]}>
                    <Image
                        source={(typeof modalImage === 'string') ? { uri: modalImage } : modalImage}
                        style={styles.modalImage}
                        cachePolicy='memory'
                        contentFit='contain'
                    />
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
    modalImage: {
        width: '100%',
        height: '90%',
    }
});



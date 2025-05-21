import React from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNotification } from '../contexts/NotificationContext';

const NotificationModal = () => {
    const { isModalVisible, currentNotification, hideNotificationModal } = useNotification();

    if (!currentNotification) {
        return null; // Don't render anything if there's no current notification
    }

    // Optional: Determine title based on notification type
    let title = "Notification";
    if (currentNotification.type === 'level_up') {
        title = "Level Up!";
    } else if (currentNotification.type === 'badge_unlocked') {
        title = "New Badge Unlocked!";
    }

    return (
        <Modal
            transparent={true}
            animationType="fade" // "slide" or "fade"
            visible={isModalVisible}
            onRequestClose={hideNotificationModal} // For Android back button
        >
            <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1} // Ensure backdrop doesn't change opacity on press
                onPressOut={hideNotificationModal} // onPressOut to allow button press within modal
            >
                <View style={styles.contentContainer} onStartShouldSetResponder={() => true}>
                    {/* This prevents touch events from bubbling up to the backdrop */}
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.messageText}>{currentNotification.message}</Text>
                    <Button title="Dismiss" onPress={hideNotificationModal} />
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '80%', // Adjust width as needed
        maxWidth: 400,
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    messageText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    // If using TouchableOpacity for button:
    // closeButton: {
    //     backgroundColor: '#2196F3',
    //     padding: 10,
    //     borderRadius: 5,
    // },
    // closeButtonText: {
    //     color: 'white',
    //     fontWeight: 'bold',
    // }
});

export default NotificationModal;

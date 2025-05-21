import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Simple API client (replace with your actual API client if available)
const apiClient = {
    get: async (url) => {
        const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }
        const response = await fetch(`/api${url}`, { // Assuming /api prefix for backend
            method: 'GET',
            headers,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    patch: async (url, data) => {
        const token = localStorage.getItem('authToken');
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }
        const response = await fetch(`/api${url}`, { // Assuming /api prefix for backend
            method: 'PATCH',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
};

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentNotification, setCurrentNotification] = useState(null);

    const fetchNotifications = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            // No token, user likely not authenticated, or token is not stored yet.
            // Optionally, set an error or just don't fetch.
            // For now, we'll just return and not attempt to fetch.
            console.log("No auth token found, skipping fetchNotifications.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiClient.get('notifications/');
            setNotifications(data);

            // Automatically show the first unread notification
            if (!isModalVisible) { // Only show if modal isn't already open
                const firstUnread = data.find(n => !n.is_read);
                if (firstUnread) {
                    showNotificationModal(firstUnread);
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const markNotificationAsRead = useCallback(async (notificationId) => {
        setError(null);
        try {
            const updatedNotification = await apiClient.patch(`notifications/${notificationId}/`, { is_read: true });
            setNotifications(prevNotifications =>
                prevNotifications.map(n =>
                    n.id === notificationId ? { ...n, is_read: true } : n
                )
            );
        } catch (err) {
            setError(err.message);
            // Potentially revert optimistic update or re-fetch notifications
        }
    }, []);

    const showNotificationModal = useCallback((notification) => {
        setCurrentNotification(notification);
        setIsModalVisible(true);
    }, []);

    const hideNotificationModal = useCallback(() => {
        if (currentNotification && !currentNotification.is_read) {
            markNotificationAsRead(currentNotification.id);
        }
        setIsModalVisible(false);
        setCurrentNotification(null);
    }, [currentNotification, markNotificationAsRead]);

    useEffect(() => {
        // Initial fetch
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchNotifications();
        }

        // Set up polling if a token is present
        let intervalId = null;
        if (token) {
            intervalId = setInterval(() => {
                fetchNotifications();
            }, 30000); // Poll every 30 seconds
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
        // Adding isModalVisible to dependencies to avoid re-triggering modal if already visible
        // and fetchNotifications in case its definition changes (though it shouldn't with useCallback)
    }, [fetchNotifications, isModalVisible]); // isModalVisible dependency helps manage auto-showing

    const contextValue = {
        notifications,
        isLoading,
        error,
        fetchNotifications,
        markNotificationAsRead,
        isModalVisible,
        currentNotification,
        showNotificationModal,
        hideNotificationModal,
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

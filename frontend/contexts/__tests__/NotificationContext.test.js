import React from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import { Text, Button, View } from 'react-native';
import { NotificationProvider, useNotification } from '../NotificationContext';

// --- Mocks ---
// Mock localStorage
let mockLocalStorageStore = {};
global.localStorage = {
  getItem: jest.fn((key) => mockLocalStorageStore[key] || null),
  setItem: jest.fn((key, value) => {
    mockLocalStorageStore[key] = value.toString();
  }),
  removeItem: jest.fn((key) => {
    delete mockLocalStorageStore[key];
  }),
  clear: jest.fn(() => {
    mockLocalStorageStore = {};
  }),
};

// Mock global.fetch
global.fetch = jest.fn();

// Mock timers for polling
jest.useFakeTimers();

// --- Helper Test Component ---
const TestConsumerComponent = ({ onButtonPress, notificationIdToMarkRead, notificationToShow }) => {
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markNotificationAsRead,
    isModalVisible,
    currentNotification,
    showNotificationModal,
    hideNotificationModal,
  } = useNotification();

  return (
    <View>
      <Text testID="isLoading">{isLoading.toString()}</Text>
      <Text testID="error">{error ? error.toString() : ''}</Text>
      <Text testID="isModalVisible">{isModalVisible.toString()}</Text>
      <Text testID="currentNotificationMessage">
        {currentNotification ? currentNotification.message : ''}
      </Text>
      <Text testID="notificationsCount">{notifications.length}</Text>
      {notifications.map(n => (
        <Text key={n.id} testID={`notification-${n.id}-read`}>{n.is_read.toString()}</Text>
      ))}
      <Button title="Fetch" onPress={fetchNotifications} testID="fetchButton" />
      {notificationIdToMarkRead && (
        <Button
          title="Mark Read"
          onPress={() => markNotificationAsRead(notificationIdToMarkRead)}
          testID="markReadButton"
        />
      )}
      {notificationToShow && (
          <Button title="Show Modal" onPress={() => showNotificationModal(notificationToShow)} testID="showModalButton" />
      )}
      <Button title="Hide Modal" onPress={hideNotificationModal} testID="hideModalButton" />
      {onButtonPress && <Button title="Custom Action" onPress={onButtonPress} />}
    </View>
  );
};

// --- Test Suite ---
describe('NotificationContext', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
    jest.clearAllTimers(); // Clear all timers before each test
    mockLocalStorageStore = {}; // Ensure clean storage
  });

  const mockNotifications = [
    { id: 1, type: 'level_up', message: 'Level Up!', is_read: false, created_at: '2023-01-01T12:00:00Z' },
    { id: 2, type: 'badge', message: 'New Badge!', is_read: true, created_at: '2023-01-01T11:00:00Z' },
    { id: 3, type: 'unread_test', message: 'Unread Test', is_read: false, created_at: '2023-01-01T13:00:00Z' },
  ];

  // Helper to render with provider
  const renderWithProvider = (ui) => {
    return render(<NotificationProvider>{ui}</NotificationProvider>);
  };

  test('initial state is correct', () => {
    const { getByTestId } = renderWithProvider(<TestConsumerComponent />);
    expect(getByTestId('isLoading').props.children).toBe('false');
    expect(getByTestId('error').props.children).toBe('');
    expect(getByTestId('isModalVisible').props.children).toBe('false');
    expect(getByTestId('currentNotificationMessage').props.children).toBe('');
    expect(getByTestId('notificationsCount').props.children).toBe('0');
  });

  describe('fetchNotifications', () => {
    test('fetches and updates notifications on success, and shows modal for unread', async () => {
      localStorage.setItem('authToken', 'test-token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockNotifications,
      });

      const { getByTestId, queryByText } = renderWithProvider(<TestConsumerComponent />);
      
      await act(async () => {
        fireEvent.press(getByTestId('fetchButton'));
      });

      await waitFor(() => {
        expect(getByTestId('notificationsCount').props.children).toBe('3');
        expect(getByTestId('isLoading').props.children).toBe('false');
         // The most recent unread notification (id: 3) should be shown
        expect(getByTestId('isModalVisible').props.children).toBe('true');
        expect(getByTestId('currentNotificationMessage').props.children).toBe('Unread Test');
      });
    });

    test('handles API error during fetchNotifications', async () => {
      localStorage.setItem('authToken', 'test-token');
      fetch.mockRejectedValueOnce(new Error('API Fetch Error'));

      const { getByTestId } = renderWithProvider(<TestConsumerComponent />);
      
      await act(async () => {
        fireEvent.press(getByTestId('fetchButton'));
      });
      
      await waitFor(() => {
        expect(getByTestId('error').props.children).toBe('API Fetch Error');
        expect(getByTestId('isLoading').props.children).toBe('false');
        expect(getByTestId('notificationsCount').props.children).toBe('0');
      });
    });

    test('does not fetch if no authToken is present', async () => {
        const { getByTestId } = renderWithProvider(<TestConsumerComponent />);
        
        await act(async () => {
          fireEvent.press(getByTestId('fetchButton'));
        });
  
        expect(fetch).not.toHaveBeenCalled();
        expect(getByTestId('isLoading').props.children).toBe('false'); // Should not start loading
      });
  });

  describe('markNotificationAsRead', () => {
    test('marks a notification as read successfully', async () => {
      localStorage.setItem('authToken', 'test-token');
      // Initial fetch to populate notifications
      fetch.mockResolvedValueOnce({ 
        ok: true, 
        json: async () => [...mockNotifications] // Use a copy
      });
      const { getByTestId } = renderWithProvider(
        <TestConsumerComponent notificationIdToMarkRead={mockNotifications[0].id} />
      );
      
      await act(async () => {
        fireEvent.press(getByTestId('fetchButton')); // Populate
      });
      
      // Wait for modal to show (for unread id:3) and then hide it to proceed
      await waitFor(() => expect(getByTestId('isModalVisible').props.children).toBe('true'));
      await act(async () => {
        fireEvent.press(getByTestId('hideModalButton'));
      });
      await waitFor(() => expect(getByTestId('isModalVisible').props.children).toBe('false'));


      // Now mark notification 1 (level_up) as read
      fetch.mockResolvedValueOnce({ // For PATCH request
        ok: true,
        json: async () => ({ ...mockNotifications[0], is_read: true }),
      });

      await act(async () => {
        fireEvent.press(getByTestId('markReadButton'));
      });

      await waitFor(() => {
        expect(getByTestId(`notification-${mockNotifications[0].id}-read`).props.children).toBe('true');
      });
    });

    test('handles API error when marking as read', async () => {
        localStorage.setItem('authToken', 'test-token');
        fetch.mockResolvedValueOnce({ ok: true, json: async () => [...mockNotifications] }); // Initial fetch
        const { getByTestId } = renderWithProvider(
            <TestConsumerComponent notificationIdToMarkRead={mockNotifications[0].id} />
        );
        await act(async () => { fireEvent.press(getByTestId('fetchButton')); });
        await waitFor(() => expect(getByTestId('isModalVisible').props.children).toBe('true'));
        await act(async () => { fireEvent.press(getByTestId('hideModalButton')); });
        await waitFor(() => expect(getByTestId('isModalVisible').props.children).toBe('false'));
        
        fetch.mockRejectedValueOnce(new Error('API PATCH Error')); // For PATCH request
  
        await act(async () => {
          fireEvent.press(getByTestId('markReadButton'));
        });
  
        await waitFor(() => {
          expect(getByTestId('error').props.children).toBe('API PATCH Error');
          // Notification should remain unread locally on error
          expect(getByTestId(`notification-${mockNotifications[0].id}-read`).props.children).toBe('false');
        });
      });
  });

  describe('showNotificationModal and hideNotificationModal', () => {
    const singleNotification = { id: 10, message: 'Modal Test', is_read: false };
    test('showNotificationModal updates state correctly', async () => {
      const { getByTestId } = renderWithProvider(<TestConsumerComponent notificationToShow={singleNotification}/>);
      await act(async () => {
          fireEvent.press(getByTestId('showModalButton'));
      });
      expect(getByTestId('isModalVisible').props.children).toBe('true');
      expect(getByTestId('currentNotificationMessage').props.children).toBe('Modal Test');
    });

    test('hideNotificationModal updates state and marks as read', async () => {
        localStorage.setItem('authToken', 'test-token');
        // Mock fetch for markNotificationAsRead
        fetch.mockResolvedValueOnce({ 
          ok: true, 
          json: async () => ({ ...singleNotification, is_read: true }) 
        });
        // Initial notifications for context (so markNotificationAsRead can find and update it)
        // This seems a bit off, hideNotificationModal itself doesn't fetch, it relies on notifications being there
        // Let's adjust. The markNotificationAsRead within hideModal should optimistically update.
        // The initial load of notifications is not strictly required for this specific test of hide.
        // However, markNotificationAsRead *does* update the main `notifications` list.
        // So, to test that interaction, we need some notifications in state.
        // Let's simulate that `singleNotification` was part of a previous fetch.
        
        const { getByTestId } = renderWithProvider(
            <NotificationProvider> 
                <TestConsumerComponent notificationToShow={singleNotification}/>
            </NotificationProvider>
        );

        // Manually set notifications to include the one we're testing
        // This is a bit of a hack for testing context internals.
        // A better way might be to ensure fetchNotifications populates it first.
        // For this test, let's assume `showNotificationModal` was called with a notification
        // that is already in the `notifications` array.
        // The TestConsumerComponent doesn't directly allow setting notifications state from outside.
        // The provider should manage this.
        // Let's simplify: show the modal, then hide it.

        await act(async () => {
            fireEvent.press(getByTestId('showModalButton')); // shows modal
        });
        expect(getByTestId('isModalVisible').props.children).toBe('true'); // verify shown

        // Mock the PATCH call for markAsRead
        fetch.mockResolvedValueOnce({ 
            ok: true, 
            json: async () => ({ ...singleNotification, is_read: true }) 
        });

        await act(async () => {
            fireEvent.press(getByTestId('hideModalButton')); // hides modal
        });
  
        expect(getByTestId('isModalVisible').props.children).toBe('false');
        expect(getByTestId('currentNotificationMessage').props.children).toBe('');
        // Verification that markNotificationAsRead was called (and thus fetch was called)
        // The PATCH URL would be `/api/notifications/10/`
        expect(fetch).toHaveBeenCalledWith('/api/notifications/10/', expect.objectContaining({ method: 'PATCH' }));
    });
  });

  describe('Polling Logic', () => {
    test('fetchNotifications is called periodically if authenticated', async () => {
      localStorage.setItem('authToken', 'test-token');
      fetch.mockResolvedValue({ ok: true, json: async () => [] }); // Mock fetch for polling

      renderWithProvider(<TestConsumerComponent />); // Initial render calls useEffect -> fetchNotifications

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1)); // Initial call

      // Advance timers by 30s
      await act(async () => {
        jest.advanceTimersByTime(30000);
      });
      expect(fetch).toHaveBeenCalledTimes(2); // Called again after 30s

      // Advance timers by another 30s
      await act(async () => {
        jest.advanceTimersByTime(30000);
      });
      expect(fetch).toHaveBeenCalledTimes(3); // Called again
    });

    test('polling stops if authToken is removed', async () => {
        localStorage.setItem('authToken', 'test-token');
        fetch.mockResolvedValue({ ok: true, json: async () => [] });
  
        const { unmount } = renderWithProvider(<TestConsumerComponent />);
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  
        localStorage.removeItem('authToken'); // Simulate logout
  
        // To test if polling stops, we need to re-trigger the useEffect that sets up polling.
        // Unmounting and remounting is one way, or changing a dependency.
        // The current polling useEffect depends on `fetchNotifications` and `isModalVisible`.
        // A more robust way to test "stopping" is to check if `clearInterval` was implicitly handled
        // or if `fetch` is NOT called after token removal + interval.
        
        // Let's advance time and see if fetch is called.
        // The interval is set up within the useEffect. If token is gone, new intervals shouldn't start.
        // The existing interval, however, might complete its current cycle.
        // The logic in fetchNotifications itself checks for token.
        
        // Simulate an update that would cause the useEffect to re-evaluate
        // This is tricky because the polling interval is set up based on the token *at the time of effect run*.
        // The current implementation of polling useEffect will run fetchNotifications if token exists at that time.
        // The fetchNotifications itself checks token.

        // Let's test by advancing time significantly. If the token is checked *inside* fetchNotifications,
        // then fetch should not be made even if the interval fires.
        fetch.mockClear(); // Clear previous calls

        await act(async () => {
            jest.advanceTimersByTime(30000); 
        });
        // fetchNotifications will be called by interval, but it should return early due to no token.
        expect(fetch).not.toHaveBeenCalled(); 
      });

    test('interval is cleared on unmount', async () => {
        localStorage.setItem('authToken', 'test-token');
        fetch.mockResolvedValue({ ok: true, json: async () => [] });
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
  
        const { unmount } = renderWithProvider(<TestConsumerComponent />);
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1)); // Initial fetch
  
        unmount();
        expect(clearIntervalSpy).toHaveBeenCalled();
        clearIntervalSpy.mockRestore();
    });
  });
});

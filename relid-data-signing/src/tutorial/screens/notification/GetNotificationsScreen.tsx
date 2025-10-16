/**
 * Get Notifications Screen
 * 
 * Displays notifications retrieved from the REL-ID SDK with the following features:
 * - Automatically loads notifications on screen mount
 * - Displays notifications in a sorted list (latest first)
 * - Shows empty state when no notifications are available
 * - Provides notification selection with AI-generated action UI
 * - Handles both notification present and empty response formats
 * 
 * Key Features:
 * - Automatic getNotifications API call on screen load
 * - Real-time event handling for onGetNotifications
 * - Notification list with sorting and selection
 * - AI-generated UI for notification actions
 * - Error handling and loading states
 * 
 * Usage:
 * Navigation.navigate('GetNotifications', {
 *   userID: 'username',
 *   sessionID: 'session_id',
 *   jwtToken: 'jwt_token_string'
 * });
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import rdnaService from '../../../uniken/services/rdnaService';
import { StepUpPasswordDialog } from '../../../uniken/components/modals';
import type {
  RDNAGetNotificationsData,
  RDNANotificationItem,
  RDNANotificationAction,
  RDNAUpdateNotificationData,
  RDNAGetPasswordData,
  RDNASyncResponse,
} from '../../../uniken/types/rdnaEvents';
import { RDNASyncUtils } from '../../../uniken/types/rdnaEvents';

/**
 * Route Parameters for Get Notifications Screen
 */
interface GetNotificationsScreenParams {
  userID: string;
  sessionID: string;
  sessionType: number;
  jwtToken: string;
  loginTime?: string;
  userRole?: string;
  currentWorkFlow?: string;
}

type GetNotificationsScreenRouteProp = RouteProp<
  { GetNotifications: GetNotificationsScreenParams },
  'GetNotifications'
>;

/**
 * Get Notifications Screen Component
 */
const GetNotificationsScreen: React.FC = () => {
  const route = useRoute<GetNotificationsScreenRouteProp>();
  const navigation = useNavigation();

  const {
    userID,
    sessionID,
    sessionType,
    jwtToken,
    loginTime = new Date().toLocaleString(),
    userRole = 'NA',
    currentWorkFlow = 'NA',
  } = route.params || {};

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<RDNANotificationItem[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<RDNANotificationItem | null>(null);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Step-up authentication state
  const [showStepUpAuth, setShowStepUpAuth] = useState<boolean>(false);
  const [stepUpNotificationUUID, setStepUpNotificationUUID] = useState<string | null>(null);
  const [stepUpNotificationTitle, setStepUpNotificationTitle] = useState<string>('');
  const [stepUpNotificationMessage, setStepUpNotificationMessage] = useState<string>('');
  const [stepUpAction, setStepUpAction] = useState<string | null>(null);
  const [stepUpAttemptsLeft, setStepUpAttemptsLeft] = useState<number>(3);
  const [stepUpErrorMessage, setStepUpErrorMessage] = useState<string>('');
  const [stepUpSubmitting, setStepUpSubmitting] = useState<boolean>(false);

  /**
   * Handle getPassword event for step-up authentication (challengeMode = 3)
   */
  const handleGetPasswordStepUp = useCallback((data: RDNAGetPasswordData, originalHandler?: (data: RDNAGetPasswordData) => void) => {
    console.log('GetNotificationsScreen - getPassword event:', {
      challengeMode: data.challengeMode,
      attemptsLeft: data.attemptsLeft,
      statusCode: data.challengeResponse.status.statusCode
    });

    // Only handle challengeMode 3 (RDNA_OP_AUTHORIZE_NOTIFICATION)
    if (data.challengeMode !== 3) {
      console.log('GetNotificationsScreen - Not challengeMode 3, passing to original handler');
      // Pass to original handler for other challenge modes
      if (originalHandler) {
        originalHandler(data);
      }
      return;
    }

    // Hide action modal to show step-up modal on top
    setShowActionModal(false);

    // Update step-up auth state
    setStepUpAttemptsLeft(data.attemptsLeft);
    setStepUpSubmitting(false);

    // Check for error status codes
    const statusCode = data.challengeResponse.status.statusCode;
    const statusMessage = data.challengeResponse.status.statusMessage;

    if (statusCode !== 100) {
      // Failed authentication - show error
      setStepUpErrorMessage(statusMessage || 'Authentication failed. Please try again.');
    } else {
      // Clear any previous errors
      setStepUpErrorMessage('');
    }

    // Show step-up modal
    setShowStepUpAuth(true);
  }, []);

  /**
   * Load notifications on screen mount
   */
  useEffect(() => {
    loadNotifications();

    // Set up event handlers
    const eventManager = rdnaService.getEventManager();
    eventManager.setGetNotificationsHandler(handleNotificationsReceived);
    eventManager.setUpdateNotificationHandler(handleUpdateNotificationReceived);

    // Preserve original getPassword handler and chain it
    // This is critical - we need to handle challengeMode 3 but pass others to SDKEventProvider
    const originalGetPasswordHandler = (eventManager as any).getPasswordHandler;

    const wrappedGetPasswordHandler = (data: RDNAGetPasswordData) => {
      handleGetPasswordStepUp(data, originalGetPasswordHandler);
    };

    eventManager.setGetPasswordHandler(wrappedGetPasswordHandler);

    // Cleanup event handlers on unmount
    return () => {
      eventManager.setGetNotificationsHandler(undefined);
      eventManager.setUpdateNotificationHandler(undefined);
      // Restore original handler
      eventManager.setGetPasswordHandler(originalGetPasswordHandler);
    };
  }, [handleNotificationsReceived, handleUpdateNotificationReceived, handleGetPasswordStepUp]);

  /**
   * Load notifications from the SDK
   */
  const loadNotifications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('GetNotificationsScreen - Calling getNotifications API');
      await rdnaService.getNotifications();
      console.log('GetNotificationsScreen - getNotifications API call successful');
    } catch (error) {
      console.error('GetNotificationsScreen - getNotifications error:', error);
      setError('Failed to load notifications');
      setIsLoading(false);
    }
  };

  /**
   * Handle notifications received from onGetNotifications event
   */
  const handleNotificationsReceived = useCallback((data: RDNAGetNotificationsData) => {
    console.log('GetNotificationsScreen - Received notifications event');

    // Check if this is the standard response format (has pArgs)
    if (data.pArgs) {
      const notificationList = data.pArgs.response.ResponseData.notifications;

      console.log('GetNotificationsScreen - Received notifications:', notificationList.length);
      setNotifications(notificationList);
    } else if (data.userID) {
      // This is the authentication context format - no notifications in this format
      console.log('GetNotificationsScreen - Authentication context format, userID:', data.userID);
      setNotifications([]);
    } else {
      // Unknown format or error
      console.log('GetNotificationsScreen - Unknown response format');
      setNotifications([]);
    }

    setIsLoading(false);
  }, []);

  /**
   * Handle update notification response from onUpdateNotification event
   */
  const handleUpdateNotificationReceived = useCallback((data: RDNAUpdateNotificationData) => {
    console.log('GetNotificationsScreen - Received update notification event');
    setActionLoading(false);
    setStepUpSubmitting(false);

    // Check for errors first (including LDA cancelled)
    if (data.error.longErrorCode !== 0) {
      const errorMessage = data.error.errorString || 'Failed to update notification';
      const errorCode = data.error.longErrorCode;
      console.error('GetNotificationsScreen - Update notification error:', data.error);
      console.error('GetNotificationsScreen - Update notification statusCode:', data.pArgs?.response.StatusCode);

      // Hide step-up auth modal if visible
      setShowStepUpAuth(false);

      // Handle LDA cancelled (errorCode 131)
      if (errorCode === 131) {
        Alert.alert(
          'Authentication Cancelled',
          'Local device authentication was cancelled. Please try again.',
          [{ text: 'OK', onPress: () => setShowActionModal(false) }]
        );
        return;
      }

      Alert.alert(
        'Update Failed',
        errorMessage,
        [{ text: 'OK', onPress: () => setShowActionModal(false) }]
      );
      return;
    }

    // Check response status
    const responseData = data.pArgs?.response;
    const statusCode = responseData?.StatusCode;
    const statusMessage = responseData?.StatusMsg || 'Unknown error occurred';

    if (statusCode === 100) {
      // Success case
      const notificationUuid = responseData.ResponseData.notification_uuid;
      const message = responseData.StatusMsg;

      console.log('GetNotificationsScreen - Update notification success:', message);

      // Hide step-up auth modal if visible
      setShowStepUpAuth(false);
      setShowActionModal(false);

      // Show success message
      Alert.alert(
        'Success',
        message || 'Notification action completed successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to dashboard
              (navigation as any).navigate('DrawerNavigator', {
                screen: 'Dashboard',
              });
            }
          }
        ]
      );

      // Refresh notifications
      loadNotifications();
    } else if (statusCode === 110 || statusCode === 153) {
      // Critical errors: Password expired (110) or Attempts exhausted (153)
      // Show alert BEFORE SDK triggers onUserLoggedOff → getUser
      console.warn('GetNotificationsScreen - Critical error, user will be logged out:', statusCode);

      // Hide modals
      setShowStepUpAuth(false);
      setShowActionModal(false);

      // Show alert with critical error message
      Alert.alert(
        'Authentication Failed',
        statusMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              // SDK will automatically trigger onUserLoggedOff → getUser
              // User will be navigated to CheckUserScreen
              console.log('GetNotificationsScreen - Waiting for SDK to trigger logout flow');
            }
          }
        ]
      );
    } else {
      // Other error cases
      console.error('GetNotificationsScreen - Update notification status error:', statusMessage);

      // Hide step-up auth modal if visible
      setShowStepUpAuth(false);

      Alert.alert(
        'Update Failed',
        statusMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowActionModal(false);
              // Refresh notifications to get updated status
              loadNotifications();
            }
          }
        ]
      );
    }
  }, [navigation, loadNotifications]);

  /**
   * Sort notifications by timestamp (latest first)
   */
  const sortedNotifications = notifications.sort((a, b) => 
    b.create_ts_epoch - a.create_ts_epoch
  );

  /**
   * Handle step-up password submission
   */
  const handleStepUpPasswordSubmit = async (password: string) => {
    if (stepUpSubmitting || !stepUpNotificationUUID || !stepUpAction) {
      console.error('GetNotificationsScreen - Invalid step-up auth state');
      return;
    }

    setStepUpSubmitting(true);
    setStepUpErrorMessage('');

    try {
      console.log('GetNotificationsScreen - Submitting step-up password with challengeMode 3');

      const syncResponse: RDNASyncResponse = await rdnaService.setPassword(password, 3);

      console.log('GetNotificationsScreen - setPassword sync response:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        errorString: syncResponse.error?.errorString
      });

      // If setPassword succeeds, SDK will either:
      // 1. Trigger getPassword again if password is wrong (with error status)
      // 2. Process the updateNotification and trigger onUpdateNotification
      // The modal will stay visible until we get the final response

    } catch (error) {
      console.error('GetNotificationsScreen - setPassword sync error:', error);

      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);

      setStepUpErrorMessage(errorMessage);
      setStepUpSubmitting(false);
    }
  };

  /**
   * Handle step-up auth cancellation
   */
  const handleStepUpCancel = () => {
    console.log('GetNotificationsScreen - Step-up authentication cancelled');
    setShowStepUpAuth(false);
    setStepUpNotificationUUID(null);
    setStepUpNotificationTitle('');
    setStepUpNotificationMessage('');
    setStepUpAction(null);
    setStepUpErrorMessage('');
    setActionLoading(false);
  };

  /**
   * Handle notification selection
   */
  const handleNotificationSelect = (notification: RDNANotificationItem) => {
    setSelectedNotification(notification);
    setShowActionModal(true);
  };

  /**
   * Generate action UI based on notification's actual available actions
   */
  const generateActionUI = (notification: RDNANotificationItem) => {
    const handleActionPress = async (action: RDNANotificationAction) => {
      console.log('Action pressed:', action.action, 'for notification:', notification.notification_uuid);

      if (actionLoading) {
        console.log('Action already in progress, ignoring tap');
        return;
      }

      setActionLoading(true);

      // Store notification context for potential step-up auth
      setStepUpNotificationUUID(notification.notification_uuid);
      setStepUpNotificationTitle(notification.body[0]?.subject || 'Notification Action');
      setStepUpNotificationMessage(notification.body[0]?.message || '');
      setStepUpAction(action.action);
      setStepUpAttemptsLeft(3); // Reset attempts
      setStepUpErrorMessage(''); // Clear errors

      try {
        console.log('GetNotificationsScreen - Calling updateNotification API');
        await rdnaService.updateNotification(notification.notification_uuid, action.action);
        console.log('GetNotificationsScreen - UpdateNotification API call successful');
        // Response will be handled by handleUpdateNotificationReceived
        // If step-up auth is required, SDK will trigger getPassword with challengeMode 3
      } catch (error) {
        console.error('GetNotificationsScreen - UpdateNotification API error:', error);
        setActionLoading(false);
        setStepUpNotificationUUID(null);
        setStepUpAction(null);

        // Extract error message from the error object
        const errorMessage = RDNASyncUtils.getErrorMessage(error);

        Alert.alert(
          'Update Failed',
          errorMessage,
          [{ text: 'OK' }]
        );
      }
    };


    return (
      <View style={styles.actionContainer}>
        {notification.actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionButton,
              actionLoading && styles.actionButtonDisabled
            ]}
            onPress={() => handleActionPress(action)}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>
                {action.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  /**
   * Render notification item
   */
  const renderNotificationItem = ({ item }: { item: RDNANotificationItem }) => {
    // Get the primary body content (usually first language entry)
    const primaryBody = item.body[0] || {};
    const { subject = 'No Subject', message = 'No Message' } = primaryBody;
    
    return (
      <TouchableOpacity
        style={styles.notificationItem}
        onPress={() => handleNotificationSelect(item)}
      >
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{subject}</Text>
          <Text style={styles.notificationTime}>
            {new Date(item.create_ts.replace('UTC', 'Z')).toLocaleString()}
          </Text>
        </View>
        <Text style={styles.notificationMessage} numberOfLines={3}>
          {message}
        </Text>
        <View style={styles.notificationFooter}>
          <Text style={styles.notificationCategory}>
            {item.actions.length} action{item.actions.length !== 1 ? 's' : ''} available
          </Text>
          <Text style={styles.notificationType}>
            {item.action_performed || 'Pending'}
          </Text>
        </View>
        {item.expiry_timestamp && (
          <Text style={styles.notificationExpiry}>
            Expires: {new Date(item.expiry_timestamp.replace('UTC', 'Z')).toLocaleString()}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyMessage}>
        You don't have any notifications at the moment.
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={loadNotifications}>
        <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header with Menu Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => (navigation as any).openDrawer?.()}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.refreshIconButton} onPress={loadNotifications}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadNotifications}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={sortedNotifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.notification_uuid}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Action Modal */}
      <Modal
        visible={showActionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notification Actions</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowActionModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedNotification && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.notificationDetails}>
                  <Text style={styles.detailTitle}>
                    {selectedNotification.body[0]?.subject || 'No Subject'}
                  </Text>
                  <Text style={styles.detailMessage}>
                    {selectedNotification.body[0]?.message || 'No Message'}
                  </Text>
                  <Text style={styles.detailTime}>
                    Created: {new Date(selectedNotification.create_ts.replace('UTC', 'Z')).toLocaleString()}
                  </Text>
                  {selectedNotification.expiry_timestamp && (
                    <Text style={styles.detailTime}>
                      Expires: {new Date(selectedNotification.expiry_timestamp.replace('UTC', 'Z')).toLocaleString()}
                    </Text>
                  )}
                  <Text style={styles.detailUuid}>
                    ID: {selectedNotification.notification_uuid}
                  </Text>
                </View>

                {generateActionUI(selectedNotification)}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Step-Up Password Dialog */}
      <StepUpPasswordDialog
        visible={showStepUpAuth}
        notificationTitle={stepUpNotificationTitle}
        notificationMessage={stepUpNotificationMessage}
        userID={userID}
        attemptsLeft={stepUpAttemptsLeft}
        errorMessage={stepUpErrorMessage}
        isSubmitting={stepUpSubmitting}
        onSubmitPassword={handleStepUpPasswordSubmit}
        onCancel={handleStepUpCancel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 20,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 16,
    flex: 1,
  },
  refreshIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 18,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationCategory: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '500',
  },
  notificationType: {
    fontSize: 12,
    color: '#95a5a6',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  refreshButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  notificationDetails: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  detailMessage: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
    marginBottom: 8,
  },
  detailTime: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  detailUuid: {
    fontSize: 10,
    color: '#95a5a6',
    fontFamily: 'monospace',
  },
  notificationExpiry: {
    fontSize: 11,
    color: '#e67e22',
    fontStyle: 'italic',
    marginTop: 4,
  },
  actionContainer: {
    marginTop: 16,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: '#3498db',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.6,
  },
});

export default GetNotificationsScreen;

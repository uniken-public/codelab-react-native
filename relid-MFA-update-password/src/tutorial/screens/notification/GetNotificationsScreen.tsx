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

import React, { useState, useEffect } from 'react';
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
import type {
  RDNAGetNotificationsData,
  RDNANotificationItem,
  RDNANotificationAction,
  RDNAUpdateNotificationData,
} from '../../../uniken/types/rdnaEvents';

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

  /**
   * Load notifications on screen mount
   */
  useEffect(() => {
    loadNotifications();
    
    // Set up event handlers
    const eventManager = rdnaService.getEventManager();
    eventManager.setGetNotificationsHandler(handleNotificationsReceived);
    eventManager.setUpdateNotificationHandler(handleUpdateNotificationReceived);

    // Cleanup event handlers on unmount
    return () => {
      eventManager.setGetNotificationsHandler(undefined);
      eventManager.setUpdateNotificationHandler(undefined);
    };
  }, []);

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
  const handleNotificationsReceived = (data: RDNAGetNotificationsData) => {
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
  };

  /**
   * Handle update notification response from onUpdateNotification event
   */
  const handleUpdateNotificationReceived = (data: RDNAUpdateNotificationData) => {
    console.log('GetNotificationsScreen - Received update notification event');
    setActionLoading(false);

    // Check for errors first
    if (data.error.longErrorCode !== 0) {
      const errorMessage = data.error.errorString || 'Failed to update notification';
      console.error('GetNotificationsScreen - Update notification error:', data.error);
      console.error('GetNotificationsScreen - Update notification statusCode:', data.pArgs?.response.StatusCode);
      
      Alert.alert(
        'Update Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
      return;
    }

    // Check response status
    const responseData = data.pArgs?.response;
    if (responseData?.StatusCode === 100) {
      const notificationUuid = responseData.ResponseData.notification_uuid;
      const message = responseData.StatusMsg;
      
      console.log('GetNotificationsScreen - Update notification success:', message);
      setShowActionModal(false);
      loadNotifications();
    } else {
      const statusMessage = responseData?.StatusMsg || 'Unknown error occurred';
      console.error('GetNotificationsScreen - Update notification status error:', statusMessage);
      
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
  };

  /**
   * Sort notifications by timestamp (latest first)
   */
  const sortedNotifications = notifications.sort((a, b) => 
    b.create_ts_epoch - a.create_ts_epoch
  );

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

      try {
        console.log('GetNotificationsScreen - Calling updateNotification API');
        await rdnaService.updateNotification(notification.notification_uuid, action.action);
        console.log('GetNotificationsScreen - UpdateNotification API call successful');
        // Response will be handled by handleUpdateNotificationReceived
      } catch (error) {
        console.error('GetNotificationsScreen - UpdateNotification API error:', error);
        setActionLoading(false);
        
        Alert.alert(
          'Update Failed',
          'Failed to process action. Please try again.',
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
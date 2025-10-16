import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import type { DrawerParamList } from '../../navigation/DrawerNavigator';
import type { StackScreenProps } from '@react-navigation/stack';
import RdnaService from '../../../uniken/services/rdnaService';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import type { RDNAGetNotificationHistoryData } from '../../../uniken/types/rdnaEvents';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type NotificationHistoryScreenProps = StackScreenProps<DrawerParamList, 'NotificationHistory'>;

interface NotificationHistoryItem {
  notification_uuid: string;
  status: string;
  action_performed: string;
  body: Array<{
    lng: string;
    subject: string;
    message: string;
    label: Record<string, string>;
  }>;
  create_ts: string;
  update_ts: string;
  expiry_timestamp: string;
  create_ts_epoch: number;
  update_ts_epoch: number;
  expiry_timestamp_epoch: number;
  signing_status: string;
  actions: Array<{
    label: string;
    action: string;
    authlevel: string;
  }>;
}

const NotificationHistoryScreen: React.FC<NotificationHistoryScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const [historyItems, setHistoryItems] = useState<NotificationHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NotificationHistoryItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const userParams = route.params;

  // Load notification history when screen mounts
  useEffect(() => {
    loadNotificationHistory();

    // Set up event handler for notification history response
    const eventManager = RdnaService.getEventManager();
    const originalHandler = eventManager.getOnGetNotificationHistoryHandler();

    eventManager.setGetNotificationHistoryHandler((data: RDNAGetNotificationHistoryData) => {
      handleNotificationHistoryResponse(data);

      // Call original handler if it exists
      if (originalHandler) {
        originalHandler(data);
      }
    });

    return () => {
      // Restore original handler on cleanup
      eventManager.setGetNotificationHistoryHandler(originalHandler);
    };
  }, []);

  /**
   * Load notification history from the server
   */
  const loadNotificationHistory = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      console.log('NotificationHistoryScreen - Loading notification history');

      // Call getNotificationHistory API with parameters similar to reference implementation
      await RdnaService.getNotificationHistory(
        10,    // recordCount
        1,     // startIndex
        '',    // enterpriseId
        '',    // startDate
        '',    // endDate
        '',    // notificationStatus
        '',    // actionPerformed
        '',    // keywordSearch
        ''     // deviceId
      );

    } catch (error) {
      console.error('NotificationHistoryScreen - Error loading notification history:', error);
      setLoading(false);
      Alert.alert(
        'Error',
        'Failed to load notification history. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [loading]);

  /**
   * Handle notification history response from the SDK
   */
  const handleNotificationHistoryResponse = useCallback((data: RDNAGetNotificationHistoryData) => {
    console.log('NotificationHistoryScreen - Received notification history response');
    setLoading(false);
    setRefreshing(false);

    try {
      if (data.errCode === 0 && data.pArgs?.response?.ResponseData?.history) {
        const history = data.pArgs.response.ResponseData.history;
        console.log(`NotificationHistoryScreen - Loaded ${history.length} history items`);

        // Sort by update timestamp (most recent first)
        const sortedHistory = history.sort((a, b) =>
          new Date(b.update_ts || b.create_ts).getTime() - new Date(a.update_ts || a.create_ts).getTime()
        );

        setHistoryItems(sortedHistory);
      } else {
        const errorMsg = data.error?.errorString || 'Unknown error occurred';
        console.error('NotificationHistoryScreen - API error:', errorMsg);
        Alert.alert('Error', errorMsg);
        setHistoryItems([]);
      }
    } catch (error) {
      console.error('NotificationHistoryScreen - Error parsing response:', error);
      Alert.alert('Error', 'Failed to parse notification history response');
      setHistoryItems([]);
    }
  }, []);

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotificationHistory();
  }, [loadNotificationHistory]);

  /**
   * Format timestamp to user-friendly format
   */
  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays <= 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return timestamp;
    }
  };

  /**
   * Convert UTC timestamp to local time
   */
  const convertUTCToLocal = (utcTimestamp: string): string => {
    try {
      if (!utcTimestamp) return 'Not available';

      // Handle different UTC timestamp formats
      let cleanTimestamp = utcTimestamp;

      // If timestamp ends with 'UTC', replace with 'Z' for proper parsing
      if (utcTimestamp.endsWith('UTC')) {
        cleanTimestamp = utcTimestamp.replace('UTC', 'Z');
      }

      // Create date object from cleaned UTC timestamp
      const utcDate = new Date(cleanTimestamp);

      // Check if date is valid
      if (isNaN(utcDate.getTime())) {
        console.log('convertUTCToLocal - Invalid date for timestamp:', utcTimestamp);
        return utcTimestamp; // Return original if can't parse
      }

      // Convert to local time string
      const localTime = utcDate.toLocaleString();
      console.log('convertUTCToLocal - Converted:', utcTimestamp, '→', localTime);
      return localTime;
    } catch (error) {
      console.log('convertUTCToLocal - Error:', error);
      return utcTimestamp; // Return original on error
    }
  };

  /**
   * Get color for status
   */
  const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'UPDATED':
      case 'ACCEPTED':
        return '#4CAF50'; // Green
      case 'REJECTED':
      case 'DISCARDED':
        return '#F44336'; // Red
      case 'EXPIRED':
        return '#FF9800'; // Orange
      case 'DISMISSED':
        return '#9E9E9E'; // Gray
      default:
        return '#2196F3'; // Blue
    }
  };

  /**
   * Get color for action performed
   */
  const getActionColor = (action: string): string => {
    if (action === 'NONE') return '#9E9E9E';
    if (action.toLowerCase().includes('accept') || action.toLowerCase().includes('approve')) {
      return '#4CAF50'; // Green
    }
    if (action.toLowerCase().includes('reject') || action.toLowerCase().includes('deny')) {
      return '#F44336'; // Red
    }
    return '#2196F3'; // Blue
  };

  /**
   * Handle item tap to show details
   */
  const handleItemPress = (item: NotificationHistoryItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  /**
   * Close detail modal
   */
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedItem(null);
  };

  /**
   * Render individual history item
   */
  const renderHistoryItem = (item: NotificationHistoryItem, index: number) => {
    const body = item.body?.[0] || {};
    const subject = body.subject || 'No Subject';
    const message = body.message || 'No message available';

    return (
      <TouchableOpacity
        key={item.notification_uuid}
        style={styles.historyItem}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemSubject} numberOfLines={1}>
            {subject}
          </Text>
          <Text style={styles.itemTime}>
            {formatTimestamp(item.update_ts || item.create_ts)}
          </Text>
        </View>

        <Text style={styles.itemMessage} numberOfLines={2}>
          {message.replace(/\\n/g, ' ')}
        </Text>

        <View style={styles.itemFooter}>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>

          <View style={styles.actionContainer}>
            <Text style={styles.actionLabel}>Action: </Text>
            <Text style={[styles.actionValue, { color: getActionColor(item.action_performed) }]}>
              {item.action_performed || 'NONE'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Render detail modal
   */
  const renderDetailModal = () => {
    if (!selectedItem) return null;

    const body = selectedItem.body?.[0] || {};

    return (
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeDetailModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notification Details</Text>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={true}>
              <Text style={styles.detailSubject}>{body.subject || 'No Subject'}</Text>

              <Text style={styles.detailMessage}>
                {(body.message || 'No message available').replace(/\\n/g, '\n')}
              </Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, { color: getStatusColor(selectedItem.status) }]}>
                  {selectedItem.status}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Action Performed:</Text>
                <Text style={[styles.detailValue, { color: getActionColor(selectedItem.action_performed) }]}>
                  {selectedItem.action_performed || 'NONE'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Created:</Text>
                <Text style={styles.detailValue}>
                  {convertUTCToLocal(selectedItem.create_ts)}
                </Text>
              </View>

              {selectedItem.update_ts && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Updated:</Text>
                  <Text style={styles.detailValue}>
                    {convertUTCToLocal(selectedItem.update_ts)}
                  </Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Expiry:</Text>
                <Text style={styles.detailValue}>
                  {convertUTCToLocal(selectedItem.expiry_timestamp)}
                </Text>
              </View>

              {selectedItem.signing_status && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Signing Status:</Text>
                  <Text style={styles.detailValue}>{selectedItem.signing_status}</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeDetailModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header with Menu Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📜 Notification History</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
            title="Pull to refresh"
          />
        }
        showsVerticalScrollIndicator={true}
      >
        {loading && !refreshing && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading notification history...</Text>
          </View>
        )}

        {!loading && historyItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notification history found</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadNotificationHistory}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {historyItems.map((item, index) => renderHistoryItem(item, index))}
      </ScrollView>

      {renderDetailModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  itemTime: {
    fontSize: 12,
    color: '#666',
  },
  itemMessage: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flex: 1,
  },
  statusBadge: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  detailSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailMessage: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationHistoryScreen;
/**
 * Device Management Screen
 *
 * Displays all registered devices for the current user with pull-to-refresh functionality.
 * Features cooling period banner, current device highlighting, and navigation to device details.
 *
 * Key Features:
 * - Auto-load devices on screen mount
 * - Pull-to-refresh functionality
 * - Cooling period banner with countdown timer
 * - Current device highlighting
 * - Device list with friendly UI
 * - Tap device to view details
 *
 * Usage:
 * Navigation.navigate('DeviceManagementScreen');
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import rdnaService from '../../../uniken/services/rdnaService';
import type { RDNARegisteredDevice, RDNAGetRegisteredDeviceDetailsData } from '../../../uniken/types/rdnaEvents';

/**
 * Route Parameters for Device Management Screen
 */
interface DeviceManagementScreenParams {
  userID?: string;
}

type DeviceManagementScreenRouteProp = RouteProp<
  { DeviceManagementScreen: DeviceManagementScreenParams },
  'DeviceManagementScreen'
>;

/**
 * Device Management Screen Component
 */
const DeviceManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<DeviceManagementScreenRouteProp>();

  const { userID } = route.params || {};

  const [devices, setDevices] = useState<RDNARegisteredDevice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [coolingPeriodEndTimestamp, setCoolingPeriodEndTimestamp] = useState<number | null>(null);
  const [coolingPeriodMessage, setCoolingPeriodMessage] = useState<string>('');
  const [isCoolingPeriodActive, setIsCoolingPeriodActive] = useState<boolean>(false);

  /**
   * Fetches registered device details from the SDK
   */
  const loadDevices = useCallback(async () => {
    if (!userID) {
      console.error('DeviceManagementScreen - No userID available');
      Alert.alert('Error', 'User ID is required to load devices');
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    console.log('DeviceManagementScreen - Loading devices for user:', userID);
    setIsLoading(true);

    try {
      // Set up event handler for device details response
      const eventManager = rdnaService.getEventManager();

      await new Promise<void>((resolve, reject) => {
        // Preserve existing callback
        const originalCallback = (eventManager as any).getRegisteredDeviceDetailsHandler;

        // Set temporary callback for this screen
        eventManager.setGetRegisteredDeviceDetailsHandler((data: RDNAGetRegisteredDeviceDetailsData) => {
          console.log('DeviceManagementScreen - Received device details event');
          console.log('DeviceManagementScreen - Device count:', data.pArgs?.response?.ResponseData?.device?.length || 0);
          console.log('DeviceManagementScreen - Status code:', data.pArgs?.response?.StatusCode);

          // Check for errors using data.error.longErrorCode
          if (data.error && data.error.longErrorCode !== 0) {
            console.error('DeviceManagementScreen - API error:', data.error);
            reject(new Error(data.error?.errorString || 'Failed to load devices'));
            return;
          }

          // Extract device data
          const deviceList = data.pArgs?.response?.ResponseData?.device || [];
          const coolingPeriodEnd = data.pArgs?.response?.ResponseData?.deviceManagementCoolingPeriodEndTimestamp || null;
          const statusCode = data.pArgs?.response?.StatusCode || 0;
          const statusMsg = data.pArgs?.response?.StatusMsg || '';

          console.log('DeviceManagementScreen - Device list:', deviceList);
          console.log('DeviceManagementScreen - Cooling period end:', coolingPeriodEnd);

          setDevices(deviceList);
          setCoolingPeriodEndTimestamp(coolingPeriodEnd);
          setCoolingPeriodMessage(statusMsg);
          setIsCoolingPeriodActive(statusCode === 146);
         
          resolve();

          // Restore original callback
          if (originalCallback) {
            eventManager.setGetRegisteredDeviceDetailsHandler(originalCallback);
          }
        });

        // Call the API with userID
        rdnaService.getRegisteredDeviceDetails(userID).catch((error) => {
          console.error('DeviceManagementScreen - API call failed:', error);
          reject(error);
        });
      });

      console.log('DeviceManagementScreen - Devices loaded successfully');
    } catch (error) {
      console.error('DeviceManagementScreen - Failed to load devices:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load devices. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userID]);

  /**
   * Handles pull-to-refresh action
   */
  const onRefresh = useCallback(() => {
    console.log('DeviceManagementScreen - Pull to refresh triggered');
    setIsRefreshing(true);
    loadDevices();
  }, [loadDevices]);

  /**
   * Handles device item tap
   */
  const handleDeviceTap = useCallback((device: RDNARegisteredDevice) => {
    console.log('DeviceManagementScreen - Device tapped:', device.devUUID);

    // Navigate to DeviceDetailScreen
    (navigation as any).navigate('DeviceDetailScreen', {
      device: device,
      userID: userID,
      isCoolingPeriodActive: isCoolingPeriodActive,
      coolingPeriodEndTimestamp: coolingPeriodEndTimestamp,
      coolingPeriodMessage: coolingPeriodMessage,
    });
  }, [navigation, userID, isCoolingPeriodActive, coolingPeriodEndTimestamp, coolingPeriodMessage]);

  /**
   * Formats timestamp to readable date string
   */
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Renders individual device item
   */
  const renderDeviceItem = ({ item }: { item: RDNARegisteredDevice }) => {
    const isCurrentDevice = item.currentDevice;
    const isActive = item.status === 'ACTIVE';

    return (
      <TouchableOpacity
        style={[
          styles.deviceCard,
          isCurrentDevice && styles.currentDeviceCard,
        ]}
        onPress={() => handleDeviceTap(item)}
        activeOpacity={0.7}
      >
        {/* Current Device Badge */}
        {isCurrentDevice && (
          <View style={styles.currentDeviceBadge}>
            <Text style={styles.currentDeviceBadgeText}>Current Device</Text>
          </View>
        )}

        {/* Device Name */}
        <Text style={styles.deviceName} numberOfLines={1}>
          {item.devName}
        </Text>

        {/* Device Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, isActive ? styles.statusDotActive : styles.statusDotInactive]} />
          <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextInactive]}>
            {item.status}
          </Text>
        </View>

        {/* Device Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Accessed:</Text>
            <Text style={styles.detailValue}>{formatDate(item.lastAccessedTsEpoch)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>{formatDate(item.createdTsEpoch)}</Text>
          </View>
        </View>

        {/* Tap Indicator */}
        <Text style={styles.tapIndicator}>Tap for details →</Text>
      </TouchableOpacity>
    );
  };

  /**
   * Renders cooling period banner
   */
  const renderCoolingPeriodBanner = () => {
    if (!isCoolingPeriodActive) {
      return null;
    }

    return (
      <View style={styles.coolingPeriodBanner}>
        <Text style={styles.coolingPeriodIcon}>⏳</Text>
        <View style={styles.coolingPeriodTextContainer}>
          <Text style={styles.coolingPeriodTitle}>Cooling Period Active</Text>
          <Text style={styles.coolingPeriodMessage}>{coolingPeriodMessage}</Text>
        </View>
      </View>
    );
  };

  /**
   * Load devices on mount and cleanup event handlers on unmount
   */
  useFocusEffect(
    useCallback(() => {
      console.log('DeviceManagementScreen - Screen focused, loading devices');
      loadDevices();

      // Cleanup function: restore original event handler when screen unfocuses
      return () => {
        console.log('DeviceManagementScreen - Screen unfocused, cleaning up event handlers');
        const eventManager = rdnaService.getEventManager();
        // Reset handler to prevent memory leaks
        eventManager.setGetRegisteredDeviceDetailsHandler(undefined);
      };
    }, [loadDevices])
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
        <Text style={styles.headerTitle}>Device Management</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Cooling Period Banner */}
      {renderCoolingPeriodBanner()}

      {/* Main Content */}
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading devices...</Text>
          </View>
        ) : (
          <FlatList
            data={devices}
            renderItem={renderDeviceItem}
            keyExtractor={(item) => item.devUUID}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#007AFF']}
                tintColor="#007AFF"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No devices found</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
  container: {
    flex: 1,
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
  headerSpacer: {
    flex: 1,
  },
  coolingPeriodBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  coolingPeriodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  coolingPeriodTextContainer: {
    flex: 1,
  },
  coolingPeriodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  coolingPeriodMessage: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
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
  listContent: {
    padding: 16,
  },
  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  currentDeviceCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#f1f8f4',
  },
  currentDeviceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  currentDeviceBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    paddingRight: 100, // Make room for badge
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: '#4CAF50',
  },
  statusDotInactive: {
    backgroundColor: '#f44336',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusTextActive: {
    color: '#4CAF50',
  },
  statusTextInactive: {
    color: '#f44336',
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  tapIndicator: {
    marginTop: 12,
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default DeviceManagementScreen;

/**
 * Device Detail Screen
 *
 * Displays detailed information about a selected device.
 * Shows device metadata, status, and action buttons (for future implementation).
 *
 * Key Features:
 * - Complete device information display
 * - Current device indicator
 * - Status display
 * - Cooling period awareness
 * - Action buttons (disabled during cooling period)
 *
 * Usage:
 * Navigation.navigate('DeviceDetailScreen', { device, isCoolingPeriodActive, ... });
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import rdnaService from '../../../uniken/services/rdnaService';
import RenameDeviceDialog from './RenameDeviceDialog';
import type { RDNARegisteredDevice, RDNAUpdateDeviceDetailsData } from '../../../uniken/types/rdnaEvents';
import { RDNASyncUtils } from '../../../uniken/types/rdnaEvents';

/**
 * Route Parameters for Device Detail Screen
 */
interface DeviceDetailScreenParams {
  device: RDNARegisteredDevice;
  userID: string;
  isCoolingPeriodActive: boolean;
  coolingPeriodEndTimestamp: number | null;
  coolingPeriodMessage: string;
}

type DeviceDetailScreenRouteProp = RouteProp<
  { DeviceDetailScreen: DeviceDetailScreenParams },
  'DeviceDetailScreen'
>;

/**
 * Device Detail Screen Component
 */
const DeviceDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<DeviceDetailScreenRouteProp>();

  const {
    device,
    userID,
    isCoolingPeriodActive,
    coolingPeriodMessage,
  } = route.params || {};

  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentDeviceName, setCurrentDeviceName] = useState(device?.devName || '');

  /**
   * Cleanup event handlers on component unmount
   */
  React.useEffect(() => {
    return () => {
      console.log('DeviceDetailScreen - Component unmounting, cleaning up event handlers');
      const eventManager = rdnaService.getEventManager();
      // Reset handler to prevent memory leaks
      eventManager.setUpdateDeviceDetailsHandler(undefined);
    };
  }, []);

  /**
   * Unified method to handle device update operations (rename/delete)
   */
  const updateDevice = async (newName: string, operationType: number): Promise<void> => {
    const isRename = operationType === 0;
    const operation = isRename ? 'rename' : 'delete';

    if (isRename) {
      setIsRenaming(true);
    } else {
      setIsDeleting(true);
    }

    try {
      console.log(`DeviceDetailScreen - ${operation} device:`, device.devUUID);

      const eventManager = rdnaService.getEventManager();

      await new Promise<void>((resolve, reject) => {
        // Set callback for this operation
        eventManager.setUpdateDeviceDetailsHandler((data: RDNAUpdateDeviceDetailsData) => {
          console.log('DeviceDetailScreen - Received update device details event');

          if (data.error && data.error.longErrorCode !== 0) {
            console.error(`DeviceDetailScreen - ${operation} error:`, data.error);
            reject(new Error(data.error?.errorString || `Failed to ${operation} device`));
            return;
          }

          const statusCode = data.pArgs?.response?.StatusCode || 0;
          const statusMsg = data.pArgs?.response?.StatusMsg || '';

          if (statusCode === 100) {
            console.log(`DeviceDetailScreen - ${operation} successful`);
            if (isRename) {
              setCurrentDeviceName(newName);
            }
            resolve();
          } else if (statusCode === 146) {
            reject(new Error('Device management is currently in cooling period. Please try again later.'));
          } else {
            reject(new Error(statusMsg || `Failed to ${operation} device`));
          }
        });

        rdnaService.updateDeviceDetails(userID, device, newName, operationType).catch(reject);
      });

      // Success handling
      if (isRename) {
        setShowRenameDialog(false);
      }

      Alert.alert('Success', `Device ${isRename ? 'renamed' : 'deleted'} successfully`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(`DeviceDetailScreen - ${operation} failed:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to ${operation} device`;
      Alert.alert(`${isRename ? 'Rename' : 'Delete'} Failed`, errorMessage);
    } finally {
      if (isRename) {
        setIsRenaming(false);
      } else {
        setIsDeleting(false);
      }
    }
  };

  if (!device) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Device data not available</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isCurrentDevice = device.currentDevice;
  const isActive = device.status === 'ACTIVE';

  /**
   * Formats timestamp to readable date string
   */
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  /**
   * Formats timestamp to relative time (e.g., "2 hours ago")
   */
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  /**
   * Renders info row
   */
  const renderInfoRow = (label: string, value: string, highlight: boolean = false) => {
    return (
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>{value}</Text>
      </View>
    );
  };

  /**
   * Handles rename device action
   */
  const handleRenameDevice = async (newName: string) => {
    await updateDevice(newName, 0);
  };

  /**
   * Handles delete device action
   */
  const handleDeleteDevice = () => {
    Alert.alert(
      'Delete Device',
      `Are you sure you want to delete "${currentDeviceName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performDeleteDevice },
      ]
    );
  };

  const performDeleteDevice = async () => {
    await updateDevice('', 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Device Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container}>
        {/* Current Device Badge */}
        {isCurrentDevice && (
          <View style={styles.currentDeviceBanner}>
            <Text style={styles.currentDeviceIcon}>📱</Text>
            <Text style={styles.currentDeviceText}>This is your current device</Text>
          </View>
        )}

        {/* Device Name Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Information</Text>
          <Text style={styles.deviceName}>{currentDeviceName}</Text>

          {/* Status */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, isActive ? styles.statusDotActive : styles.statusDotInactive]} />
            <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextInactive]}>
              {device.status}
            </Text>
          </View>
        </View>

        {/* Device Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>

          {renderInfoRow('Device UUID', device.devUUID)}
          {renderInfoRow('App UUID', device.appUuid)}
          {renderInfoRow('Device Bind', device.devBind.toString())}
        </View>

        {/* Access Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Access Information</Text>

          {renderInfoRow('Last Accessed', formatDate(device.lastAccessedTsEpoch))}
          {renderInfoRow('', formatRelativeTime(device.lastAccessedTsEpoch), true)}

          <View style={styles.divider} />

          {renderInfoRow('Created', formatDate(device.createdTsEpoch))}
          {renderInfoRow('', formatRelativeTime(device.createdTsEpoch), true)}
        </View>

        {/* Cooling Period Warning */}
        {isCoolingPeriodActive && (
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>Actions Disabled</Text>
              <Text style={styles.warningMessage}>{coolingPeriodMessage}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Device Actions</Text>

          <TouchableOpacity
            style={[styles.actionButton, (isCoolingPeriodActive || isRenaming) && styles.actionButtonDisabled]}
            onPress={() => setShowRenameDialog(true)}
            disabled={isCoolingPeriodActive || isRenaming}
          >
            {isRenaming ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>✏️ Rename Device</Text>
            )}
          </TouchableOpacity>

          {!isCurrentDevice && (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonDanger, (isCoolingPeriodActive || isDeleting) && styles.actionButtonDisabled]}
              onPress={handleDeleteDevice}
              disabled={isCoolingPeriodActive || isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>🗑️ Remove Device</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Rename Device Dialog */}
      <RenameDeviceDialog
        visible={showRenameDialog}
        currentDeviceName={currentDeviceName}
        isSubmitting={isRenaming}
        onSubmit={handleRenameDevice}
        onCancel={() => setShowRenameDialog(false)}
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  currentDeviceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  currentDeviceIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  currentDeviceText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  deviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusDotActive: {
    backgroundColor: '#4CAF50',
  },
  statusDotInactive: {
    backgroundColor: '#f44336',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#4CAF50',
  },
  statusTextInactive: {
    color: '#f44336',
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '500',
  },
  infoValueHighlight: {
    color: '#007AFF',
    fontSize: 13,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  warningMessage: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#e0e0e0',
    opacity: 0.6,
  },
  actionButtonDanger: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  actionButtonTextDanger: {
    color: '#fff',
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  infoMessage: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  infoMessageText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default DeviceDetailScreen;

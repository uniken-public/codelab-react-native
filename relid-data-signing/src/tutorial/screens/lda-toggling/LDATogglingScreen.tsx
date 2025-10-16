/**
 * LDA Toggling Screen
 *
 * Displays authentication capabilities retrieved from the REL-ID SDK with the following features:
 * - Automatically loads authentication details on screen mount
 * - Displays authentication types in a list with toggle switches
 * - Allows users to enable/disable authentication types
 * - Handles both getPassword and getUserConsentForLDA flows
 * - Shows empty state when no LDA is available
 *
 * Key Features:
 * - Automatic getDeviceAuthenticationDetails API call on screen load (returns data in sync callback)
 * - Real-time event handling for onDeviceAuthManagementStatus (only async event for LDA toggling)
 * - Toggle switches for enabling/disabling authentication types
 * - Authentication type name mapping for user-friendly display
 * - Error handling and loading states
 *
 * Callback Pattern:
 * - getDeviceAuthenticationDetails: Sync callback only (no async event)
 * - manageDeviceAuthenticationModes: Async event (onDeviceAuthManagementStatus)
 *
 * Usage:
 * Navigation.navigate('LDAToggling', {
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
  FlatList,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import rdnaService from '../../../uniken/services/rdnaService';
import type {
  RDNADeviceAuthManagementStatusData,
  RDNAAuthenticationCapability,
} from '../../../uniken/types/rdnaEvents';

/**
 * Route Parameters for LDA Toggling Screen
 */
interface LDATogglingScreenParams {
  userID: string;
  sessionID: string;
  sessionType: number;
  jwtToken: string;
  loginTime?: string;
  userRole?: string;
  currentWorkFlow?: string;
}

type LDATogglingScreenRouteProp = RouteProp<
  { LDAToggling: LDATogglingScreenParams },
  'LDAToggling'
>;

/**
 * Authentication Type Mapping
 * Maps authenticationType number to human-readable name
 * Based on RDNA.RDNALDACapabilities enum mapping
 */
const AUTH_TYPE_NAMES: Record<number, string> = {
  0: 'None',
  1: 'Biometric Authentication',  // RDNA_LDA_FINGERPRINT
  2: 'Face ID',                    // RDNA_LDA_FACE
  3: 'Pattern Authentication',     // RDNA_LDA_PATTERN
  4: 'Biometric Authentication',  // RDNA_LDA_SSKB_PASSWORD
  9: 'Biometric Authentication',  // RDNA_DEVICE_LDA
};

/**
 * LDA Toggling Screen Component
 */
const LDATogglingScreen: React.FC = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authCapabilities, setAuthCapabilities] = useState<RDNAAuthenticationCapability[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processingAuthType, setProcessingAuthType] = useState<number | null>(null);

  /**
   * Load authentication details on screen mount
   */
  useEffect(() => {
    loadAuthenticationDetails();

    // Set up event handler for auth management status (only async callback needed)
    const eventManager = rdnaService.getEventManager();
    eventManager.setDeviceAuthManagementStatusHandler(handleAuthManagementStatusReceived);

    // Cleanup event handlers on unmount
    return () => {
      eventManager.setDeviceAuthManagementStatusHandler(undefined);
    };
  }, []);

  /**
   * Load authentication details from the SDK
   * Data is returned directly in the sync callback, no async event
   */
  const loadAuthenticationDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('LDATogglingScreen - Calling getDeviceAuthenticationDetails API');
      const data = await rdnaService.getDeviceAuthenticationDetails();
      console.log('LDATogglingScreen - getDeviceAuthenticationDetails API call successful');

      // Check for errors
      if (data.error.longErrorCode !== 0) {
        const errorMessage = data.error.errorString || 'Failed to load authentication details';
        console.error('LDATogglingScreen - Authentication details error:', data.error);
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      const capabilities = data.authenticationCapabilities || [];
      console.log('LDATogglingScreen - Received capabilities:', capabilities.length);

      setAuthCapabilities(capabilities);
      setIsLoading(false);
    } catch (error: any) {
      console.error('LDATogglingScreen - getDeviceAuthenticationDetails error:', error);
      const errorMessage = error?.error?.errorString || 'Failed to load authentication details';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  /**
   * Handle auth management status received from onDeviceAuthManagementStatus event
   */
  const handleAuthManagementStatusReceived = (data: RDNADeviceAuthManagementStatusData) => {
    console.log('LDATogglingScreen - Received auth management status event');
    setProcessingAuthType(null);

    // Check for errors
    if (data.error.longErrorCode !== 0) {
      const errorMessage = data.error.errorString || 'Failed to update authentication mode';
      console.error('LDATogglingScreen - Auth management status error:', data.error);

      Alert.alert(
        'Update Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
      return;
    }

    // Check status
    if (data.status.statusCode === 100) {
      const opMode = data.OpMode === 1 ? 'enabled' : 'disabled';
      const authTypeName = AUTH_TYPE_NAMES[data.ldaType] || `Authentication Type ${data.ldaType}`;

      console.log('LDATogglingScreen - Auth management status success:', data.status.statusMessage);

      Alert.alert(
        'Success',
        `${authTypeName} has been ${opMode} successfully.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Refresh authentication details to get updated status
              loadAuthenticationDetails();
            }
          }
        ]
      );
    } else {
      const statusMessage = data.status.statusMessage || 'Unknown error occurred';
      console.error('LDATogglingScreen - Auth management status error:', statusMessage);

      Alert.alert(
        'Update Failed',
        statusMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              // Refresh authentication details to get updated status
              loadAuthenticationDetails();
            }
          }
        ]
      );
    }
  };

  /**
   * Handle toggle switch change
   */
  const handleToggleChange = async (capability: RDNAAuthenticationCapability, newValue: boolean) => {
    const authTypeName = AUTH_TYPE_NAMES[capability.authenticationType] || `Authentication Type ${capability.authenticationType}`;

    console.log('LDATogglingScreen - Toggle change:', {
      authenticationType: capability.authenticationType,
      authTypeName,
      currentValue: capability.isConfigured,
      newValue
    });

    if (processingAuthType !== null) {
      console.log('LDATogglingScreen - Another operation is in progress, ignoring toggle');
      return;
    }

    setProcessingAuthType(capability.authenticationType);

    try {
      console.log('LDATogglingScreen - Calling manageDeviceAuthenticationModes API');
      await rdnaService.manageDeviceAuthenticationModes(newValue, capability.authenticationType);
      console.log('LDATogglingScreen - manageDeviceAuthenticationModes API call successful');
      // Response will be handled by handleAuthManagementStatusReceived
    } catch (error) {
      console.error('LDATogglingScreen - manageDeviceAuthenticationModes API error:', error);
      setProcessingAuthType(null);

      Alert.alert(
        'Update Failed',
        'Failed to update authentication mode. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  /**
   * Render authentication capability item
   */
  const renderAuthCapabilityItem = ({ item }: { item: RDNAAuthenticationCapability }) => {
    const authTypeName = AUTH_TYPE_NAMES[item.authenticationType] || `Authentication Type ${item.authenticationType}`;
    const isEnabled = item.isConfigured === 1;
    const isProcessing = processingAuthType === item.authenticationType;

    return (
      <View style={styles.authItem}>
        <View style={styles.authInfo}>
          <Text style={styles.authTypeName}>{authTypeName}</Text>
          <Text style={styles.authTypeId}>Type ID: {item.authenticationType}</Text>
          <Text style={[
            styles.authStatus,
            isEnabled ? styles.statusEnabled : styles.statusDisabled
          ]}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
        <View style={styles.toggleContainer}>
          {isProcessing ? (
            <ActivityIndicator size="small" color="#3498db" />
          ) : (
            <Switch
              value={isEnabled}
              onValueChange={(newValue) => handleToggleChange(item, newValue)}
              trackColor={{ false: '#ccc', true: '#3498db' }}
              thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
              disabled={processingAuthType !== null}
            />
          )}
        </View>
      </View>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔐</Text>
      <Text style={styles.emptyTitle}>No LDA Available</Text>
      <Text style={styles.emptyMessage}>
        No Local Device Authentication (LDA) capabilities are available for this device.
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={loadAuthenticationDetails}>
        <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render footer info
   */
  const renderFooterInfo = () => (
    <View style={styles.footerInfoContainer}>
      <Text style={styles.footerInfoText}>
        When biometric has been set up, you will be able to login into the application via configured authentication mode.
      </Text>
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
        <Text style={styles.headerTitle}>LDA Toggling</Text>
        <TouchableOpacity style={styles.refreshIconButton} onPress={loadAuthenticationDetails}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Loading authentication details...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadAuthenticationDetails}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={authCapabilities}
            renderItem={renderAuthCapabilityItem}
            keyExtractor={(item) => item.authenticationType.toString()}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={authCapabilities.length > 0 ? renderFooterInfo : null}
            contentContainerStyle={styles.listContainer}
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
  authItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authInfo: {
    flex: 1,
    marginRight: 16,
  },
  authTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  authTypeId: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  authStatus: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statusEnabled: {
    color: '#27ae60',
  },
  statusDisabled: {
    color: '#95a5a6',
  },
  toggleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
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
  footerInfoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  footerInfoText: {
    fontSize: 14,
    color: '#1565c0',
    lineHeight: 20,
  },
});

export default LDATogglingScreen;

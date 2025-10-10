/**
 * Verify Auth Screen
 * 
 * This screen is specifically designed for handling new device activation via REL-ID Verify.
 * It automatically initiates the REL-ID Verify process and provides fallback options.
 * 
 * Key Features:
 * - Automatically calls performVerifyAuth(true) when screen loads
 * - Shows processing status and user information
 * - Provides fallback activation flow when device is not handy
 * - Real-time error handling and loading states
 * - No manual approve/reject buttons - verification is automatic
 * 
 * Usage:
 * Navigation.navigate('VerifyAuthScreen', {
 *   eventData: data,
 *   title: 'Additional Device Activation',
 *   subtitle: 'Activate this device for secure access',
 *   responseData: data
 * });
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RDNAAddNewDeviceOptionsData, RDNASyncResponse } from '../../../uniken/types/rdnaEvents';
import { RDNASyncUtils } from '../../../uniken/types/rdnaEvents';
import rdnaService from '../../../uniken/services/rdnaService';
import { CloseButton, Button, StatusBanner } from '../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type VerifyAuthScreenRouteProp = RouteProp<RootStackParamList, 'VerifyAuthScreen'>;

/**
 * Verify Auth Screen Component
 */
const VerifyAuthScreen: React.FC = () => {
  const route = useRoute<VerifyAuthScreenRouteProp>();
  
  const {
    eventData,
    title = 'Additional Device Activation',
    subtitle = 'Activate this device for secure access',
    responseData,
  } = route.params;

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activationData, setActivationData] = useState<{
    userID: string;
    options: string[];
  } | null>(null);

  /**
   * Handle close button - direct resetAuthState call
   */
  const handleClose = async () => {
    try {
      console.log('VerifyAuthScreen - Calling resetAuthState');
      await rdnaService.resetAuthState();
      console.log('VerifyAuthScreen - ResetAuthState successful');
    } catch (error) {
      console.error('VerifyAuthScreen - ResetAuthState error:', error);
    }
  };

  /**
   * Process activation data
   */
  const processActivationData = (data: RDNAAddNewDeviceOptionsData) => {
    return {
      userID: data.userID,
      options: data.newDeviceOptions,
    };
  };

  /**
   * Handle response data from route params
   */
  useEffect(() => {
    if (responseData) {
      console.log('VerifyAuthScreen - Processing response data from route params:', responseData);
      
      try {
        // Process activation data
        const processed = processActivationData(responseData);
        setActivationData(processed);
        
        console.log('VerifyAuthScreen - Processed activation data:', {
          userID: processed.userID,
          options: processed.options,
        });
        
        // Automatically call performVerifyAuth(true) when data is processed
        handleVerifyAuth(true);
      } catch (error) {
        console.error('VerifyAuthScreen - Failed to process activation data:', error);
        setError('Failed to process activation data');
      }
    }
  }, [responseData]);

  /**
   * Handle REL-ID Verify authentication
   */
  const handleVerifyAuth = async (proceed: boolean) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError('');

    try {
      console.log('VerifyAuthScreen - Performing verify auth:', proceed);
      
      const syncResponse: RDNASyncResponse = await rdnaService.performVerifyAuth(proceed);
      
      console.log('VerifyAuthScreen - PerformVerifyAuth sync response successful, waiting for async events');
      console.log('VerifyAuthScreen - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });
      
      if (proceed) {
        // Log success message for approval
        console.log('VerifyAuthScreen - REL-ID Verify notification has been sent to registered devices');
      }
      
    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('VerifyAuthScreen - PerformVerifyAuth sync error:', error);
      
      // Cast the error back to RDNASyncResponse as per other screens pattern
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle fallback new device activation flow
   */
  const handleFallbackFlow = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError('');

    try {
      console.log('VerifyAuthScreen - Initiating fallback new device activation flow');
      
      const syncResponse: RDNASyncResponse = await rdnaService.fallbackNewDeviceActivationFlow();
      
      console.log('VerifyAuthScreen - FallbackNewDeviceActivationFlow sync response successful, waiting for async events');
      console.log('VerifyAuthScreen - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });
      
      // Log success message for fallback initiation
      console.log('VerifyAuthScreen - Alternative device activation process has been initiated');
      
    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('VerifyAuthScreen - FallbackNewDeviceActivationFlow sync error:', error);
      
      // Cast the error back to RDNASyncResponse as per other screens pattern
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView style={styles.container}>
        {/* Close Button */}
        <CloseButton 
          onPress={handleClose}
          disabled={isProcessing}
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          
          {/* Error Display */}
          {error && (
            <StatusBanner
              type="error"
              message={error}
            />
          )}

          {/* Processing Status */}
          {isProcessing && (
            <View style={styles.processingContainer}>
              <StatusBanner
                type="info"
                message="Processing device activation..."
              />
            </View>
          )}
          
          {/* Activation Information */}
          {activationData && (
            <>
              {/* Processing Message */}
              <View style={styles.messageContainer}>
                <Text style={styles.messageTitle}>REL-ID Verify Authentication</Text>
                <Text style={styles.messageText}>
                  REL-ID Verify notification has been sent to your registered devices. Please approve it to activate this device.
                </Text>
              </View>

              {/* Fallback Option */}
              <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackTitle}>Device Not Handy?</Text>
                <Text style={styles.fallbackDescription}>
                  If you don't have access to your registered devices, you can use an alternative activation method.
                </Text>

                <Button
                  title="Activate using fallback method"
                  onPress={handleFallbackFlow}
                  loading={isProcessing}
                  variant="outline"
                  style={styles.fallbackButton}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
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
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 80, // Add space for close button
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  processingContainer: {
    marginBottom: 20,
  },
  messageContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#1565c0',
    lineHeight: 24,
  },
  fallbackContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  fallbackDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  fallbackButton: {
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  helpContainer: {
    backgroundColor: '#e8f4f8',
    borderRadius: 8,
    padding: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default VerifyAuthScreen;
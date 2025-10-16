/**
 * User LDA Consent Screen
 * 
 * This screen is specifically designed for handling user consent for LDA (Local Device Authentication).
 * It provides a focused interface for user consent approval/rejection with LDA information.
 * 
 * Key Features:
 * - Dynamic LDA name based on authentication type
 * - Consent message display with approve/reject options
 * - Real-time error handling and loading states
 * - Success/error feedback
 * - Automatic API parameter extraction from event data
 * 
 * Usage:
 * Navigation.navigate('UserLDAConsentScreen', {
 *   eventData: data,
 *   title: 'Local Device Authentication Consent',
 *   subtitle: 'Grant permission for device authentication',
 *   responseData: data
 * });
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RDNAEventUtils, RDNASyncUtils } from '../../../uniken/types/rdnaEvents';
import type { RDNAGetUserConsentForLDAData, RDNASyncResponse } from '../../../uniken/types/rdnaEvents';
import { RDNALDACapabilities } from 'react-native-rdna-client/src/rdnastruct';
import rdnaService from '../../../uniken/services/rdnaService';
import { CloseButton, Button, StatusBanner } from '../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type UserLDAConsentScreenRouteProp = RouteProp<RootStackParamList, 'UserLDAConsentScreen'>;


/**
 * User LDA Consent Screen Component
 */
const UserLDAConsentScreen: React.FC = () => {
  const route = useRoute<UserLDAConsentScreenRouteProp>();
  const navigation = useNavigation();

  const {
    eventData,
    title,
    subtitle,
    responseData,
  } = route.params;

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [consentData, setConsentData] = useState<{
    title: string;
    message: string;
    approveButtonText: string;
    rejectButtonText: string;
  }>({
    title: 'Local Device Authentication Consent',
    message: 'Do you want to enable Local Device Authentication for faster and more secure access?',
    approveButtonText: 'Approve',
    rejectButtonText: 'Reject',
  });

  /**
   * Handle close button - direct resetAuthState call
   */
  const handleClose = async () => {
    try {
      console.log('UserLDAConsentScreen - Calling resetAuthState');
      await rdnaService.resetAuthState();
      console.log('UserLDAConsentScreen - ResetAuthState successful');
    } catch (error) {
      console.error('UserLDAConsentScreen - ResetAuthState error:', error);
    }
  };

  /**
   * Get LDA name based on authentication type
   * Maps RDNALDACapabilities to user-friendly names
   */
  const getLDAName = (authenticationType: number): string => {
    switch (authenticationType) {
      case RDNALDACapabilities.RDNA_LDA_FINGERPRINT:
        return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
      case RDNALDACapabilities.RDNA_LDA_FACE:
        return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
      case RDNALDACapabilities.RDNA_LDA_PATTERN:
        return 'Pattern';
      case RDNALDACapabilities.RDNA_LDA_SSKB_PASSWORD:
        return 'SSKB Password';
      case RDNALDACapabilities.RDNA_SEC_QA:
        return 'Security Question';
      case RDNALDACapabilities.RDNA_IDV_EXT_BIO_OPT_IN:
        return 'External Biometric (Opt-In)';
      case RDNALDACapabilities.RDNA_IDV_EXT_BIO_OPT_OUT:
        return 'External Biometric (Opt-Out)';
      case RDNALDACapabilities.RDNA_LDA_DEVICE_PASSCODE:
        return Platform.OS === 'ios' ? 'Device Passcode' : 'Device Credentials';
      case RDNALDACapabilities.RDNA_DEVICE_LDA:
        return 'Device Authentication';
      case RDNALDACapabilities.RDNA_LDA_BIOMETRIC:
        return 'Device Biometric';
      case RDNALDACapabilities.RDNA_LDA_INVALID:
        return 'Invalid Authentication';
      default:
        return 'Local Device Authentication';
    }
  };

  /**
   * Extract and process consent message from challenge info
   */
  const processConsentMessage = (data: RDNAGetUserConsentForLDAData) => {
    const ldaName = getLDAName(data.authenticationType);
    
    // Look for custom consent message in challengeInfo
    const consentMessage = RDNAEventUtils.getChallengeValue(data, 'LDA_CONSENT_MESSAGE');
    
    let processedData = {
      title: `${ldaName} Consent`,
      message: `Do you want to enable ${ldaName} for faster and more secure access to this application?`,
      approveButtonText: 'Approve',
      rejectButtonText: 'Reject',
    };

    // Parse custom consent message if available
    if (consentMessage) {
      try {
        const customData = JSON.parse(consentMessage);
        
        if (customData.title) {
          processedData.title = customData.title.replace(/<BR>/g, '\n').replace(/__LDA_NAME__/g, ldaName);
        }
        
        if (customData.message) {
          processedData.message = customData.message.replace(/<BR>/g, '\n').replace(/__LDA_NAME__/g, ldaName);
        }
        
        if (customData.btnApprove) {
          processedData.approveButtonText = customData.btnApprove;
        }
        
        if (customData.btnReject) {
          processedData.rejectButtonText = customData.btnReject;
        }
      } catch (error) {
        console.warn('UserLDAConsentScreen - Failed to parse custom consent message:', error);
      }
    }

    return processedData;
  };

  /**
   * Handle response data from route params
   */
  useEffect(() => {
    if (responseData) {
      console.log('UserLDAConsentScreen - Processing response data from route params:', responseData);
      
      // Check for API errors first
      if (RDNAEventUtils.hasApiError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('UserLDAConsentScreen - API error:', errorMessage);
        setError(errorMessage);
        return;
      }
      
      // Check for status errors
      if (RDNAEventUtils.hasStatusError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('UserLDAConsentScreen - Status error:', errorMessage);
        setError(errorMessage);
        return;
      }
      
      // Process consent data
      const processed = processConsentMessage(responseData);
      setConsentData(processed);
      
      console.log('UserLDAConsentScreen - Processed consent data:', {
        userID: responseData.userID,
        challengeMode: responseData.challengeMode,
        authenticationType: responseData.authenticationType,
        ldaName: getLDAName(responseData.authenticationType),
      });
    }
  }, [responseData]);

  /**
   * Handle user consent for LDA
   */
  const handleUserConsent = async (isApproved: boolean) => {
    if (isProcessing || !responseData) return;

    setIsProcessing(true);
    setError('');

    try {
      console.log('UserLDAConsentScreen - Submitting user consent:', {
        isApproved,
        challengeMode: responseData.challengeMode,
        authenticationType: responseData.authenticationType,
      });
      
      const syncResponse: RDNASyncResponse = await rdnaService.setUserConsentForLDA(
        isApproved,
        responseData.challengeMode,
        responseData.authenticationType
      );

      console.log('UserLDAConsentScreen - SetUserConsentForLDA sync response successful, waiting for async events');
      console.log('UserLDAConsentScreen - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });

      // Close the screen after successful consent submission if challengeMode is 16 (LDA toggling)
      if (responseData.challengeMode === 16) {
        console.log('UserLDAConsentScreen - ChallengeMode is 16 (LDA toggling), closing screen after successful consent submission');
        navigation.goBack();
      }

    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('UserLDAConsentScreen - SetUserConsentForLDA sync error:', error);
      
      // Cast the error back to RDNASyncResponse as per TutorialHomeScreen pattern
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
        <Text style={styles.title}>{consentData.title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        
        {/* Error Display */}
        {error && (
          <StatusBanner
            type="error"
            message={error}
          />
        )}

        {/* Consent Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{consentData.message}</Text>
        </View>

        {/* User Information */}
        {responseData && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>User:</Text>
            <Text style={styles.infoValue}>{responseData.userID}</Text>
            <Text style={styles.infoLabel}>Authentication Type:</Text>
            <Text style={styles.infoValue}>{getLDAName(responseData.authenticationType)}</Text>
          </View>
        )}

        {/* Consent Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={consentData.approveButtonText}
            onPress={() => handleUserConsent(true)}
            loading={isProcessing}
            disabled={!responseData}
            variant="success"
            style={styles.button}
          />

          <Button
            title={consentData.rejectButtonText}
            onPress={() => handleUserConsent(false)}
            loading={isProcessing}
            disabled={!responseData}
            variant="danger"
            style={styles.button}
          />
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            By approving, you enable {responseData ? getLDAName(responseData.authenticationType) : 'Local Device Authentication'} for 
            this application, providing faster and more secure access to your account.
          </Text>
        </View>
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
  errorContainer: {
    backgroundColor: '#fff0f0',
    borderLeftColor: '#e74c3c',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginTop: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 2,
  },
  approveButton: {
    backgroundColor: '#27ae60',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default UserLDAConsentScreen;
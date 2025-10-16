/**
 * IDV Biometric Opt-In Consent Screen
 * 
 * This screen displays biometric template storage consent options and allows users to accept or deny.
 * Based on ReactReferenceApp/App/Components/AuthScreens/SaveTemplate.js
 * while maintaining the current project theme and patterns.
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Alert, 
  StatusBar, 
  Platform,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import RdnaService from '../../../uniken/services/rdnaService';
import type { RDNAGetIDVBiometricOptInConsentData } from '../../../uniken/types/rdnaEvents';
import type { RootStackParamList } from '../../navigation/AppNavigator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type IDVBiometricOptInConsentScreenRouteProp = RouteProp<RootStackParamList, 'IDVBiometricOptInConsentScreen'>;

const IDVBiometricOptInConsentScreen: React.FC = () => {
  const route = useRoute<IDVBiometricOptInConsentScreenRouteProp>();
  
  // Extract parameters passed from SDKEventProvider (following reference pattern)
  const {
    title = 'Save Template',
    userDetails,
  } = route.params || {};

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [biometricOptInData, setBiometricOptInData] = useState<RDNAGetIDVBiometricOptInConsentData | null>(userDetails || null);

  useEffect(() => {
    if (userDetails) {
      console.log('IDVBiometricOptInConsentScreen - Received biometric opt-in data:', userDetails);
      setBiometricOptInData(userDetails);
    }
  }, [userDetails]);

  const handleClose = () => {
    // Following reference close pattern
    const challengeMode = biometricOptInData?.challengeMode;
    if (challengeMode === 10 || challengeMode === 13) {
      // Navigate back to dashboard for specific challenge modes
      console.log('IDVBiometricOptInConsentScreen - Navigating back to dashboard');
    } else {
      // Trigger close event for other modes
      console.log('IDVBiometricOptInConsentScreen - Triggering close event');
    }
  };

  const handleConsentAction = async (isOptIn: boolean) => {
    try {
      setIsProcessing(true);
      setError('');
      console.log('IDVBiometricOptInConsentScreen - Processing biometric opt-in consent:', isOptIn);
      
      const challengeMode = biometricOptInData?.challengeMode || 0;
      
      // Call the setIDVBiometricOptInConsent API following reference pattern
      const response = await RdnaService.setIDVBiometricOptInConsent(isOptIn, challengeMode);
      
      console.log('IDVBiometricOptInConsentScreen - API response:', response);
      
      // Show success message based on action
      const message = isOptIn 
        ? 'Biometric template storage approved!' 
        : 'Biometric template storage denied.';
      console.log('IDVBiometricOptInConsentScreen - ' + message);
      
    } catch (error) {
      console.error('IDVBiometricOptInConsentScreen - Failed to process biometric opt-in consent:', error);
      setError('Failed to process biometric consent');
      Alert.alert('Error', 'Failed to process biometric consent. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getGuidelineTexts = () => {
    const challengeMode = biometricOptInData?.challengeMode || 0;
    
    switch (challengeMode) {
      case 10:
        return {
          text1: 'Your biometric template will be used for enhanced security verification.',
          text2: 'This allows for faster and more secure authentication in future sessions.',
          actionText: 'Approve'
        };
      case 13:
        return {
          text1: 'Agent KYC biometric template will be stored securely for verification purposes.',
          text2: 'This enables enhanced security for agent-assisted transactions.',
          actionText: 'Approve'
        };
      default:
        return {
          text1: 'Your selfie biometric template will be securely stored for identity verification.',
          text2: 'This enables faster authentication and enhanced security for your account.',
          actionText: 'Approve'
        };
    }
  };

  const guidelines = getGuidelineTexts();
  const challengeMode = biometricOptInData?.challengeMode || 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      <View style={styles.wrap}>
        <View style={styles.contentContainer}>
          
          {/* Close Button (following reference Title component pattern) */}
          <View style={styles.titleWrap}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content Area (following reference center layout) */}
          <View style={styles.mainContent}>
            
            {/* App Logo placeholder */}
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>🔐</Text>
              </View>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.modalTitle}>
                {challengeMode === 13 ? 'Set up Photo ID' : 'Set up Selfie ID'}
              </Text>
            </View>
            
            {/* Divider */}
            <View style={styles.border} />

            {/* Guidelines Text */}
            <Text style={styles.guidelineText}>
              {guidelines.text1} REL-ID {guidelines.text2}
            </Text>

            {/* Divider */}
            <View style={styles.border} />

            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}


            {/* Action Buttons */}
            <View style={styles.bottomButtons}>
              {/* Primary Action Buttons */}
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleConsentAction(false)}
                disabled={isProcessing}
              >
                <Text style={styles.actionButtonText}>
                  {isProcessing ? 'Processing...' : 'Reject'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleConsentAction(true)}
                disabled={isProcessing}
              >
                <Text style={styles.actionButtonText}>
                  {isProcessing ? 'Processing...' : 'Approve'}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main container (following reference pattern)
  container: {
    backgroundColor: '#ffffff',
    height: '100%',
  },
  wrap: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  
  // Title/Close area (following reference pattern)
  titleWrap: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },

  // Main content (following reference center layout)
  mainContent: {
    flex: 1,
    height: SCREEN_HEIGHT,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },

  // Logo container (following reference LOGO component)
  logoContainer: {
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    color: '#ffffff',
  },

  // Title container (following reference modalTitle pattern)
  titleContainer: {
    justifyContent: 'center',
    borderRadius: 30,
  },
  modalTitle: {
    color: '#333333',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    backgroundColor: 'transparent',
    marginTop: 10,
    fontWeight: 'bold',
  },

  // Border divider (following reference pattern)
  border: {
    height: 1,
    marginTop: 15,
    marginHorizontal: 12,
    backgroundColor: '#cccccc',
    width: SCREEN_WIDTH - 50,
  },

  // Guidelines text (following reference pattern)
  guidelineText: {
    color: '#333333',
    fontSize: 16,
    textAlign: 'left',
    marginHorizontal: 25,
    marginTop: 15,
    lineHeight: 22,
  },


  // Bottom buttons (following reference pattern)
  bottomButtons: {
    flexDirection: 'row',
    marginTop: 20,
    height: 60,
    width: '90%',
    justifyContent: 'space-around',
  },
  actionButton: {
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    marginHorizontal: 15,
    elevation: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50', // Green for approve/positive action
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  rejectButton: {
    backgroundColor: '#F44336', // Red for reject/negative action  
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Additional buttons container
  additionalButtons: {
    flexDirection: 'column',
    marginTop: 15,
    width: '90%',
    alignItems: 'center',
  },
  secondaryButton: {
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  proceedAnywayButton: {
    backgroundColor: '#FF9800', // Orange for proceed anyway (warning action)
  },
  rescanButton: {
    backgroundColor: '#2196F3', // Blue for rescan document (primary action)
  },
  recaptureButton: {
    backgroundColor: '#9C27B0', // Purple for recapture selfie (secondary action)
  },
  secondaryButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Error container
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    width: SCREEN_WIDTH - 60,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default IDVBiometricOptInConsentScreen;
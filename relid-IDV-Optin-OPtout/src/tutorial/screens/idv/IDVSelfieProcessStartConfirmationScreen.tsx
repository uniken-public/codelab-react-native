/**
 * IDV Selfie Process Start Confirmation Screen
 * 
 * This screen handles selfie capture process start confirmation events and provides UI 
 * for initiating selfie capture. It follows the reference PrepareSelfieCapture.js pattern 
 * while maintaining current project theme.
 * Receives navigation parameters from SDKEventProvider.
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Alert, 
  StatusBar, 
  ActivityIndicator, 
  Platform,
  Dimensions,
  TouchableOpacity,
  Image,
  Switch
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import RdnaService from '../../../uniken/services/rdnaService';
import type { RDNAGetIDVSelfieProcessStartConfirmationData } from '../../../uniken/types/rdnaEvents';
import type { RootStackParamList } from '../../navigation/AppNavigator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type IDVSelfieProcessStartConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'IDVSelfieProcessStartConfirmationScreen'>;

const IDVSelfieProcessStartConfirmationScreen: React.FC = () => {
  const route = useRoute<IDVSelfieProcessStartConfirmationScreenRouteProp>();
  
  // Extract parameters passed from SDKEventProvider (following Selfie scan pattern)
  const {
    eventName,
    eventData,
    title = 'Selfie Capture Information',
    subtitle = 'Prepare to capture your selfie',
    responseData,
  } = route.params || {};

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selfieData, setSelfieData] = useState<RDNAGetIDVSelfieProcessStartConfirmationData | null>(responseData || null);
  const [useBackCamera, setUseBackCamera] = useState<boolean>(false);

  useEffect(() => {
    // If we received event data from navigation, set it immediately
    if (responseData) {
      console.log('IDVSelfieProcessStartConfirmationScreen - Received event data from navigation:', responseData);
      setSelfieData(responseData);
      setUseBackCamera(responseData.useDeviceBackCamera || false);
    }
  }, [responseData]);

  // Get guideline text based on IDV workflow (following reference pattern)
  const getGuidelineTexts = (): { text1: string; text2: string; text3: string } => {
    const idvWorkflow = selfieData?.idvWorkflow || 0;
    
    switch (idvWorkflow) {
      case 0:
        return {
          text1: 'Ensure good lighting and position your face clearly in the frame for IDV activation process.',
          text2: 'Remove any sunglasses, hats, or face coverings for clear facial recognition.',
          text3: 'Look directly at the camera and follow any on-screen prompts during capture.'
        };
      case 1:
        return {
          text1: 'Position your face clearly for IDV activation with template verification.',
          text2: 'Ensure your face matches the document photo for identity verification.',
          text3: 'Maintain steady position and good lighting throughout the capture process.'
        };
      case 2:
        return {
          text1: 'Additional device activation requires clear selfie capture for verification.',
          text2: 'Position your face within the frame and ensure good lighting conditions.',
          text3: 'Face will be matched with your existing biometric template for verification.'
        };
      case 3:
        return {
          text1: 'Additional device without template requires new biometric enrollment.',
          text2: 'Position your face clearly for initial biometric template creation.',
          text3: 'Follow capture guidelines for successful template generation.'
        };
      case 4:
        return {
          text1: 'Account recovery with template - verify your identity using existing biometric data.',
          text2: 'Position your face clearly for comparison with stored template.',
          text3: 'Ensure good lighting and stable positioning for successful verification.'
        };
      case 5:
        return {
          text1: 'Account recovery without template - create new biometric profile.',
          text2: 'Position your face clearly for new biometric template creation.',
          text3: 'Follow capture instructions for successful profile establishment.'
        };
      case 6:
        return {
          text1: 'Post-login KYC process - capture selfie for identity verification.',
          text2: 'Ensure your face is clearly visible and well-lit for verification.',
          text3: 'Face will be compared with document photo for identity confirmation.'
        };
      case 8:
        return {
          text1: 'Post-login selfie biometric - capture selfie for biometric authentication.',
          text2: 'Position your face clearly for biometric template verification.',
          text3: 'Ensure stable positioning and good lighting for accurate capture.'
        };
      case 9:
        return {
          text1: 'Step-up authentication - additional verification through selfie capture.',
          text2: 'Position your face clearly for enhanced security verification.',
          text3: 'Face will be verified against your existing biometric profile.'
        };
      case 10:
        return {
          text1: 'Biometric opt-in process - capture selfie for biometric enrollment.',
          text2: 'Position your face clearly for initial biometric template creation.',
          text3: 'This will enable biometric authentication for future logins.'
        };
      case 13:
        return {
          text1: 'Agent KYC process - capture customer selfie for identity verification.',
          text2: 'Ensure customer face is clearly visible and well-positioned.',
          text3: 'Face will be compared with document photo for customer verification.'
        };
      case 15:
        return {
          text1: 'Login selfie biometric - verify identity through selfie capture.',
          text2: 'Position your face clearly for biometric authentication.',
          text3: 'Face will be matched with your stored biometric template.'
        };
      default:
        return {
          text1: 'Ensure good lighting and position your face clearly in the frame for IDV activation process.',
          text2: 'Remove any sunglasses, hats, or face coverings for clear facial recognition.',
          text3: 'Look directly at the camera and follow any on-screen prompts during capture.'
        };
    }
  };

  // Handle selfie button action (following reference captureSelfieButtonAction pattern)
  const handleCaptureSelfieAction = async () => {
    try {
      setIsProcessing(true);
      setError('');
      console.log('IDVSelfieProcessStartConfirmationScreen - Starting IDV selfie capture process...');
      
      // Use the idvWorkflow from the event data, following reference pattern
      const idvWorkflow = selfieData?.idvWorkflow || 0;
      
      // Call the API to confirm starting the selfie capture process
      // Following reference: setIDVSelfieProcessStartConfirmation(true, useBackCamera, idvWorkflow)
      const response = await RdnaService.setIDVSelfieProcessStartConfirmation(true, useBackCamera, idvWorkflow);
      
      console.log('IDVSelfieProcessStartConfirmationScreen - API response:', response);
      
      // Show success message (following reference pattern)
      
    } catch (error) {
      console.error('IDVSelfieProcessStartConfirmationScreen - Failed to start selfie capture:', error);
      setError('Failed to start selfie capture process');
      Alert.alert('Error', 'Failed to start selfie capture process');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle close/cancel action (following reference cancelSelfieButtonAction pattern)  
  const handleCancelAction = async () => {
    try {
      setIsProcessing(true);
      setError('');
      console.log('IDVSelfieProcessStartConfirmationScreen - Cancelling IDV selfie capture process...');
      
      // Use the idvWorkflow from the event data, following reference pattern
      const idvWorkflow = selfieData?.idvWorkflow || 0;
      
      // Call the API to cancel the selfie capture process
      // Following reference: setIDVSelfieProcessStartConfirmation(false, false, idvWorkflow)
      const response = await RdnaService.setIDVSelfieProcessStartConfirmation(false, false, idvWorkflow);
      
      console.log('IDVSelfieProcessStartConfirmationScreen - Cancel response:', response);
      
    } catch (error) {
      console.error('IDVSelfieProcessStartConfirmationScreen - Failed to cancel selfie capture:', error);
      setError('Failed to cancel selfie capture process');
      Alert.alert('Error', 'Failed to cancel selfie capture process');
    } finally {
      setIsProcessing(false);
    }
  };

  const guidelineTexts = getGuidelineTexts();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      <View style={styles.wrap}>
        <View style={styles.contentContainer}>
          
          {/* Close Button (following reference Title component pattern) */}
          <View style={styles.titleWrap}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancelAction}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content Area (following reference center layout) */}
          <View style={styles.mainContent}>
            
            {/* Loading Animation and Face Icon (following reference pattern) */}
            <View style={styles.iconContainer}>
              <ActivityIndicator 
                color="#2196F3" 
                style={styles.loadingSpinner} 
                size="large" 
              />
              <View style={styles.selfieIcon}>
                <Text style={styles.selfieIconText}>🤳</Text>
                <Text style={styles.captureText}>SELFIE</Text>
              </View>
            </View>

            {/* Separator (following reference pattern) */}
            <View style={styles.separatorView} />

            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Guidelines (following reference pattern) */}
            <View style={styles.row}>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.textBody}>
                {guidelineTexts.text1}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.textBody}>
                {guidelineTexts.text2}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.textBody}>
                {guidelineTexts.text3}
              </Text>
            </View>

            {/* Camera Switch (following reference pattern) */}
            <View style={styles.switchMainContainer}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTextStyle}>
                  Use Back Camera
                </Text>
              </View>
              
              <View style={styles.switchContainer}>
                <Switch
                  trackColor={{ true: '#2196F3', false: 'grey' }}
                  value={useBackCamera}
                  onValueChange={(switchValue) => setUseBackCamera(switchValue)}
                />
              </View>
            </View>


            {/* Capture Button (following reference pattern) */}
            <TouchableOpacity
              style={[styles.captureButton, isProcessing && styles.buttonDisabled]}
              onPress={handleCaptureSelfieAction}
              disabled={isProcessing}
            >
              <Text style={styles.captureButtonText}>
                {'Capture Selfie'}
              </Text>
            </TouchableOpacity>

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

  // Icon container (following reference pattern)
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingSpinner: {
    position: 'absolute',
    width: 180,
    height: 120,
  },
  selfieIcon: {
    width: 170,
    height: 170,
    backgroundColor: '#f5f5f5',
    borderRadius: 85,
    borderWidth: 3,
    borderColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selfieIconText: {
    fontSize: 50,
  },
  captureText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 5,
    textAlign: 'center',
  },

  // Separator (following reference pattern)
  separatorView: {
    backgroundColor: '#cccccc',
    height: 0.7,
    width: 200,
    marginBottom: 24,
  },

  // Guidelines rows (following reference pattern)
  row: {
    marginTop: 15,
    flexDirection: 'row',
    width: SCREEN_WIDTH - 62,
    paddingHorizontal: 16,
  },
  dot: {
    fontSize: 20,
    width: 15,
    color: '#000000',
    marginLeft: 8,
    opacity: 0.8,
  },
  textBody: {
    paddingTop: 4,
    fontSize: 16,
    marginRight: 20,
    color: '#333333',
    lineHeight: 22,
  },

  // Camera switch (following reference pattern)
  switchMainContainer: { 
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH - 62,
  },
  switchTextContainer: { 
    justifyContent: 'center',        
    marginRight: 20,
  },
  switchContainer: { 
    justifyContent: 'center',                       
  },
  switchTextStyle: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },


  // Capture button (following reference Button pattern)
  captureButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  captureButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
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

export default IDVSelfieProcessStartConfirmationScreen;
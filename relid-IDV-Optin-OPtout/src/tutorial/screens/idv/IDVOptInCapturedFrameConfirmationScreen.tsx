/**
 * IDV Opt-In Captured Frame Confirmation Screen
 * 
 * This screen handles the captured biometric frame confirmation during IDV opt-in process.
 * It displays the captured frame and allows users to confirm or retake the capture.
 * Uses the onIDVOptInCapturedFrameConfirmation callback.
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
  TouchableOpacity,
  Image
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import RdnaService from '../../../uniken/services/rdnaService';
import RdnaEventManager from '../../../uniken/services/rdnaEventManager';
import type { RDNAIDVOptInCapturedFrameConfirmationData } from '../../../uniken/types/rdnaEvents';
import type { RootStackParamList } from '../../navigation/AppNavigator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type IDVOptInCapturedFrameConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'IDVOptInCapturedFrameConfirmationScreen'>;

const IDVOptInCapturedFrameConfirmationScreen: React.FC = () => {
  const route = useRoute<IDVOptInCapturedFrameConfirmationScreenRouteProp>();
  const navigation = useNavigation();
  
  // Extract parameters passed from SDKEventProvider
  const {
    title = 'Confirm Captured Frame',
    capturedFrameData,
  } = route.params || {};

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [capturedData, setCapturedData] = useState<RDNAIDVOptInCapturedFrameConfirmationData | null>(capturedFrameData || null);

  useEffect(() => {
    console.log('IDVOptInCapturedFrameConfirmationScreen - Initializing');
    
    // Set up the event handler for captured frame confirmation
    const eventManager = RdnaEventManager.getInstance();
    eventManager.setIDVOptInCapturedFrameConfirmationHandler(handleCapturedFrameConfirmation);

    if (capturedFrameData) {
      console.log('IDVOptInCapturedFrameConfirmationScreen - Received captured frame data:', capturedFrameData);
      setCapturedData(capturedFrameData);
    }

    // Cleanup event handler on unmount
    return () => {
      eventManager.setIDVOptInCapturedFrameConfirmationHandler(undefined);
    };
  }, [capturedFrameData]);

  /**
   * Handle the captured frame confirmation callback from the SDK
   */
  const handleCapturedFrameConfirmation = (data: RDNAIDVOptInCapturedFrameConfirmationData) => {
    console.log('IDVOptInCapturedFrameConfirmationScreen - Captured frame confirmation received:', data);
    
    try {
      // Update the captured data state with the new data including capturedImage
      setCapturedData(data);
      
      // Check if we received a captured image
      if (data) {
       
        
        // Clear any previous errors since we received valid data
        setError('');
      }
      
      // Check if the confirmation was successful
      if (data.error?.longErrorCode === 0 && data.challengeResponse?.status?.statusCode === 100) {
        console.log('IDVOptInCapturedFrameConfirmationScreen - Frame confirmation successful');
        // Don't show success alert immediately - wait for user interaction
      } else {
        // Handle error case
        const errorMsg = data.error?.errorString || data.challengeResponse?.status?.statusMessage || 'Unknown error';
        console.error('IDVOptInCapturedFrameConfirmationScreen - Frame confirmation failed:', errorMsg);
        setError(errorMsg);
        Alert.alert('Error', `Frame confirmation failed: ${errorMsg}`);
      }
    } catch (error) {
      console.error('IDVOptInCapturedFrameConfirmationScreen - Error processing confirmation:', error);
      setError('Failed to process frame confirmation');
    }
    
    setIsProcessing(false);
  };

  const handleClose = () => {
    console.log('IDVOptInCapturedFrameConfirmationScreen - Closing screen');
    navigation.goBack();
  };

  const handleConfirmFrame = async (status: number) => {
    try {
      setIsProcessing(true);
      setError('');
      console.log('IDVOptInCapturedFrameConfirmationScreen - Confirming captured frame with status:', status);
      
      const challengeMode = capturedData?.challengeMode || 0;
      
      // Call the SDK method to confirm the captured frame
      // This will trigger the onIDVOptInCapturedFrameConfirmation callback
      const response = await RdnaService.setIDVBiometricOptInConfirmation(status);
      
      console.log('IDVOptInCapturedFrameConfirmationScreen - Confirm API response:', response);
      
      // Show success message for confirmation
      if (status === 0) { // Confirm
       
      } else if (status === 1) { // Retake
        Alert.alert(
          'Retake Requested',
          'Requesting new frame capture...',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else if (status === 2) { // Cancel
        Alert.alert(
          'Cancelled',
          'Frame confirmation cancelled.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
      
    } catch (error) {
      console.error('IDVOptInCapturedFrameConfirmationScreen - Failed to confirm frame:', error);
      setError('Failed to confirm captured frame');
      Alert.alert('Error', 'Failed to confirm captured frame. Please try again.');
      setIsProcessing(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      <View style={styles.wrap}>
        <View style={styles.contentContainer}>
          
          {/* Close Button */}
          <View style={styles.titleWrap}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content Area */}
          <View style={styles.mainContent}>
            
            {/* App Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>📷</Text>
              </View>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.modalTitle}>
                Confirm Captured Frame
              </Text>
            </View>
            
            {/* Divider */}
            <View style={styles.border} />

            {/* Captured Frame Preview */}
            {capturedData && (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: `data:image/jpeg;base64,${capturedData}` }}
                  style={styles.capturedImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.error('IDVOptInCapturedFrameConfirmationScreen - Image load error:', error);
                    setError('Failed to load captured image');
                  }}
                  onLoad={() => {
                    console.log('IDVOptInCapturedFrameConfirmationScreen - Image loaded successfully');
                  }}
                />
              </View>
            )}

            {/* Placeholder when no image is available */}
            {!capturedData && (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>
                  Waiting for captured frame...
                </Text>
              </View>
            )}

            {/* Instructions Text */}
            <Text style={styles.instructionText}>
              Please review the captured biometric frame. If the image quality is good and clearly shows your face, 
              tap "Confirm" to proceed. Otherwise, tap "Retake" to capture a new frame.
            </Text>

            {/* Frame Quality Info */}
            {/* {capturedData && (
              <View style={styles.qualityContainer}>
                <Text style={styles.qualityLabel}>Frame Quality: </Text>
                <Text style={[
                  styles.qualityValue,
                  { color: capturedData > 70 ? '#4CAF50' : '#FF9800' }
                ]}>
                  {capturedData}%
                </Text>
              </View>
            )} */}

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
              <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <TouchableOpacity
                style={[styles.actionButton, styles.retakeButton]}
                onPress={() => handleConfirmFrame(1)}
              >
                <Text style={styles.actionButtonText}>
                  {'Retake'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleConfirmFrame(2)}
                
              >
                <Text style={styles.actionButtonText}>
                  {'Cancel'}
                </Text>
              </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={() => handleConfirmFrame(0)}
              
              >
                <Text style={styles.actionButtonText}>
                  {'Confirm'}
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
  // Main container
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
  
  // Title/Close area
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

  // Main content
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

  // Logo container
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

  // Title container
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

  // Border divider
  border: {
    height: 1,
    marginTop: 15,
    marginHorizontal: 12,
    backgroundColor: '#cccccc',
    width: SCREEN_WIDTH - 50,
  },

  // Image container
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  capturedImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },

  // Placeholder container
  placeholderContainer: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#999999',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Instructions text
  instructionText: {
    color: '#333333',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 25,
    marginTop: 15,
    lineHeight: 20,
  },

  // Quality container
  qualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  qualityLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  qualityValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Bottom buttons
  bottomButtons: {
    marginTop: 20,
    height: 60,
    width: '90%',
  },
  actionButton: {
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  confirmButton: {
    backgroundColor: '#4CAF50', // Green for confirm/positive action
    marginTop:20,
    marginHorizontal:0
  },
  retakeButton: {
    backgroundColor: '#FF9800', // Orange for retake/retry action  
    width:'45%'
  },
  cancelButton: {
    backgroundColor: '#F44336', // Red for cancel/negative action
    width:'45%'
  },
  actionButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default IDVOptInCapturedFrameConfirmationScreen;
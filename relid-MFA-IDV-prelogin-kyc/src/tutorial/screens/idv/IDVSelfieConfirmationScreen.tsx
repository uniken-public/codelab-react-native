/**
 * IDV Selfie Confirmation Screen
 * 
 * This screen displays the biometric match result between document image and captured selfie.
 * Based on ReactReferenceApp/App/Components/AuthScreens/BiometricConfirmationScreen.js
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
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import RdnaService from '../../../uniken/services/rdnaService';
import type { RDNAGetIDVSelfieConfirmationData } from '../../../uniken/types/rdnaEvents';
import type { RootStackParamList } from '../../navigation/AppNavigator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type IDVSelfieConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'IDVSelfieConfirmationScreen'>;

const IDVSelfieConfirmationScreen: React.FC = () => {
  const route = useRoute<IDVSelfieConfirmationScreenRouteProp>();
  
  // Extract parameters passed from SDKEventProvider (following reference pattern)
  const {
    title = 'Confirm Biometric Details',
    userDetails,
  } = route.params || {};

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selfieConfirmData, setSelfieConfirmData] = useState<RDNAGetIDVSelfieConfirmationData | null>(userDetails || null);

  useEffect(() => {
    if (userDetails) {
      console.log('IDVSelfieConfirmationScreen - Received selfie confirmation data:', userDetails);
      setSelfieConfirmData(userDetails);
      
      // Call getIDVConfig API as per reference pattern
      const getConfig = async () => {
        try {
          const configResponse = await RdnaService.getIDVConfig();
          console.log('IDVSelfieConfirmationScreen - getIDVConfig response:', configResponse);
        } catch (error) {
          console.error('IDVSelfieConfirmationScreen - Failed to get IDV config:', error);
        }
      };
      getConfig();
    }
  }, [userDetails]);

  const handleClose = () => {
    Alert.alert(
      'Cancel Verification',
      'Identity verification cancelled by user',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to dashboard or previous screen
            console.log('IDVSelfieConfirmationScreen - Verification cancelled by user');
          }
        }
      ]
    );
  };

  const handleConfirmAction = async (action: string) => {
    try {
      setIsProcessing(true);
      setError('');
      console.log('IDVSelfieConfirmationScreen - Processing selfie confirmation:', action);
      
      const challengeMode = selfieConfirmData?.challengeMode || 0;
      
      // Call the setIDVSelfieConfirmation API following reference pattern
      const response = await RdnaService.setIDVSelfieConfirmation(action, challengeMode);
      
      console.log('IDVSelfieConfirmationScreen - API response:', response);
      
      // Navigate back (following reference pattern - goes back after API call)
      // The reference navigates to IDV_SCREEN after successful API call
      console.log('IDVSelfieConfirmationScreen - Selfie confirmation processed successfully');
      
    } catch (error) {
      console.error('IDVSelfieConfirmationScreen - Failed to process selfie confirmation:', error);
      setError('Failed to process selfie confirmation');
      Alert.alert('Error', 'Failed to process selfie confirmation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonText = (title: string): string => {
    switch (title) {
      case 'Continue':
        return 'Continue';
      case 'Continue Anyway':
        return 'Proceed Anyway';
      case 'Rescan Document':
        return 'Rescan Document';
      case 'Recapture Selfie':
        return 'Recapture Selfie';
      default:
        return title;
    }
  };

  const renderBiometricResult = () => {
    const responseJson = selfieConfirmData?.response_data?.response_data;
    if (!responseJson?.biometric_result) return null;
    
    const isMatched = responseJson.biometric_result.display_text === 'MATCHED';
    const score = responseJson.face_matcher_response?.score;
    
    return (
      <View style={styles.resultContainer}>
        <View style={styles.matchStatusContainer}>
          <Text style={[styles.matchStatusIcon, { color: isMatched ? '#02b437' : '#DC143C' }]}>
            {isMatched ? '✓' : '✗'}
          </Text>
          <Text style={[styles.matchStatusText, { color: isMatched ? '#02b437' : '#DC143C' }]}>
            {isMatched ? 'Selfie matches with document image' : 'Selfie does not match with document image'}
          </Text>
        </View>
        {score !== undefined && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Match Score: {(score * 100).toFixed(2)}%</Text>
            <Text style={styles.criteriaLabel}>Criteria: {responseJson.biometric_result.result_criteria}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderActionButtons = () => {
    const responseJson = selfieConfirmData?.response_data;
    if (!responseJson?.action_buttons) {
      // Default buttons if no action buttons provided
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleConfirmAction('reinit-idv-selfie')}
            disabled={isProcessing}
          >
            <Text style={styles.rejectButtonText}>Recapture Selfie</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleConfirmAction('continue-flow')}
            disabled={isProcessing}
          >
            <Text style={styles.confirmButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    const { action_buttons } = responseJson;
    const isMatched = responseJson.response_data?.biometric_result?.display_text === 'MATCHED';
    const buttons = isMatched ? action_buttons.success_button : action_buttons.failure_button;
    
    // Handle three button layout: two in row, one full width below
    if (buttons && buttons.length === 3) {
      return (
        <View style={styles.buttonContainer}>
          {/* First row with two buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.halfWidthButton, 
                buttons[0].button_text === 'Continue' || buttons[0].button_text === 'Continue Anyway' 
                  ? styles.confirmButton 
                  : styles.rejectButton
              ]}
              onPress={() => handleConfirmAction(buttons[0].key)}
              disabled={isProcessing}
            >
              <Text style={[
                buttons[0].button_text === 'Continue' || buttons[0].button_text === 'Continue Anyway' 
                  ? styles.confirmButtonText 
                  : styles.rejectButtonText
              ]}>
                {isProcessing ? 'Processing...' : getButtonText(buttons[0].button_text)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.halfWidthButton, 
                styles.confirmButton
              ]}
              onPress={() => handleConfirmAction(buttons[1].key)}
              disabled={isProcessing}
            >
              <Text style={[
                buttons[1].button_text === 'Continue' || buttons[1].button_text === 'Continue Anyway' 
                  ? styles.confirmButtonText 
                  : styles.rejectButtonText
              ]}>
                {isProcessing ? 'Processing...' : getButtonText(buttons[1].button_text)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Second row with full width button */}
          <TouchableOpacity
            style={[
              styles.fullWidthButton, 
              styles.confirmButton
            ]}
            onPress={() => handleConfirmAction(buttons[2].key)}
            disabled={isProcessing}
          >
            <Text style={[
              buttons[2].button_text === 'Continue' || buttons[2].button_text === 'Continue Anyway' 
                ? styles.confirmButtonText 
                : styles.rejectButtonText
            ]}>
              {isProcessing ? 'Processing...' : getButtonText(buttons[2].button_text)}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Default layout for other button counts
    return (
      <View style={styles.buttonContainer}>
        {buttons?.map((button: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionButton, 
              button.button_text === 'Continue' || button.button_text === 'Continue Anyway' 
                ? styles.confirmButton 
                : styles.rejectButton
            ]}
            onPress={() => handleConfirmAction(button.key)}
            disabled={isProcessing}
          >
            <Text style={[
              button.button_text === 'Continue' || button.button_text === 'Continue Anyway' 
                ? styles.confirmButtonText 
                : styles.rejectButtonText
            ]}>
              {isProcessing ? 'Processing...' : getButtonText(button.button_text)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const userName = selfieConfirmData?.response_data?.response_data?.document_detail?.document_info?.name || 
                   selfieConfirmData?.userID || 'User';
  
  // Extract version for API version handling (following reference pattern)
  const version = selfieConfirmData?.response_data?.version || '3.0';
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity Verification in Progress</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={true}>
        <View style={styles.mainContent}>
          
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.resultsTitle}>Biometric Match Result</Text>
          </View>
          
          {/* User Name Header */}
          <View style={styles.userNameSection}>
            <View style={styles.userNameContainer}>
              <Text style={styles.userNameText}>{userName}</Text>
            </View>
          </View>

          {/* Image Comparison Section - Following reference lines 172 and 181 */}
          <View style={styles.imageComparisonSection}>
            <View style={styles.imageContainer}>
              <Text style={styles.imageLabel}>Document Image</Text>
              {selfieConfirmData?.response_data?.response_data?.document_detail?.document_info?.portrait_image ? (
                <Image
                  style={styles.comparisonImage}
                  source={{ 
                    uri: `data:image/jpg;base64,${selfieConfirmData.response_data.response_data.document_detail.document_info.portrait_image}` 
                  }}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>Document Image</Text>
                </View>
              )}
            </View>

            <View style={styles.imageContainer}>
              <Text style={styles.imageLabel}>Selfie Image</Text>
              {selfieConfirmData?.response_data?.response_data?.analyze_liveness_response?.video?.autocapture_result?.selfie_image ? (
                <Image
                  style={styles.comparisonImage}
                  source={{ 
                    uri: `data:image/jpg;base64,${selfieConfirmData.response_data.response_data.analyze_liveness_response.video.autocapture_result.selfie_image}` 
                  }}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>Selfie Image</Text>
                </View>
              )}
            </View>
          </View>

          {/* Match Result Display */}
          {renderBiometricResult()}

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Additional Biometric Information */}
          {selfieConfirmData?.response_data?.response_data && (
            <View style={styles.biometricInfoSection}>
              <Text style={styles.infoTitle}>Biometric Analysis</Text>
              {selfieConfirmData.response_data.response_data.face_matcher_response?.score && (
                <Text style={styles.infoText}>
                  Face Match Score: {(selfieConfirmData.response_data.response_data.face_matcher_response.score * 100).toFixed(2)}%
                </Text>
              )}
              {selfieConfirmData.response_data.response_data.analyze_liveness_response?.liveness_result?.score && (
                <Text style={styles.infoText}>
                  Liveness Score: {selfieConfirmData.response_data.response_data.analyze_liveness_response.liveness_result.score}%
                </Text>
              )}
              {selfieConfirmData.response_data.response_data.biometric_result?.result_criteria && (
                <Text style={styles.infoText}>
                  Result Criteria: {selfieConfirmData.response_data.response_data.biometric_result.result_criteria}
                </Text>
              )}
            </View>
          )}

        </View>
      </ScrollView>

      {/* Action Buttons */}
      {renderActionButtons()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mainContent: {
    flex: 1,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: '#ffffff',
    marginTop: 8,
    backgroundColor: '#2196F3',
    width: '100%',
    lineHeight: 40,
    paddingVertical: 8,
  },
  userNameSection: {
    width: '100%',
  },
  userNameContainer: {
    flexDirection: 'row',
    width: '100%',
    marginHorizontal: 10,
  },
  userNameText: {
    fontSize: 17,
    fontWeight: 'bold',
    margin: 2,
    marginLeft: 5,
    color: '#ffffff',
    backgroundColor: '#2196F3',
    width: '100%',
    textAlign: 'center',
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  imageComparisonSection: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  imageLabel: {
    color: '#2196F3',
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  comparisonImage: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    width: SCREEN_WIDTH / 2.5,
    height: SCREEN_WIDTH / 2.5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  resultContainer: {
    padding: 10,
    width: '94%',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  matchStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  matchStatusIcon: {
    fontSize: 40,
    marginRight: 15,
    color: '#02b437',
  },
  matchStatusText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
  },
  matchPercentageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  matchPercentageLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  matchPercentageValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '40%',
    marginHorizontal: 8,
    marginBottom: 10,
  },
  halfWidthButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  fullWidthButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    margin: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  scoreContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 4,
  },
  criteriaLabel: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
    width: SCREEN_WIDTH / 2.5,
    height: SCREEN_WIDTH / 2.5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
  biometricInfoSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default IDVSelfieConfirmationScreen;
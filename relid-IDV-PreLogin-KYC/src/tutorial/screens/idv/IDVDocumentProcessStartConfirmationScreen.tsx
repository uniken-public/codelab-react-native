/**
 * IDV Document Process Start Confirmation Screen
 * 
 * This screen handles IDV document scan process start confirmation events
 * and provides UI for initiating document scanning. It follows the reference
 * PrepareDocumentScan.js pattern while maintaining current project theme.
 * Receives navigation parameters from SDKEventProvider like VerifyAuthScreen.
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
  TouchableOpacity
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import RdnaService from '../../../uniken/services/rdnaService';
import type { RDNAGetIDVDocumentScanProcessStartConfirmationData } from '../../../uniken/types/rdnaEvents';
import type { RootStackParamList } from '../../navigation/AppNavigator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type IDVDocumentProcessStartConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'IDVDocumentProcessStartConfirmationScreen'>;

const IDVDocumentProcessStartConfirmationScreen: React.FC = () => {
  const route = useRoute<IDVDocumentProcessStartConfirmationScreenRouteProp>();
  
  // Extract parameters passed from SDKEventProvider (following VerifyAuthScreen pattern)
  const {
    eventName,
    eventData,
    title = 'Document Scan Information',
    subtitle = 'Prepare to scan your identity document',
    responseData,
  } = route.params || {};

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [scanData, setScanData] = useState<RDNAGetIDVDocumentScanProcessStartConfirmationData | null>(responseData || null);

  useEffect(() => {
    // If we received event data from navigation, set it immediately
    if (responseData) {
      console.log('IDVDocumentProcessStartConfirmationScreen - Received event data from navigation:', responseData);
      setScanData(responseData);
    }
  }, [responseData]);

  // Get guideline text based on IDV workflow (following reference pattern)
  const getGuidelineText = (): string => {
    const idvWorkflow = scanData?.idvWorkflow || 0;
    
    switch (idvWorkflow) {
      case 0:
        return 'Ensure you have good lighting and hold your document steady for IDV activation process.';
      case 2:
        return 'Additional device activation requires clear document scan. Position document within frame.';
      case 4:
        return 'Account recovery process - scan your identity document clearly for verification.';
      case 5:
        return 'Post-login document scan - ensure all text is visible and document is flat.';
      case 6:
        return 'KYC process document scan - hold document steady and avoid glare for best results.';
      case 13:
        return 'Agent KYC process - scan customer document clearly with proper lighting.';
      default:
        return 'Ensure you have good lighting and hold your document steady for IDV activation process.';
    }
  };

  // Handle scan button action (following reference scanButtonAction pattern)
  const handleScanButtonAction = async () => {
    try {
      setIsProcessing(true);
      setError('');
      console.log('IDVDocumentProcessStartConfirmationScreen - Starting IDV document scan process...');
      
      // Use the idvWorkflow from the event data, following reference pattern
      const idvWorkflow = scanData?.idvWorkflow || 0;
      
      // Call the API to confirm starting the document scan process
      // Following reference: setIDVDocumentScanProcessStartConfirmation(true, idvWorkflow)
      const response = await RdnaService.setIDVDocumentScanProcessStartConfirmation(true, idvWorkflow);
      
      console.log('IDVDocumentProcessStartConfirmationScreen - API response:', response);
    
      
    } catch (error) {
      console.error('IDVDocumentProcessStartConfirmationScreen - Failed to start document scan:', error);
      setError('Failed to start document scan process');
      Alert.alert('Error', 'Failed to start document scan process');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle close/cancel action (following reference close pattern)  
  const handleClose = async () => {
    try {
      setIsProcessing(true);
      setError('');
      console.log('IDVDocumentProcessStartConfirmationScreen - Cancelling IDV document scan process...');
      
      // Use the idvWorkflow from the event data, following reference pattern
      const idvWorkflow = scanData?.idvWorkflow || 0;
      
      // Call the API to cancel the document scan process
      // Following reference: setIDVDocumentScanProcessStartConfirmation(false, idvWorkflow)
      const response = await RdnaService.setIDVDocumentScanProcessStartConfirmation(false, idvWorkflow);
      
      console.log('IDVDocumentProcessStartConfirmationScreen - Cancel response:', response);
      
    } catch (error) {
      console.error('IDVDocumentProcessStartConfirmationScreen - Failed to cancel document scan:', error);
      setError('Failed to cancel document scan process');
      Alert.alert('Error', 'Failed to cancel document scan process');
    } finally {
      setIsProcessing(false);
    }
  };

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
            
            {/* Loading Animation and Icon (following reference pattern) */}
            <View style={styles.iconContainer}>
              <ActivityIndicator 
                color="#2196F3" 
                style={styles.loadingSpinner} 
                size="large" 
              />
              <View style={styles.documentIcon}>
                <Text style={styles.documentIconText}>📋</Text>
                <Text style={styles.scanText}>SCAN</Text>
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
            {getGuidelineText().length > 0 && (
              <View style={styles.row}>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.textBody}>
                  {getGuidelineText()}
                </Text>
              </View>
            )}

            <View style={styles.row}>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.textBody}>
                Position your document within the frame and ensure all corners are visible.
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.textBody}>
                Avoid shadows, glare, and blurred images for best scan results.
              </Text>
            </View>


            {/* Scan Button (following reference pattern) */}
            <TouchableOpacity
              style={[styles.scanButton, isProcessing && styles.buttonDisabled]}
              onPress={handleScanButtonAction}
              disabled={isProcessing}
            >
              <Text style={styles.scanButtonText}>
                {'Scan Document'}
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
  documentIcon: {
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 85,
    borderWidth: 3,
    borderColor: '#2196F3',
  },
  documentIconText: {
    fontSize: 50,
  },
  scanText: {
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


  // Scan button (following reference Button pattern)
  scanButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  scanButtonText: {
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

export default IDVDocumentProcessStartConfirmationScreen;
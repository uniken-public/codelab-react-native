/**
 * Activation Code Screen
 * 
 * This screen is specifically designed for setting the activation code (setActivationCode API).
 * It provides a focused interface for activation code input and validation.
 * 
 * Key Features:
 * - Activation code input with validation
 * - Real-time error handling
 * - Loading states during API call
 * - Success/error feedback
 * - Clear and retry functionality
 * - Attempts left display
 * 
 * Usage:
 * Navigation.navigate('ActivationCodeScreen', {
 *   eventData: data,
 *   inputType: 'text',
 *   title: 'Enter Activation Code',
 *   subtitle: 'Enter the activation code to continue',
 *   placeholder: 'Enter activation code',
 *   buttonText: 'Verify Code',
 *   attemptsLeft: 3
 * });
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RDNAEventUtils, RDNASyncUtils } from '../../../uniken/types/rdnaEvents';
import type { RDNASyncResponse } from '../../../uniken/types/rdnaEvents';
import rdnaService from '../../../uniken/services/rdnaService';
import { CloseButton, Button, Input, StatusBanner } from '../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type ActivationCodeScreenRouteProp = RouteProp<RootStackParamList, 'ActivationCodeScreen'>;

/**
 * Activation Code Screen Component
 */
const ActivationCodeScreen: React.FC = () => {
  const route = useRoute<ActivationCodeScreenRouteProp>();
  
  const {
    eventData,
    title,
    subtitle,
    placeholder,
    buttonText,
    attemptsLeft = 0,
    responseData,
  } = route.params;

  const [activationCode, setActivationCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  /**
   * Handle close button - direct resetAuthState call
   */
  const handleClose = async () => {
    try {
      console.log('ActivationCodeScreen - Calling resetAuthState');
      await rdnaService.resetAuthState();
      console.log('ActivationCodeScreen - ResetAuthState successful');
    } catch (error) {
      console.error('ActivationCodeScreen - ResetAuthState error:', error);
    }
  };

  /**
   * Handle response data from route params - much simpler approach
   */
  useEffect(() => {
    if (responseData) {
      console.log('ActivationCodeScreen - Processing response data from route params:', responseData);
      
      // Check for API errors first
      if (RDNAEventUtils.hasApiError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('ActivationCodeScreen - API error:', errorMessage);
        setError(errorMessage);
        setValidationResult({
          success: false,
          message: errorMessage
        });
        return;
      }
      
      // Check for status errors
      if (RDNAEventUtils.hasStatusError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('ActivationCodeScreen - Status error:', errorMessage);
        setError(errorMessage);
        setValidationResult({
          success: false,
          message: errorMessage
        });
        return;
      }
      
      // Success - continue with flow
      setValidationResult({
        success: true,
        message: 'Ready to enter activation code'
      });
      console.log('ActivationCodeScreen - Successfully processed response data');
    }
  }, [responseData]);

  /**
   * Handle Activation Code Input Change
   */
  const handleActivationCodeChange = (text: string) => {
    setActivationCode(text);
    if (error) {
      setError('');
    }
    if (validationResult) {
      setValidationResult(null);
    }
  };


  /**
   * Handle Activation Code Validation
   */
  const handleValidateActivationCode = async () => {
    const trimmedActivationCode = activationCode.trim();

    setIsValidating(true);
    setError('');
    setValidationResult(null);

    try {
      console.log('ActivationCodeScreen - Setting activation code:', trimmedActivationCode);
      
      const syncResponse: RDNASyncResponse = await rdnaService.setActivationCode(trimmedActivationCode);
      console.log('ActivationCodeScreen - SetActivationCode sync response successful, waiting for async events');
      console.log('ActivationCodeScreen - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });
      
      // Success indication - async events will be handled by event listeners
      setValidationResult({
        success: true,
        message: 'Activation code set successfully! Waiting for next step...'
      });
      
    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('ActivationCodeScreen - SetActivationCode sync error:', error);
      
      // Cast the error back to RDNASyncResponse as per TutorialHomeScreen pattern
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      setError(errorMessage);
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Handle resend activation code
   */
  const handleResendActivationCode = async () => {
    if (isResending || isValidating) return;

    setIsResending(true);
    setError('');
    setValidationResult(null);

    try {
      console.log('ActivationCodeScreen - Requesting resend of activation code');
      
      await rdnaService.resendActivationCode();
      console.log('ActivationCodeScreen - ResendActivationCode sync response successful, waiting for new getActivationCode event');
      
      // Show success message
      setValidationResult({
        success: true,
        message: 'New activation code sent! Please check your email or SMS.'
      });
      
      // Clear the current activation code input
      setActivationCode('');
      
    } catch (error) {
      console.error('ActivationCodeScreen - ResendActivationCode sync error:', error);
      
      // Cast the error back to RDNASyncResponse as per TutorialHomeScreen pattern
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  /**
   * Check if form is valid
   */
  const isFormValid = (): boolean => {
    return activationCode.trim().length > 0 && !error;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Close Button */}
        <CloseButton 
          onPress={handleClose}
          disabled={isValidating || isResending}
        />
        
        <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        
        {/* Attempts Left Display */}
        {attemptsLeft > 0 && (
          <StatusBanner
            type="warning"
            message={`Attempts remaining: ${attemptsLeft}`}
          />
        )}
        
        {/* Validation Result */}
        {validationResult && (
          <StatusBanner
            type={validationResult.success ? 'success' : 'error'}
            message={validationResult.message}
          />
        )}

        {/* Activation Code Input */}
        <Input
          label="Activation Code"
          value={activationCode}
          onChangeText={handleActivationCodeChange}
          placeholder={placeholder}
          returnKeyType="done"
          onSubmitEditing={handleValidateActivationCode}
          editable={!isValidating}
          keyboardType="default"
          error={error}
        />

        {/* Validate Button */}
        <Button
          title={isValidating ? 'Setting Activation Code...' : buttonText}
          onPress={handleValidateActivationCode}
          loading={isValidating}
          disabled={!isFormValid() || isResending}
        />

        {/* Resend Button */}
        <Button
          title={isResending ? 'Sending...' : 'Resend Activation Code'}
          onPress={handleResendActivationCode}
          loading={isResending}
          disabled={isValidating}
          variant="secondary"
        />

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Enter the activation code you received to verify your identity. If you haven't received it, click "Resend Activation Code" to get a new one.
          </Text>
        </View>

      </View>
      </KeyboardAvoidingView>
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
    paddingTop: 60, // Add space for close button
    justifyContent: 'center',
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
    marginBottom: 20,
  },
  attemptsContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  attemptsText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
    textAlign: 'center',
  },
  resultContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
  },
  successContainer: {
    backgroundColor: '#f0f8f0',
    borderLeftColor: '#27ae60',
  },
  errorContainer: {
    backgroundColor: '#fff0f0',
    borderLeftColor: '#e74c3c',
  },
  resultText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  successText: {
    color: '#27ae60',
  },
  errorText: {
    color: '#e74c3c',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#2c3e50',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  validateButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  validateButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  validateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resendButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  resendButtonDisabled: {
    borderColor: '#bdc3c7',
  },
  resendButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ActivationCodeScreen;
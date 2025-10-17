/**
 * Check User Screen
 * 
 * This screen is specifically designed for setting the user (setUser API).
 * It provides a focused interface for username input and setting.
 * 
 * Key Features:
 * - Username input with validation
 * - Real-time error handling
 * - Loading states during API call
 * - Success/error feedback
 * - Clear and retry functionality
 * 
 * Usage:
 * Navigation.navigate('CheckUserScreen', {
 *   eventData: data,
 *   inputType: 'text',
 *   title: 'Set User',
 *   subtitle: 'Enter your username to continue',
 *   placeholder: 'Enter username',
 *   buttonText: 'Set User'
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
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RDNAEventUtils, RDNASyncUtils } from '../../../uniken/types/rdnaEvents';
import type { RDNASyncResponse } from '../../../uniken/types/rdnaEvents';
import rdnaService from '../../../uniken/services/rdnaService';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { Button, Input, StatusBanner } from '../components';

type CheckUserScreenRouteProp = RouteProp<RootStackParamList, 'CheckUserScreen'>;

/**
 * Check User Screen Component
 */
const CheckUserScreen: React.FC = () => {
  const route = useRoute<CheckUserScreenRouteProp>();
  
  const {
    eventData,
    title,
    subtitle,
    placeholder,
    buttonText,
    responseData,
  } = route.params;

  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);


  /**
   * Handle response data from route params - much simpler approach
   */
  useEffect(() => {
    if (responseData) {
      console.log('CheckUserScreen - Processing response data from route params:', responseData);
      
      // Check for API errors first
      if (RDNAEventUtils.hasApiError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('CheckUserScreen - API error:', errorMessage);
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
        console.log('CheckUserScreen - Status error:', errorMessage);
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
        message: 'Ready to enter username'
      });
      console.log('CheckUserScreen - Successfully processed response data');
    }
  }, [responseData]);

  /**
   * Handle Username Input Change
   */
  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (error) {
      setError('');
    }
    if (validationResult) {
      setValidationResult(null);
    }
  };


  /**
   * Handle User Validation
   */
  const handleValidateUser = async () => {
    const trimmedUsername = username.trim();
  
    setIsValidating(true);
    setError('');
    setValidationResult(null);

    try {
      console.log('CheckUserScreen - Setting user:', trimmedUsername);
      
      const syncResponse: RDNASyncResponse = await rdnaService.setUser(trimmedUsername);
      console.log('CheckUserScreen - SetUser sync response successful, waiting for async events');
      console.log('CheckUserScreen - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });
      
      // Success indication - async events will be handled by event listeners
      setValidationResult({
        success: true,
        message: 'User set successfully! Waiting for next step...'
      });
      
    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('CheckUserScreen - SetUser sync error:', error);
      
      // Cast the error back to RDNASyncResponse as per TutorialHomeScreen pattern
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      setError(errorMessage);
    } finally {
      setIsValidating(false);
    }
  };


  /**
   * Check if form is valid
   */
  const isFormValid = (): boolean => {
    return username.trim().length >0 && !error;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        
        {/* Validation Result */}
        {validationResult && (
          <StatusBanner
            type={validationResult.success ? 'success' : 'error'}
            message={validationResult.message}
          />
        )}

        {/* Username Input */}
        <Input
          label="Username"
          value={username}
          onChangeText={handleUsernameChange}
          placeholder={placeholder}
          returnKeyType="done"
          onSubmitEditing={handleValidateUser}
          editable={!isValidating}
          keyboardType="default"
          error={error}
        />

        {/* Validate Button */}
        <Button
          title={isValidating ? 'Setting User...' : buttonText}
          onPress={handleValidateUser}
          loading={isValidating}
          disabled={!isFormValid()}
        />


        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Enter your username to set the user for the SDK session.
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
    marginBottom: 30,
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

export default CheckUserScreen;
/**
 * Verify Password Screen
 * 
 * This screen is specifically designed for verifying user passwords during login flows.
 * It handles the challengeMode = 0 scenario where users need to enter their existing password.
 * 
 * Key Features:
 * - Single password input field (no confirmation needed)
 * - Real-time error handling and loading states
 * - Challenge mode 0 handling for password verification
 * - No password policy validation required
 * 
 * Usage:
 * Navigation.navigate('VerifyPasswordScreen', {
 *   eventData: data,
 *   title: 'Verify Password',
 *   subtitle: 'Enter your password to continue',
 *   responseData: data
 * });
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RDNAEventUtils, RDNASyncUtils } from '../../../uniken/types/rdnaEvents';
import type { RDNAGetPasswordData, RDNASyncResponse } from '../../../uniken/types/rdnaEvents';
import rdnaService from '../../../uniken/services/rdnaService';
import { CloseButton, Button, Input, StatusBanner } from '../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type VerifyPasswordScreenRouteProp = RouteProp<RootStackParamList, 'VerifyPasswordScreen'>;

/**
 * Verify Password Screen Component
 */
const VerifyPasswordScreen: React.FC = () => {
  const route = useRoute<VerifyPasswordScreenRouteProp>();
  
  const {
    eventData,
    title,
    subtitle,
    userID,
    challengeMode = 0,
    attemptsLeft = 0,
    responseData,
  } = route.params;

  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const passwordRef = useRef<TextInput>(null);

  /**
   * Handle close button - direct resetAuthState call
   */
  const handleClose = async () => {
    try {
      console.log('VerifyPasswordScreen - Calling resetAuthState');
      await rdnaService.resetAuthState();
      console.log('VerifyPasswordScreen - ResetAuthState successful');
    } catch (error) {
      console.error('VerifyPasswordScreen - ResetAuthState error:', error);
    }
  };

  /**
   * Process response data for error handling (similar to ActivationCodeScreen)
   */
  useEffect(() => {
    if (responseData) {
      console.log('VerifyPasswordScreen - Processing response data for errors:', responseData);
      
      // Check for API errors first
      if (RDNAEventUtils.hasApiError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('VerifyPasswordScreen - API error:', errorMessage);
        setError(errorMessage);
        return;
      }
      
      // Check for status errors
      if (RDNAEventUtils.hasStatusError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('VerifyPasswordScreen - Status error:', errorMessage);
        setError(errorMessage);
        return;
      }
      
      // Success - clear any previous errors
      setError('');
      console.log('VerifyPasswordScreen - Successfully processed response data');
    }
  }, [responseData]);

  /**
   * Handle password input change
   */
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) {
      setError('');
    }
  };

  /**
   * Reset form input
   */
  const resetInput = () => {
    setPassword('');
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  };

  /**
   * Handle password verification
   */
  const handleVerifyPassword = async () => {
    if (isSubmitting) return;

    const trimmedPassword = password.trim();

    // Basic validation
    if (!trimmedPassword) {
      setError('Please enter your password');
      if (passwordRef.current) {
        passwordRef.current.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log('VerifyPasswordScreen - Verifying password with challengeMode:', challengeMode);
      
      const syncResponse: RDNASyncResponse = await rdnaService.setPassword(trimmedPassword, challengeMode);
      console.log('VerifyPasswordScreen - SetPassword sync response successful, waiting for async events');
      console.log('VerifyPasswordScreen - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });
      
    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('VerifyPasswordScreen - SetPassword sync error:', error);
      
      // Cast the error back to RDNASyncResponse as per TutorialHomeScreen pattern
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      setError(errorMessage);
      resetInput();
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Check if form is valid
   */
  const isFormValid = (): boolean => {
    return password.trim().length > 0 && !error;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView style={styles.container}>
        {/* Close Button */}
        <CloseButton 
          onPress={handleClose}
          disabled={isSubmitting}
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          
          {/* User Information */}
          {userID && (
            <View style={styles.userContainer}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userNameText}>{userID}</Text>
            </View>
          )}
          
          {/* Attempts Left Information */}
          {attemptsLeft > 0 && (
            <StatusBanner
              type="warning"
              message={`${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining`}
            />
          )}
          
          {/* Error Display */}
          {error && (
            <StatusBanner
              type="error"
              message={error}
            />
          )}

          {/* Password Input */}
          <Input
            label="Password"
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Enter your password"
            secureTextEntry={true}
            returnKeyType="done"
            onSubmitEditing={handleVerifyPassword}
            editable={!isSubmitting}
            autoFocus={true}
            error={error}
          />

          {/* Submit Button */}
          <Button
            title={isSubmitting ? 'Verifying...' : 'Verify Password'}
            onPress={handleVerifyPassword}
            loading={isSubmitting}
            disabled={!isFormValid()}
          />

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Enter your password to verify your identity and continue.
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
  userContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 20,
  },
  attemptsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  attemptsText: {
    fontSize: 14,
    color: '#e67e22',
    fontWeight: '500',
    backgroundColor: '#fef5e7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f39c12',
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
  inputContainer: {
    marginBottom: 20,
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
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  submitButtonText: {
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
    backgroundColor: '#e8f4f8',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  helpText: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default VerifyPasswordScreen;
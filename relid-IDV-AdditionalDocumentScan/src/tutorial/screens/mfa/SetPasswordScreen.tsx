/**
 * Set Password Screen
 * 
 * This screen is specifically designed for setting user passwords during authentication flows.
 * It provides a comprehensive interface for password input, confirmation, and policy validation.
 * 
 * Key Features:
 * - Password and confirm password inputs with validation
 * - Password policy parsing and validation
 * - Real-time error handling and loading states
 * - Success/error feedback
 * - Password policy display with modal support
 * - Challenge mode and attempts handling
 * 
 * Usage:
 * Navigation.navigate('SetPasswordScreen', {
 *   eventData: data,
 *   title: 'Set Password',
 *   subtitle: 'Create a secure password for your account',
 *   responseData: data
 * });
 */

import React, { useState, useEffect, useRef } from 'react';
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
import { parseAndGeneratePolicyMessage } from '../../../uniken/utils';
import type { RDNAGetPasswordData, RDNASyncResponse } from '../../../uniken/types/rdnaEvents';
import rdnaService from '../../../uniken/services/rdnaService';
import { CloseButton, Button, Input, StatusBanner } from '../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type SetPasswordScreenRouteProp = RouteProp<RootStackParamList, 'SetPasswordScreen'>;


/**
 * Set Password Screen Component
 */
const SetPasswordScreen: React.FC = () => {
  const route = useRoute<SetPasswordScreenRouteProp>();
  
  const {
    eventData,
    title,
    subtitle,
    responseData,
  } = route.params;

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [challengeMode, setChallengeMode] = useState<number>(1);
  const [userName, setUserName] = useState<string>('');
  const [passwordPolicyMessage, setPasswordPolicyMessage] = useState<string>('');

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  /**
   * Handle close button - direct resetAuthState call
   */
  const handleClose = async () => {
    try {
      console.log('SetPasswordScreen - Calling resetAuthState');
      await rdnaService.resetAuthState();
      console.log('SetPasswordScreen - ResetAuthState successful');
    } catch (error) {
      console.error('SetPasswordScreen - ResetAuthState error:', error);
    }
  };


  /**
   * Handle response data from route params
   */
  useEffect(() => {
    if (responseData) {
      console.log('SetPasswordScreen - Processing response data from route params:', responseData);
      
      // Extract challenge data
      setUserName(responseData.userID || '');
      setChallengeMode(responseData.challengeMode || 1);
      
      // Extract and process password policy
      const policyJsonString = RDNAEventUtils.getChallengeValue(responseData, 'RELID_PASSWORD_POLICY');
      if (policyJsonString) {
        const policyMessage = parseAndGeneratePolicyMessage(policyJsonString);
        setPasswordPolicyMessage(policyMessage);
        console.log('SetPasswordScreen - Password policy extracted:', policyMessage);
      }
      
      console.log('SetPasswordScreen - Processed password data:', {
        userID: responseData.userID,
        challengeMode: responseData.challengeMode,
        passwordPolicy: policyJsonString ? 'Found' : 'Not found',
      });
      
      // Check for API errors first
      if (RDNAEventUtils.hasApiError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('SetPasswordScreen - API error:', errorMessage);
        setError(errorMessage);
        return;
      }
      
      // Check for status errors
      if (RDNAEventUtils.hasStatusError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('SetPasswordScreen - Status error:', errorMessage);
        setError(errorMessage);
        return;
      }
     
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
   * Handle confirm password input change
   */
  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (error) {
      setError('');
    }
  };

  /**
   * Reset form inputs
   */
  const resetInputs = () => {
    setPassword('');
    setConfirmPassword('');
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  };

  /**
   * Handle password submission
   */
  const handleSetPassword = async () => {
    if (isSubmitting) return;

    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Basic validation
    if (!trimmedPassword) {
      setError('Please enter a password');
      if (passwordRef.current) {
        passwordRef.current.focus();
      }
      return;
    }

    if (!trimmedConfirmPassword) {
      setError('Please confirm your password');
      if (confirmPasswordRef.current) {
        confirmPasswordRef.current.focus();
      }
      return;
    }

    // Check password match
    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Password and confirm password do not match');
      Alert.alert(
        'Password Mismatch',
        'Password and confirm password do not match',
        [{ text: 'OK', onPress: resetInputs }]
      );
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log('SetPasswordScreen - Setting password');
      
      const syncResponse: RDNASyncResponse = await rdnaService.setPassword(trimmedPassword, challengeMode);
      console.log('SetPasswordScreen - SetPassword sync response successful, waiting for async events');
      console.log('SetPasswordScreen - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });
      
    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('SetPasswordScreen - SetPassword sync error:', error);
      
      // Cast the error back to RDNASyncResponse as per TutorialHomeScreen pattern
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      setError(errorMessage);
      resetInputs();
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Check if form is valid
   */
  const isFormValid = (): boolean => {
    return password.trim().length > 0 && confirmPassword.trim().length > 0 && !error;
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
        {userName && (
          <View style={styles.userContainer}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.userNameText}>{userName}</Text>
          </View>
        )}
        
        {/* Password Policy Display */}
        {passwordPolicyMessage && (
          <View style={styles.policyContainer}>
            <Text style={styles.policyTitle}>Password Requirements</Text>
            <Text style={styles.policyText}>{passwordPolicyMessage}</Text>
          </View>
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
          placeholder="Enter password"
          secureTextEntry={true}
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          editable={!isSubmitting}
          autoFocus={true}
          containerStyle={styles.inputContainer}
        />

        {/* Confirm Password Input */}
        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          placeholder="Confirm password"
          secureTextEntry={true}
          returnKeyType="done"
          onSubmitEditing={handleSetPassword}
          editable={!isSubmitting}
          containerStyle={styles.inputContainer}
        />

        {/* Submit Button */}
        <Button
          title={isSubmitting ? 'Setting Password...' : 'Submit'}
          onPress={handleSetPassword}
          loading={isSubmitting}
          disabled={!isFormValid()}
        />


        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Create a secure password. Your password will be used to authenticate your account.
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
  policyContainer: {
    backgroundColor: '#f0f8ff',
    borderLeftColor: '#3498db',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
});

export default SetPasswordScreen;
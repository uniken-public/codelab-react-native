/**
 * Update Expiry Password Screen (Password Expiry Flow)
 *
 * This screen is specifically designed for updating expired passwords during authentication flows.
 * It handles the challengeMode = 4 (RDNA_OP_UPDATE_ON_EXPIRY) scenario where users need to update
 * their expired password by providing both current and new passwords.
 *
 * Key Features:
 * - Current password, new password, and confirm password inputs with validation
 * - Password policy parsing and validation
 * - Real-time error handling and loading states
 * - Success/error feedback
 * - Password policy display
 * - Challenge mode 4 handling for password expiry
 *
 * Usage:
 * Navigation.navigate('UpdateExpiryPasswordScreen', {
 *   eventData: data,
 *   title: 'Update Expired Password',
 *   subtitle: 'Your password has expired. Please update it to continue.',
 *   responseData: data
 * });
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RDNAEventUtils, RDNASyncUtils } from '../../../uniken/types/rdnaEvents';
import { parseAndGeneratePolicyMessage } from '../../../uniken/utils';
import type { RDNAGetPasswordData, RDNASyncResponse } from '../../../uniken/types/rdnaEvents';
import rdnaService from '../../../uniken/services/rdnaService';
import { CloseButton, Button, Input, StatusBanner } from '../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type UpdateExpiryPasswordScreenRouteProp = RouteProp<RootStackParamList, 'UpdateExpiryPasswordScreen'>;

/**
 * Update Expiry Password Screen Component
 */
const UpdateExpiryPasswordScreen: React.FC = () => {
  const route = useRoute<UpdateExpiryPasswordScreenRouteProp>();

  const {
    eventData,
    title,
    subtitle,
    responseData,
  } = route.params;

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [challengeMode, setChallengeMode] = useState<number>(4);
  const [userName, setUserName] = useState<string>('');
  const [passwordPolicyMessage, setPasswordPolicyMessage] = useState<string>('');

  const currentPasswordRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  /**
   * Handle close button - direct resetAuthState call
   */
  const handleClose = async () => {
    try {
      console.log('UpdateExpiryPasswordScreen - Calling resetAuthState');
      await rdnaService.resetAuthState();
      console.log('UpdateExpiryPasswordScreen - ResetAuthState successful');
    } catch (error) {
      console.error('UpdateExpiryPasswordScreen - ResetAuthState error:', error);
    }
  };

  /**
   * Handle response data from route params
   */
  useEffect(() => {
    if (responseData) {
      console.log('UpdateExpiryPasswordScreen - Processing response data from route params:', responseData);

      // Extract challenge data
      setUserName(responseData.userID || '');
      setChallengeMode(responseData.challengeMode || 4);

      // Extract and process password policy
      const policyJsonString = RDNAEventUtils.getChallengeValue(responseData, 'RELID_PASSWORD_POLICY');
      if (policyJsonString) {
        const policyMessage = parseAndGeneratePolicyMessage(policyJsonString);
        setPasswordPolicyMessage(policyMessage);
        console.log('UpdateExpiryPasswordScreen - Password policy extracted:', policyMessage);
      }

      console.log('UpdateExpiryPasswordScreen - Processed password data:', {
        userID: responseData.userID,
        challengeMode: responseData.challengeMode,
        passwordPolicy: policyJsonString ? 'Found' : 'Not found',
      });

      // Check for API errors first
      if (RDNAEventUtils.hasApiError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('UpdateExpiryPasswordScreen - API error:', errorMessage);
        setError(errorMessage);
        // Clear password fields on error
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        return;
      }

      // Check for status errors (including password reuse errors like statusCode 164)
      if (RDNAEventUtils.hasStatusError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('UpdateExpiryPasswordScreen - Status error:', errorMessage);
        setError(errorMessage);
        // Clear password fields on error (e.g., password reuse)
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        return;
      }

    }
  }, [responseData]);

  /**
   * Handle input changes
   */
  const handleCurrentPasswordChange = (text: string) => {
    setCurrentPassword(text);
    if (error) {
      setError('');
    }
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    if (error) {
      setError('');
    }
  };

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
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    if (currentPasswordRef.current) {
      currentPasswordRef.current.focus();
    }
  };

  /**
   * Handle password update submission
   */
  const handleUpdatePassword = async () => {
    if (isSubmitting) return;

    const trimmedCurrentPassword = currentPassword.trim();
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Basic validation
    if (!trimmedCurrentPassword) {
      setError('Please enter your current password');
      if (currentPasswordRef.current) {
        currentPasswordRef.current.focus();
      }
      return;
    }

    if (!trimmedNewPassword) {
      setError('Please enter a new password');
      if (newPasswordRef.current) {
        newPasswordRef.current.focus();
      }
      return;
    }

    if (!trimmedConfirmPassword) {
      setError('Please confirm your new password');
      if (confirmPasswordRef.current) {
        confirmPasswordRef.current.focus();
      }
      return;
    }

    // Check password match
    if (trimmedNewPassword !== trimmedConfirmPassword) {
      setError('New password and confirm password do not match');
      Alert.alert(
        'Password Mismatch',
        'New password and confirm password do not match',
        [{ text: 'OK', onPress: () => {
          setNewPassword('');
          setConfirmPassword('');
          if (newPasswordRef.current) {
            newPasswordRef.current.focus();
          }
        }}]
      );
      return;
    }

    // Check if new password is same as current password
    if (trimmedCurrentPassword === trimmedNewPassword) {
      setError('New password must be different from current password');
      Alert.alert(
        'Invalid New Password',
        'Your new password must be different from your current password',
        [{ text: 'OK', onPress: () => {
          setNewPassword('');
          setConfirmPassword('');
          if (newPasswordRef.current) {
            newPasswordRef.current.focus();
          }
        }}]
      );
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log('UpdateExpiryPasswordScreen - Updating password with challengeMode:', challengeMode);

      const syncResponse: RDNASyncResponse = await rdnaService.updatePassword(
        trimmedCurrentPassword,
        trimmedNewPassword,
        challengeMode
      );

      console.log('UpdateExpiryPasswordScreen - UpdatePassword sync response successful, waiting for async events');
      console.log('UpdateExpiryPasswordScreen - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });

      // Success - wait for onUserLoggedIn event
      // Event handlers in SDKEventProvider will handle the navigation

    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('UpdateExpiryPasswordScreen - UpdatePassword sync error:', error);

      // Cast the error back to RDNASyncResponse
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
    return (
      currentPassword.trim().length > 0 &&
      newPassword.trim().length > 0 &&
      confirmPassword.trim().length > 0 &&
      !error
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
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

          {/* Current Password Input */}
          <Input
            ref={currentPasswordRef}
            label="Current Password"
            value={currentPassword}
            onChangeText={handleCurrentPasswordChange}
            placeholder="Enter current password"
            secureTextEntry={true}
            returnKeyType="next"
            onSubmitEditing={() => newPasswordRef.current?.focus()}
            editable={!isSubmitting}
            autoFocus={true}
            containerStyle={styles.inputContainer}
          />

          {/* New Password Input */}
          <Input
            ref={newPasswordRef}
            label="New Password"
            value={newPassword}
            onChangeText={handleNewPasswordChange}
            placeholder="Enter new password"
            secureTextEntry={true}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            editable={!isSubmitting}
            containerStyle={styles.inputContainer}
          />

          {/* Confirm New Password Input */}
          <Input
            ref={confirmPasswordRef}
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            placeholder="Confirm new password"
            secureTextEntry={true}
            returnKeyType="done"
            onSubmitEditing={handleUpdatePassword}
            editable={!isSubmitting}
            containerStyle={styles.inputContainer}
          />

          {/* Submit Button */}
          <Button
            title={isSubmitting ? 'Updating Password...' : 'Update Password'}
            onPress={handleUpdatePassword}
            loading={isSubmitting}
            disabled={!isFormValid()}
          />

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Update your password. Your new password must be different from your current password.
            </Text>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  inputContainer: {
    marginBottom: 20,
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

export default UpdateExpiryPasswordScreen;

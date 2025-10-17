/**
 * Update Password Screen (Password Update Credentials Flow)
 *
 * This screen is designed for updating passwords via the credential update flow.
 * It handles challengeMode = 2 (RDNA_OP_UPDATE_CREDENTIALS) where users can update
 * their password by providing current and new passwords.
 *
 * Key Features:
 * - Current password, new password, and confirm password inputs with validation
 * - Password policy parsing and validation
 * - Real-time error handling and loading states
 * - Attempts left counter display
 * - Success/error feedback
 * - Password policy display
 * - Challenge mode 2 handling for password updates
 *
 * Usage:
 * Navigation.navigate('UpdatePasswordScreen', {
 *   eventData: data,
 *   title: 'Update Password',
 *   subtitle: 'Update your account password',
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
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RDNAEventUtils, RDNASyncUtils } from '../../../uniken/types/rdnaEvents';
import { parseAndGeneratePolicyMessage } from '../../../uniken/utils';
import type { RDNAGetPasswordData, RDNASyncResponse, RDNAUpdateCredentialResponseData } from '../../../uniken/types/rdnaEvents';
import rdnaService from '../../../uniken/services/rdnaService';
import { Button, Input, StatusBanner } from '../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type UpdatePasswordScreenRouteProp = RouteProp<RootStackParamList, 'UpdatePasswordScreen'>;

/**
 * Update Password Screen Component
 */
const UpdatePasswordScreen: React.FC = () => {
  const route = useRoute<UpdatePasswordScreenRouteProp>();
  const navigation = useNavigation();

  const {
    eventData,
    responseData,
  } = route.params;

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [challengeMode, setChallengeMode] = useState<number>(2);
  const [userName, setUserName] = useState<string>('');
  const [passwordPolicyMessage, setPasswordPolicyMessage] = useState<string>('');
  const [attemptsLeft, setAttemptsLeft] = useState<number>(3);

  const currentPasswordRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  /**
   * Clear password fields when screen comes into focus
   */
  useFocusEffect(
    React.useCallback(() => {
      console.log('UpdatePasswordScreen - Screen focused, clearing password fields');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setIsSubmitting(false);
    }, [])
  );

  /**
   * Set up event handler for onUpdateCredentialResponse when screen is mounted
   */
  useEffect(() => {
    const eventManager = rdnaService.getEventManager();

    // Set up handler for update credential response
    const handleUpdateCredentialResponse = (data: RDNAUpdateCredentialResponseData) => {
      console.log('UpdatePasswordScreen - Update credential response received:', {
        userID: data.userID,
        credType: data.credType,
        statusCode: data.status.statusCode,
        statusMessage: data.status.statusMessage
      });

      setIsSubmitting(false);

      const statusCode = data.status.statusCode;
      const statusMessage = data.status.statusMessage;

      if (statusCode === 100 || statusCode === 0 ) {
        // Success case - don't clear fields, just navigate
        Alert.alert(
          'Success',
          statusMessage || 'Password updated successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to dashboard
                (navigation as any).navigate('DrawerNavigator', {
                  screen: 'Dashboard',
                });
              }
            }
          ]
        );
      } else if (statusCode === 110 || statusCode === 153 || statusCode === 190) {
        // Critical error cases that trigger logout
        // statusCode 110: Password has expired
        // statusCode 153: Attempts exhausted, user/device blocked
        // statusCode 190: Password does not meet policy standards

        // Clear all password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError(statusMessage || 'Update failed');

        Alert.alert(
          'Update Failed',
          statusMessage,
          [
            {
              text: 'OK',
              onPress: () => {
                // User will be logged off automatically by SDK
                // getUser event will be triggered and handled
                console.log('UpdatePasswordScreen - Critical error, waiting for onUserLoggedOff and getUser events');
              }
            }
          ]
        );
      } else {
        // Other error cases
        // Clear all password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError(statusMessage || 'Failed to update password');
        console.error('UpdatePasswordScreen - Update credential error:', statusMessage);
      }
    };

    eventManager.setUpdateCredentialResponseHandler(handleUpdateCredentialResponse);

    // Cleanup handler when screen unmounts
    return () => {
      console.log('UpdatePasswordScreen - Cleaning up update credential response handler');
      eventManager.setUpdateCredentialResponseHandler(undefined);
    };
  }, [navigation]);

  /**
   * Handle response data from route params
   */
  useEffect(() => {
    if (responseData) {
      console.log('UpdatePasswordScreen - Processing response data from route params:', responseData);

      // Extract challenge data
      setUserName(responseData.userID || '');
      setChallengeMode(responseData.challengeMode || 2);
      setAttemptsLeft(responseData.attemptsLeft || 3);

      // Extract and process password policy
      const policyJsonString = RDNAEventUtils.getChallengeValue(responseData, 'RELID_PASSWORD_POLICY');
      if (policyJsonString) {
        const policyMessage = parseAndGeneratePolicyMessage(policyJsonString);
        setPasswordPolicyMessage(policyMessage);
        console.log('UpdatePasswordScreen - Password policy extracted:', policyMessage);
      }

      console.log('UpdatePasswordScreen - Processed password data:', {
        userID: responseData.userID,
        challengeMode: responseData.challengeMode,
        attemptsLeft: responseData.attemptsLeft,
        passwordPolicy: policyJsonString ? 'Found' : 'Not found',
      });

      // Check for API errors first
      if (RDNAEventUtils.hasApiError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('UpdatePasswordScreen - API error:', errorMessage);
        setError(errorMessage);
        // Clear all password fields on error
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        return;
      }

      // Check for status errors
      if (RDNAEventUtils.hasStatusError(responseData)) {
        const errorMessage = RDNAEventUtils.getErrorMessage(responseData);
        console.log('UpdatePasswordScreen - Status error:', errorMessage);
        setError(errorMessage);
        // Clear all password fields on error
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        return;
      }

      // Success case - ready for input
      setIsSubmitting(false);
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
      setNewPassword('');
      setConfirmPassword('');
      if (newPasswordRef.current) {
        newPasswordRef.current.focus();
      }
      return;
    }

    // Check if new password is same as current password
    if (trimmedCurrentPassword === trimmedNewPassword) {
      setError('New password must be different from current password');
      setNewPassword('');
      setConfirmPassword('');
      if (newPasswordRef.current) {
        newPasswordRef.current.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log('UpdatePasswordScreen - Updating password with challengeMode:', challengeMode);

      const syncResponse: RDNASyncResponse = await rdnaService.updatePassword(
        trimmedCurrentPassword,
        trimmedNewPassword,
        challengeMode
      );

      console.log('UpdatePasswordScreen - UpdatePassword sync response successful, waiting for async events');
      console.log('UpdatePasswordScreen - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });

      // Success - wait for onUpdateCredentialResponse event or getPassword with error
      // Event handlers in SDKEventProvider will handle the navigation

    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('UpdatePasswordScreen - UpdatePassword sync error:', error);

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

      {/* Header with Menu Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => (navigation as any).openDrawer?.()}
          disabled={isSubmitting}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Password</Text>
        <View style={styles.headerSpacer} />
      </View>

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
        <View style={styles.content}>
          {/* User Information */}
          {userName && (
            <View style={styles.userContainer}>
              <Text style={styles.welcomeText}>User</Text>
              <Text style={styles.userNameText}>{userName}</Text>
            </View>
          )}

          {/* Attempts Left Counter */}
          {attemptsLeft <= 3 && (
            <View style={[
              styles.attemptsContainer,
              attemptsLeft === 1 && styles.attemptsContainerCritical
            ]}>
              <Text style={[
                styles.attemptsText,
                attemptsLeft === 1 && styles.attemptsTextCritical
              ]}>
                Attempts remaining: {attemptsLeft}
              </Text>
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
              Update your password. Your new password must be different from your current password and meet all policy requirements.
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 24,
    color: '#3498db',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
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
    marginBottom: 10,
  },
  attemptsContainer: {
    backgroundColor: '#fff3cd',
    borderLeftColor: '#ffc107',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  attemptsContainerCritical: {
    backgroundColor: '#f8d7da',
    borderLeftColor: '#dc3545',
  },
  attemptsText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '600',
    textAlign: 'center',
  },
  attemptsTextCritical: {
    color: '#721c24',
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

export default UpdatePasswordScreen;

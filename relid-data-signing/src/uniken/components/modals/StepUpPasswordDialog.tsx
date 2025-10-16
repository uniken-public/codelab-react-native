/**
 * Step-Up Password Dialog Component
 *
 * Modal dialog for step-up authentication during notification actions.
 * Handles challengeMode = 3 (RDNA_OP_AUTHORIZE_NOTIFICATION) when the SDK
 * requires password verification before allowing a notification action.
 *
 * Features:
 * - Password input with visibility toggle
 * - Attempts left counter
 * - Error message display
 * - Loading state during authentication
 * - Notification context display
 * - Auto-focus on password field
 *
 * Usage:
 * ```tsx
 * <StepUpPasswordDialog
 *   visible={showStepUpAuth}
 *   notificationTitle="Payment Approval"
 *   notificationMessage="Approve payment of $500"
 *   userID="john.doe"
 *   attemptsLeft={3}
 *   errorMessage="Incorrect password"
 *   isSubmitting={false}
 *   onSubmitPassword={(password) => handlePasswordSubmit(password)}
 *   onCancel={() => setShowStepUpAuth(false)}
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  BackHandler,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface StepUpPasswordDialogProps {
  visible: boolean;
  notificationTitle: string;
  notificationMessage: string;
  userID: string;
  attemptsLeft: number;
  errorMessage?: string;
  isSubmitting: boolean;
  onSubmitPassword: (password: string) => void;
  onCancel: () => void;
}

const StepUpPasswordDialog: React.FC<StepUpPasswordDialogProps> = ({
  visible,
  notificationTitle, // Keep for future use
  notificationMessage, // Keep for future use
  userID, // Keep for future use
  attemptsLeft,
  errorMessage,
  isSubmitting,
  onSubmitPassword,
  onCancel,
}) => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const passwordInputRef = useRef<TextInput>(null);

  // Clear password when modal becomes visible or when there's an error
  useEffect(() => {
    if (visible) {
      setPassword('');
      setShowPassword(false);
      // Auto-focus password input after a short delay
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 300);
    }
  }, [visible]);

  // Clear password field when error message changes (wrong password)
  useEffect(() => {
    if (errorMessage) {
      setPassword('');
    }
  }, [errorMessage]);

  // Disable hardware back button when modal is visible
  useEffect(() => {
    const handleBackPress = () => {
      if (visible && !isSubmitting) {
        onCancel();
        return true; // Prevent default back action
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, [visible, isSubmitting, onCancel]);

  const handleSubmit = () => {
    if (!password.trim() || isSubmitting) {
      return;
    }
    onSubmitPassword(password.trim());
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const getAttemptsColor = (): string => {
    if (attemptsLeft === 1) return '#dc2626'; // Red
    if (attemptsLeft === 2) return '#f59e0b'; // Orange
    return '#10b981'; // Green
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        if (!isSubmitting) {
          onCancel();
        }
      }}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🔐 Authentication Required</Text>
            <Text style={styles.modalSubtitle}>
              Please verify your password to authorize this action
            </Text>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Notification Title */}
            <View style={styles.notificationContainer}>
              <Text style={styles.notificationTitle}>{notificationTitle}</Text>
            </View>

            {/* Attempts Left Counter */}
            {attemptsLeft <= 3 && (
              <View style={[
                styles.attemptsContainer,
                { backgroundColor: `${getAttemptsColor()}20` }
              ]}>
                <Text style={[
                  styles.attemptsText,
                  { color: getAttemptsColor() }
                ]}>
                  {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining
                </Text>
              </View>
            )}

            {/* Error Display */}
            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  ref={passwordInputRef}
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  editable={!isSubmitting}
                />
                <TouchableOpacity
                  style={styles.visibilityButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.visibilityIcon}>
                    {showPassword ? '👁️' : '🙈'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!password.trim() || isSubmitting) && styles.buttonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!password.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <View style={styles.buttonLoadingContent}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.submitButtonText}>Verifying...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Verify & Continue</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, isSubmitting && styles.buttonDisabled]}
              onPress={onCancel}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 480,
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    backgroundColor: '#3b82f6',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#dbeafe',
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollContainer: {
    flexGrow: 0,
  },
  contentContainer: {
    padding: 20,
  },
  notificationContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
  },
  attemptsContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  attemptsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  errorText: {
    fontSize: 14,
    color: '#7f1d1d',
    lineHeight: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  visibilityButton: {
    padding: 12,
  },
  visibilityIcon: {
    fontSize: 20,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLoadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default StepUpPasswordDialog;

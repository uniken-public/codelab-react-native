/**
 * Password Challenge Modal Component
 * Modal for step-up authentication during data signing
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useDataSigning } from '../../../../uniken/providers/SDKEventProvider';

const PasswordChallengeModal: React.FC = () => {
  const {
    passwordModalState,
    updatePasswordModalState,
    submitPassword,
    cancelPasswordModal,
  } = useDataSigning();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear password when modal becomes visible
  useEffect(() => {
    if (passwordModalState.isVisible) {
      updatePasswordModalState({ password: '' });
    }
  }, [passwordModalState.isVisible, updatePasswordModalState]);

  const handlePasswordChange = (password: string) => {
    updatePasswordModalState({ password });
  };

  const handleSubmit = async () => {
    console.log('PasswordChallengeModal - Submit button pressed');

    if (!passwordModalState.password.trim()) {
      Alert.alert('Validation Error', 'Please enter your password');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitPassword();
      console.log('PasswordChallengeModal - Password submitted successfully');
    } catch (error) {
      console.error('PasswordChallengeModal - Submit error:', error);
      Alert.alert('Error', 'Failed to authenticate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    console.log('PasswordChallengeModal - Cancel button pressed');

    try {
      await cancelPasswordModal();
      console.log('PasswordChallengeModal - Cancelled successfully');
    } catch (error) {
      console.error('PasswordChallengeModal - Cancel error:', error);
    }
  };

  const getAttemptsText = () => {
    if (passwordModalState.attemptsLeft === 1) {
      return '⚠️ Last attempt remaining';
    }
    return `${passwordModalState.attemptsLeft} attempts remaining`;
  };

  const getAttemptsColor = () => {
    if (passwordModalState.attemptsLeft <= 1) {
      return '#ff3b30';
    } else if (passwordModalState.attemptsLeft <= 2) {
      return '#ff9500';
    }
    return '#666';
  };

  return (
    <Modal
      visible={passwordModalState.isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContent}>

          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.securityIcon}>
              <Text style={styles.securityIconText}>🔐</Text>
            </View>
            <Text style={styles.modalTitle}>Authentication Required</Text>
            <Text style={styles.modalSubtitle}>
              Enter your password to complete data signing
            </Text>
          </View>

          {/* Content */}
          <View style={styles.modalBody}>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={passwordModalState.password}
                onChangeText={handlePasswordChange}
                secureTextEntry={true}
                autoFocus={true}
                autoCorrect={false}
                autoCapitalize="none"
                onSubmitEditing={handleSubmit}
                editable={!isSubmitting}
              />
            </View>

            {/* Attempts Counter */}
            <View style={styles.attemptsContainer}>
              <Text style={[styles.attemptsText, { color: getAttemptsColor() }]}>
                {getAttemptsText()}
              </Text>
            </View>

            {/* Authentication Options (if available) */}
            {passwordModalState.authenticationOptions.length > 0 && (
              <View style={styles.alternativeAuth}>
                <Text style={styles.alternativeAuthText}>
                  Alternative authentication methods available
                </Text>
                {/* TODO: Add LDA options when supported */}
              </View>
            )}

          </View>

          {/* Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting || !passwordModalState.password.trim()}
            >
              {isSubmitting ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.submitButtonText}>Authenticating...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Authenticate</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Security Info */}
          <View style={styles.securityInfo}>
            <Text style={styles.securityInfoText}>
              🛡️ Your password is securely processed and never stored
            </Text>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  securityIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  securityIconText: {
    fontSize: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalBody: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  passwordInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  attemptsContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  attemptsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  alternativeAuth: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  alternativeAuthText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 0,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityInfo: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  securityInfoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PasswordChallengeModal;
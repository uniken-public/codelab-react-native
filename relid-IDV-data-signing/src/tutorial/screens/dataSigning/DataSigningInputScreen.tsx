/**
 * Data Signing Input Screen
 * Screen for collecting data signing parameters from user
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDataSigning } from '../../../uniken/providers/SDKEventProvider';
import { DropdownDataService } from '../../services/DropdownDataService';
import AuthLevelDropdown from './components/AuthLevelDropdown';
import AuthenticatorTypeDropdown from './components/AuthenticatorTypeDropdown';
import PasswordChallengeModal from './components/PasswordChallengeModal';

/**
 * Main screen for data signing input
 */
const DataSigningInputScreen: React.FC = () => {
  const navigation = useNavigation();

  const {
    formState,
    updateFormState,
    passwordModalState,
    submitDataSigning,
    resultDisplay,
  } = useDataSigning();

  /**
   * Handles form submission
   */
  const handleSubmit = async () => {
    console.log('DataSigningInputScreen - Submit button pressed');

    // Validate required fields
    if (!formState.payload.trim()) {
      Alert.alert('Validation Error', 'Please enter a payload to sign');
      return;
    }

    if (!formState.selectedAuthLevel) {
      Alert.alert('Validation Error', 'Please select an authentication level');
      return;
    }

    if (!formState.selectedAuthenticatorType) {
      Alert.alert('Validation Error', 'Please select an authenticator type');
      return;
    }

    if (!formState.reason.trim()) {
      Alert.alert('Validation Error', 'Please enter a reason for signing');
      return;
    }

    try {
      await submitDataSigning();
    } catch (error) {
      console.error('DataSigningInputScreen - Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit data signing request. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  /**
   * Navigates to result screen when signing is complete
   */
  React.useEffect(() => {
    if (resultDisplay) {
      console.log('DataSigningInputScreen - Navigating to results screen');
      navigation.navigate('DataSigningResult' as never);
    }
  }, [resultDisplay, navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Data Signing</Text>
          <Text style={styles.subtitle}>
            Sign your data with cryptographic authentication
          </Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            1. Enter your data payload and select authentication parameters{'\n'}
            2. Click "Sign Data" to initiate the signing process{'\n'}
            3. Complete authentication when prompted{'\n'}
            4. Receive your cryptographically signed data
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>

          {/* Payload Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data Payload *</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Enter the data you want to sign..."
              value={formState.payload}
              onChangeText={(value) => updateFormState({ payload: value })}
              multiline={true}
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
              editable={!formState.isLoading}
            />
            <Text style={styles.charCount}>
              {formState.payload.length}/500
            </Text>
          </View>

          {/* Auth Level Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Authentication Level *</Text>
            <AuthLevelDropdown
              selectedValue={formState.selectedAuthLevel}
              onValueChange={(value) => updateFormState({ selectedAuthLevel: value })}
              enabled={!formState.isLoading}
            />
            <Text style={styles.helpText}>
              Level 4 is recommended for maximum security
            </Text>
          </View>

          {/* Authenticator Type Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Authenticator Type *</Text>
            <AuthenticatorTypeDropdown
              selectedValue={formState.selectedAuthenticatorType}
              onValueChange={(value) => updateFormState({ selectedAuthenticatorType: value })}
              enabled={!formState.isLoading}
            />
            <Text style={styles.helpText}>
              Choose the authentication method for signing
            </Text>
          </View>

          {/* Reason Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Signing Reason *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter reason for signing"
              value={formState.reason}
              onChangeText={(value) => updateFormState({ reason: value })}
              maxLength={100}
              editable={!formState.isLoading}
            />
            <Text style={styles.charCount}>
              {formState.reason.length}/100
            </Text>
          </View>

        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, formState.isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={formState.isLoading}
        >
          {formState.isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.submitButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Sign Data</Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      {/* Password Challenge Modal */}
      <PasswordChallengeModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoSection: {
    marginTop: 10,
    marginBottom: 10,
    padding: 16,
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default DataSigningInputScreen;
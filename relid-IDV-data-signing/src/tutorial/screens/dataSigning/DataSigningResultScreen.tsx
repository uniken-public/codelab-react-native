/**
 * Data Signing Result Screen
 * Displays the results of data signing operation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Clipboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDataSigning } from '../../../uniken/providers/SDKEventProvider';
import { DataSigningService } from '../../services/DataSigningService';

const DataSigningResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const { resultDisplay, resetState } = useDataSigning();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Convert to result info items for display
  const resultItems = resultDisplay
    ? DataSigningService.convertToResultInfoItems(resultDisplay)
    : [];

  const handleCopyToClipboard = async (value: string, fieldName: string) => {
    try {
      await Clipboard.setString(value);
      setCopiedField(fieldName);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);

      console.log(`DataSigningResultScreen - Copied ${fieldName} to clipboard`);
    } catch (error) {
      console.error('DataSigningResultScreen - Failed to copy to clipboard:', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };


  const handleSignAnother = async () => {
    console.log('DataSigningResultScreen - Sign another button pressed');

    try {
      await resetState();
      navigation.goBack();
    } catch (error) {
      console.error('DataSigningResultScreen - Failed to reset state:', error);
      navigation.goBack();
    }
  };


  const renderResultItem = (item: { name: string; value: string }, index: number) => {
    const isSignature = item.name === 'Payload Signature';
    const isLongValue = item.value.length > 50;
    const displayValue = isLongValue && !isSignature
      ? `${item.value.substring(0, 50)}...`
      : item.value;

    return (
      <View key={index} style={styles.resultItem}>
        <View style={styles.resultItemHeader}>
          <Text style={styles.resultLabel}>{item.name}</Text>
          {item.value !== 'N/A' && (
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => handleCopyToClipboard(item.value, item.name)}
            >
              <Text style={styles.copyButtonText}>
                {copiedField === item.name ? '✓ Copied' : '📋 Copy'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.resultValueContainer, isSignature && styles.signatureContainer]}>
          <Text style={[styles.resultValue, isSignature && styles.signatureText]}>
            {displayValue}
          </Text>
        </View>

        {isLongValue && !isSignature && (
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => Alert.alert(item.name, item.value)}
          >
            <Text style={styles.expandButtonText}>View Full Value</Text>
          </TouchableOpacity>
        )}

        {isSignature && (
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => Alert.alert('Complete Signature', item.value)}
          >
            <Text style={styles.expandButtonText}>View Complete Signature</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!resultDisplay) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No signing results available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Data Signing Successful!</Text>
          <Text style={styles.successSubtitle}>
            Your data has been cryptographically signed
          </Text>
        </View>

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Signing Results</Text>
          <Text style={styles.sectionSubtitle}>
            All values below have been cryptographically verified
          </Text>

          <View style={styles.resultsContainer}>
            {resultItems.map(renderResultItem)}
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSignAnother}
          >
            <Text style={styles.buttonText}>🔐 Sign Another Document</Text>
          </TouchableOpacity>

        </View>

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <Text style={styles.securityInfoTitle}>🛡️ Security Information</Text>
          <Text style={styles.securityInfoText}>
            • Your signature is cryptographically secure and tamper-proof{'\n'}
            • The signature ID uniquely identifies this signing operation{'\n'}
            • Data integrity is mathematically guaranteed{'\n'}
            • This signature can be verified independently
          </Text>
        </View>

      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8f5e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIconText: {
    fontSize: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  resultsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  resultsContainer: {
    gap: 16,
  },
  resultItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  resultItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  copyButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  resultValueContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  signatureContainer: {
    backgroundColor: '#fff5e6',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  resultValue: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 22,
  },
  signatureText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#333',
  },
  expandButton: {
    alignSelf: 'flex-start',
  },
  expandButtonText: {
    fontSize: 12,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  actionsSection: {
    gap: 12,
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    elevation: 3,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  securityInfo: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  securityInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  securityInfoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default DataSigningResultScreen;
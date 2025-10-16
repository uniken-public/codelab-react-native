/**
 * Authenticator Type Dropdown Component
 * Dropdown for selecting RDNA authenticator types
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { DropdownDataService } from '../../../services/DropdownDataService';

interface AuthenticatorTypeDropdownProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  enabled?: boolean;
}

const AuthenticatorTypeDropdown: React.FC<AuthenticatorTypeDropdownProps> = ({
  selectedValue,
  onValueChange,
  enabled = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const options = DropdownDataService.getAuthenticatorTypeOptions();

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  const getDisplayValue = () => {
    if (!selectedValue) return 'Select Authenticator Type';
    return selectedValue;
  };

  const getDescription = (value: string) => {
    switch (value) {
      case 'NONE (0)':
        return 'No specific authenticator';
      case 'RDNA_IDV_SERVER_BIOMETRIC (1)':
        return 'Server-side biometric authentication';
      case 'RDNA_AUTH_PASS (2)':
        return 'Password-based authentication';
      case 'RDNA_AUTH_LDA (3)':
        return 'Local device authentication (PIN, Touch ID, Face ID)';
      default:
        return '';
    }
  };

  const getIcon = (value: string) => {
    switch (value) {
      case 'NONE (0)':
        return '⭕';
      case 'RDNA_IDV_SERVER_BIOMETRIC (1)':
        return '🔐';
      case 'RDNA_AUTH_PASS (2)':
        return '🔑';
      case 'RDNA_AUTH_LDA (3)':
        return '📱';
      default:
        return '';
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.dropdown,
          !enabled && styles.dropdownDisabled,
          selectedValue && styles.dropdownSelected,
        ]}
        onPress={() => enabled && setModalVisible(true)}
        disabled={!enabled}
      >
        <Text
          style={[
            styles.dropdownText,
            !selectedValue && styles.placeholderText,
            !enabled && styles.disabledText,
          ]}
        >
          {getDisplayValue()}
        </Text>
        <Text style={[styles.arrow, !enabled && styles.disabledText]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Authenticator Type</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    selectedValue === option.value && styles.optionItemSelected,
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <View style={styles.optionIcon}>
                    <Text style={styles.iconText}>{getIcon(option.value)}</Text>
                  </View>

                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionText,
                        selectedValue === option.value && styles.optionTextSelected,
                      ]}
                    >
                      {option.value}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        selectedValue === option.value && styles.optionDescriptionSelected,
                      ]}
                    >
                      {getDescription(option.value)}
                    </Text>
                  </View>

                  {selectedValue === option.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Text style={styles.footerText}>
                💡 Tip: Choose the authentication method that best fits your security requirements
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
    minHeight: 52,
  },
  dropdownDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  dropdownSelected: {
    borderColor: '#007AFF',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  disabledText: {
    color: '#ccc',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionItemSelected: {
    backgroundColor: '#f0f8ff',
    borderBottomColor: '#007AFF',
  },
  optionIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    marginBottom: 2,
  },
  optionTextSelected: {
    color: '#007AFF',
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
    flexWrap: 'wrap',
  },
  optionDescriptionSelected: {
    color: '#0056b3',
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalFooter: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AuthenticatorTypeDropdown;
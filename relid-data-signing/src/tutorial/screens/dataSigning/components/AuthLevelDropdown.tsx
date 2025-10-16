/**
 * Authentication Level Dropdown Component
 * Dropdown for selecting RDNA authentication levels
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

interface AuthLevelDropdownProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  enabled?: boolean;
}

const AuthLevelDropdown: React.FC<AuthLevelDropdownProps> = ({
  selectedValue,
  onValueChange,
  enabled = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const options = DropdownDataService.getAuthLevelOptions();

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  const getDisplayValue = () => {
    if (!selectedValue) return 'Select Authentication Level';
    return selectedValue;
  };

  const getDescription = (value: string) => {
    switch (value) {
      case 'NONE (0)':
        return 'No authentication required';
      case 'RDNA_AUTH_LEVEL_1 (1)':
        return 'Basic authentication';
      case 'RDNA_AUTH_LEVEL_2 (2)':
        return 'Standard authentication';
      case 'RDNA_AUTH_LEVEL_3 (3)':
        return 'Enhanced authentication';
      case 'RDNA_AUTH_LEVEL_4 (4)':
        return 'Maximum security (Recommended)';
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
              <Text style={styles.modalTitle}>Select Authentication Level</Text>
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionItemSelected: {
    backgroundColor: '#f0f8ff',
    borderBottomColor: '#007AFF',
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
});

export default AuthLevelDropdown;
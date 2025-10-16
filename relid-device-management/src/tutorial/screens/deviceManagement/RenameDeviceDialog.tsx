/**
 * Rename Device Dialog
 *
 * Modal dialog for renaming a device with input validation
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface RenameDeviceDialogProps {
  visible: boolean;
  currentDeviceName: string;
  isSubmitting: boolean;
  onSubmit: (newName: string) => void;
  onCancel: () => void;
}

const RenameDeviceDialog: React.FC<RenameDeviceDialogProps> = ({
  visible,
  currentDeviceName,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const [newName, setNewName] = useState(currentDeviceName);
  const [error, setError] = useState('');

  // Reset state when dialog opens
  useEffect(() => {
    if (visible) {
      setNewName(currentDeviceName);
      setError('');
    }
  }, [visible, currentDeviceName]);

  const handleSubmit = () => {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      setError('Device name cannot be empty');
      return;
    }

    if (trimmedName === currentDeviceName) {
      setError('New name must be different from current name');
      return;
    }

    if (trimmedName.length < 3) {
      setError('Device name must be at least 3 characters');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Device name must be less than 50 characters');
      return;
    }

    onSubmit(trimmedName);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.dialogContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Rename Device</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.label}>Current Name:</Text>
            <Text style={styles.currentName}>{currentDeviceName}</Text>

            <Text style={[styles.label, styles.newNameLabel]}>New Name:</Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              value={newName}
              onChangeText={(text) => {
                setNewName(text);
                setError('');
              }}
              placeholder="Enter new device name"
              placeholderTextColor="#999"
              autoFocus={true}
              editable={!isSubmitting}
              maxLength={50}
            />

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Rename</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 8,
  },
  currentName: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 20,
    fontWeight: '500',
  },
  newNameLabel: {
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
    backgroundColor: '#f8f9fa',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default RenameDeviceDialog;

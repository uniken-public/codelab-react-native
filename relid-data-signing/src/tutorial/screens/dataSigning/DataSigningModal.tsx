import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { RDNASyncUtils } from '../../../uniken/types/rdnaEvents';
import type { RDNAGetPasswordData, RDNASyncResponse } from '../../../uniken/types/rdnaEvents';
import rdnaService from '../../../uniken/services/rdnaService';

interface DataSigningModalProps {
  visible: boolean;
  onClose: () => void;
  responseData: RDNAGetPasswordData;
}

const DataSigningModal: React.FC<DataSigningModalProps> = ({
  visible,
  onClose,
  responseData,
}) => {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const passwordRef = useRef<TextInput>(null);

  const handleClose = async () => {
    try {
      await rdnaService.resetAuthState();
      onClose();
    } catch (error) {
      console.error('DataSigningModal - ResetAuthState error:', error);
      onClose();
    }
  };

  useEffect(() => {
    if (!visible) {
      setPassword('');
      setError('');
      setIsSubmitting(false);
    }
  }, [visible]);

  const handleSubmitPassword = async () => {
    if (isSubmitting || !password.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await rdnaService.setPassword(password.trim(), 12);
    } catch (error) {
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      setError(errorMessage);
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Data Signing</Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <TextInput
            ref={passwordRef}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry={true}
            returnKeyType="done"
            onSubmitEditing={handleSubmitPassword}
            editable={!isSubmitting}
            autoFocus={true}
          />

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmitPassword}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default DataSigningModal;
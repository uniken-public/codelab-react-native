import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
  AppState,
} from 'react-native';
import type { 
  RDNASessionTimeoutData, 
  RDNASessionTimeoutNotificationData 
} from '../../types/rdnaEvents';

interface SessionModalProps {
  // Modal visibility
  visible: boolean;
  
  // Session data - one of these will be provided
  sessionTimeoutData?: RDNASessionTimeoutData;
  sessionTimeoutNotificationData?: RDNASessionTimeoutNotificationData;
  
  // State flags
  isProcessing?: boolean;
  
  // Callbacks
  onExtendSession?: () => void;
  onDismiss?: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
  visible,
  sessionTimeoutData,
  sessionTimeoutNotificationData,
  isProcessing = false,
  onExtendSession,
  onDismiss,
}) => {
  const [countdown, setCountdown] = useState<number>(0);
  const backgroundTimeRef = useRef<number | null>(null);
  const initialCountdownRef = useRef<number>(0);
  
  // Determine session type
  const isMandatoryTimeout = !!sessionTimeoutData;
  const isIdleTimeout = !!sessionTimeoutNotificationData;
  const canExtendSession = sessionTimeoutNotificationData?.sessionCanBeExtended === 1;

  // Initialize countdown from notification data
  useEffect(() => {
    if (sessionTimeoutNotificationData?.timeLeftInSeconds) {
      const timeLeft = sessionTimeoutNotificationData.timeLeftInSeconds;
      setCountdown(timeLeft);
      initialCountdownRef.current = timeLeft;
    }
  }, [sessionTimeoutNotificationData]);

  // Countdown timer effect - works for both idle and hard timeout notifications
  useEffect(() => {
    if (countdown > 0 && (isIdleTimeout || isMandatoryTimeout) && visible) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isIdleTimeout, isMandatoryTimeout, visible]);

  // Handle app state changes for accurate countdown when app goes to background/foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (visible && (isIdleTimeout || isMandatoryTimeout)) {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          // App going to background - record the time
          backgroundTimeRef.current = Date.now();
          console.log('SessionModal - App going to background, recording time');
        } else if (nextAppState === 'active' && backgroundTimeRef.current) {
          // App returning to foreground - calculate elapsed time
          const elapsedSeconds = Math.floor((Date.now() - backgroundTimeRef.current) / 1000);
          console.log(`SessionModal - App returning to foreground, elapsed: ${elapsedSeconds}s`);
          
          // Update countdown based on actual elapsed time
          setCountdown(prevCountdown => {
            const newCountdown = Math.max(0, prevCountdown - elapsedSeconds);
            console.log(`SessionModal - Countdown updated: ${prevCountdown} -> ${newCountdown}`);
            return newCountdown;
          });
          
          backgroundTimeRef.current = null;
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, [visible, isIdleTimeout, isMandatoryTimeout]);

  // Disable back button when modal is visible
  useEffect(() => {
    const handleBackPress = () => {
      if (visible) {
        return true; // Prevent default back action
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [visible]);

  // Get display message
  const getDisplayMessage = (): string => {
    if (sessionTimeoutData) {
      return sessionTimeoutData.message;
    }
    if (sessionTimeoutNotificationData) {
      return sessionTimeoutNotificationData.message;
    }
    return 'Session timeout occurred.';
  };

  // Get modal title and colors based on session type
  const getModalConfig = () => {
    if (isMandatoryTimeout) {
      return {
        title: '🔐 Session Expired',
        subtitle: 'Your session has expired. You will be redirected to the home screen.',
        headerColor: '#dc2626', // Red for hard timeout
        icon: '🔐',
      };
    }
    
    if (isIdleTimeout) {
      return {
        title: '⚠️ Session Timeout Warning',
        subtitle: canExtendSession 
          ? 'Your session will expire soon. You can extend it or let it timeout.'
          : 'Your session will expire soon.',
        headerColor: '#f59e0b', // Orange for idle timeout
        icon: '⏱️',
      };
    }

    return {
      title: '⏰ Session Management',
      subtitle: 'Session timeout notification',
      headerColor: '#6b7280',
      icon: '🔐',
    };
  };

  const config = getModalConfig();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        // Prevent modal dismissal - force user to take action
        return;
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={[styles.modalHeader, { backgroundColor: config.headerColor }]}>
            <Text style={styles.modalTitle}>
              {config.title}
            </Text>
            <Text style={styles.modalSubtitle}>
              {config.subtitle}
            </Text>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <View style={styles.messageContainer}>
              <Text style={styles.sessionIcon}>{config.icon}</Text>
              <Text style={styles.sessionMessage}>
                {getDisplayMessage()}
              </Text>
            </View>

            {/* Countdown display for idle timeout */}
            {isIdleTimeout && countdown > 0 && (
              <View style={styles.countdownContainer}>
                <Text style={styles.countdownLabel}>Time Remaining:</Text>
                <Text style={styles.countdownText}>
                  {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                </Text>
              </View>
            )}

            {/* No countdown display for hard timeout - session already expired */}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {/* Hard timeout - only Close option */}
            {isMandatoryTimeout && (
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={onDismiss}
              >
                <Text style={styles.secondaryButtonText}>Close</Text>
              </TouchableOpacity>
            )}

            {/* Idle timeout - extend or dismiss options */}
            {isIdleTimeout && (
              <>
                {canExtendSession && onExtendSession && (
                  <TouchableOpacity 
                    style={[styles.primaryButton, isProcessing && styles.buttonDisabled]}
                    onPress={onExtendSession}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <View style={styles.buttonLoadingContent}>
                        <ActivityIndicator size="small" color="#ffffff" />
                        <Text style={styles.primaryButtonText}>Extending...</Text>
                      </View>
                    ) : (
                      <Text style={styles.primaryButtonText}>Extend Session</Text>
                    )}
                  </TouchableOpacity>
                )}
                
                {onDismiss && (
                  <TouchableOpacity 
                    style={[styles.secondaryButton, isProcessing && styles.buttonDisabled]}
                    onPress={onDismiss}
                    disabled={isProcessing}
                  >
                    <Text style={styles.secondaryButtonText}>Close</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
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
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  contentContainer: {
    padding: 20,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sessionIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  sessionMessage: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 24,
  },
  countdownContainer: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  countdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  countdownText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d97706',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLoadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SessionModal;
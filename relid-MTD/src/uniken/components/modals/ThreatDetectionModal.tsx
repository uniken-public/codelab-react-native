import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  BackHandler,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { RDNAThreatInfo } from '../../types/rdnaEvents';

interface ThreatDetectionModalProps {
  visible: boolean;
  threats: RDNAThreatInfo[];
  isConsentMode: boolean; // true for onUserConsentThreats, false for onTerminateWithThreats
  isProcessing?: boolean; // true when API call is in progress
  processingExit?: boolean; // true when processing exit action (for better UX messaging)
  onProceed?: () => void;
  onExit: () => void;
}

const ThreatDetectionModal: React.FC<ThreatDetectionModalProps> = ({
  visible,
  threats,
  isConsentMode,
  isProcessing = false,
  processingExit = false,
  onProceed,
  onExit,
}) => {
  // Disable back button when modal is visible
  React.useEffect(() => {
    const handleBackPress = () => {
      if (visible) {
        return true; // Prevent default back action
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => backHandler.remove();
  }, [visible]);

  const getThreatSeverityColor = (severity: string): string => {
    switch (severity.toUpperCase()) {
      case 'HIGH':
        return '#dc2626';
      case 'MEDIUM':
        return '#f59e0b';
      case 'LOW':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getThreatCategoryIcon = (category: string): string => {
    switch (category.toUpperCase()) {
      case 'SYSTEM':
        return '🛡️';
      case 'NETWORK':
        return '🌐';
      case 'APP':
        return '📱';
      default:
        return '⚠️';
    }
  };

  const renderThreatItem = (threat: RDNAThreatInfo, index: number) => (
    <View key={`${threat.threatId}-${index}`} style={styles.threatItem}>
      <View style={styles.threatHeader}>
        <View style={styles.threatTitleRow}>
          <Text style={styles.threatIcon}>
            {getThreatCategoryIcon(threat.threatCategory)}
          </Text>
          <View style={styles.threatTitleContainer}>
            <Text style={styles.threatName}>{threat.threatName}</Text>
            <Text style={styles.threatCategory}>{threat.threatCategory}</Text>
          </View>
          <View
            style={[
              styles.severityBadge,
              { backgroundColor: getThreatSeverityColor(threat.threatSeverity) },
            ]}
          >
            <Text style={styles.severityText}>{threat.threatSeverity}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.threatContent}>
        <Text style={styles.threatMessage}>{threat.threatMsg}</Text>
        
        {threat.threatReason && Array.isArray(threat.threatReason) && threat.threatReason.length > 0 && (
          <View style={styles.threatDetails}>
            <Text style={styles.detailsLabel}>Technical Details:</Text>
            {threat.threatReason.slice(0, 2).map((reason, idx) => (
              <Text key={idx} style={styles.detailsText}>• {reason}</Text>
            ))}
            {threat.threatReason.length > 2 && (
              <Text style={styles.detailsText}>
                • ... and {threat.threatReason.length - 2} more details
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );

  const handleExitPress = () => {
    Alert.alert(
      'Exit Application',
      'This will close the application due to security threats. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: onExit,
        },
      ],
      { cancelable: false }
    );
  };

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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isConsentMode ? '⚠️ Security Threats Detected' : '🚫 Security Threat - Action Required'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {isConsentMode 
                ? 'Review the detected threats and choose how to proceed'
                : 'Critical security threats detected. Application must exit for safety.'
              }
            </Text>
          </View>

          {/* Threats List */}
          <ScrollView style={styles.threatsContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.threatsHeader}>
              Detected Threats ({threats.length})
            </Text>
            
            {threats.map((threat, index) => renderThreatItem(threat, index))}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {isConsentMode && onProceed && (
              <>
                <TouchableOpacity 
                  style={[styles.proceedButton, isProcessing && styles.buttonDisabled]} 
                  onPress={onProceed}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <View style={styles.buttonLoadingContent}>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={styles.proceedButtonText}>Processing...</Text>
                    </View>
                  ) : (
                    <Text style={styles.proceedButtonText}>Proceed Anyway</Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.exitButton, isProcessing && styles.buttonDisabled]} 
                  onPress={handleExitPress}
                  disabled={isProcessing}
                >
                  {isProcessing && processingExit ? (
                    <View style={styles.buttonLoadingContent}>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={styles.exitButtonText}>Processing Exit...</Text>
                    </View>
                  ) : (
                    <Text style={styles.exitButtonText}>Exit Application</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
            
            {!isConsentMode && (
              <TouchableOpacity 
                style={[styles.exitButtonFull, isProcessing && styles.buttonDisabled]} 
                onPress={handleExitPress}
                disabled={isProcessing}
              >
                {isProcessing && processingExit ? (
                  <View style={styles.buttonLoadingContent}>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text style={styles.exitButtonText}>Processing Exit...</Text>
                  </View>
                ) : (
                  <Text style={styles.exitButtonText}>Exit Application</Text>
                )}
              </TouchableOpacity>
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
    maxHeight: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    backgroundColor: '#dc2626',
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
    color: '#fecaca',
    textAlign: 'center',
    lineHeight: 20,
  },
  threatsContainer: {
    maxHeight: 400,
    padding: 20,
  },
  threatsHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  threatItem: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  threatHeader: {
    marginBottom: 12,
  },
  threatTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  threatIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  threatTitleContainer: {
    flex: 1,
  },
  threatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  threatCategory: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  threatContent: {
    marginTop: 8,
  },
  threatMessage: {
    fontSize: 14,
    color: '#7f1d1d',
    lineHeight: 20,
    marginBottom: 12,
  },
  threatDetails: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  detailsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  detailsText: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  proceedButton: {
    backgroundColor: '#f59e0b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  proceedButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  exitButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  exitButtonFull: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  exitButtonText: {
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

export default ThreatDetectionModal;

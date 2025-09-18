import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface StatusBannerProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  style?: ViewStyle;
}

const StatusBanner: React.FC<StatusBannerProps> = ({
  type,
  message,
  style,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (type) {
      case 'success':
        return styles.successContainer;
      case 'error':
        return styles.errorContainer;
      case 'warning':
        return styles.warningContainer;
      case 'info':
        return styles.infoContainer;
      default:
        return styles.infoContainer;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'success':
        return styles.successText;
      case 'error':
        return styles.errorText;
      case 'warning':
        return styles.warningText;
      case 'info':
        return styles.infoText;
      default:
        return styles.infoText;
    }
  };

  return (
    <View style={[styles.container, getContainerStyle(), style]}>
      <Text style={[styles.text, getTextStyle()]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
  },
  successContainer: {
    backgroundColor: '#f0f8f0',
    borderLeftColor: '#27ae60',
  },
  errorContainer: {
    backgroundColor: '#fff0f0',
    borderLeftColor: '#e74c3c',
  },
  warningContainer: {
    backgroundColor: '#fff3cd',
    borderLeftColor: '#ffc107',
  },
  infoContainer: {
    backgroundColor: '#f0f8ff',
    borderLeftColor: '#3498db',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  successText: {
    color: '#27ae60',
  },
  errorText: {
    color: '#e74c3c',
  },
  warningText: {
    color: '#856404',
  },
  infoText: {
    color: '#3498db',
  },
});

export default StatusBanner;
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type TutorialSuccessNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TutorialSuccess'>;
type TutorialSuccessRouteProp = RouteProp<RootStackParamList, 'TutorialSuccess'>;


const TutorialSuccessScreen: React.FC = () => {
  const navigation = useNavigation<TutorialSuccessNavigationProp>();
  const route = useRoute<TutorialSuccessRouteProp>();
  const { statusCode, statusMessage, sessionId, sessionType } = route.params;

  const getSessionTypeDescription = (type: number): string => {
    const sessionTypes: { [key: number]: string } = {
      0: 'App Session',
      1: 'User Session',
    };

    return sessionTypes[type] || `Session Type ${type}`;
  };

  const formatSessionId = (sessionIdParam: string): string => {
    // Format session ID for better readability
    if (sessionIdParam.length > 16) {
      return `${sessionIdParam.substring(0, 8)}-${sessionIdParam.substring(8, 16)}-${sessionIdParam.substring(16, 24)}...`;
    }
    return sessionIdParam;
  };

  const sessionTypeDescription = getSessionTypeDescription(sessionType);

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Initialization Success!</Text>
        <Text style={styles.subtitle}>react-native-rdna-client Ready</Text>
      </View>

      {/* Success Summary Card */}
      <View style={[styles.card, styles.successCard]}>
        <View style={styles.successHeader}>
          <View style={styles.successBadge}>
            <Text style={styles.successBadgeText}>SUCCESS</Text>
          </View>
          <Text style={styles.successTitle}>react-native-rdna-client plugin initialized successfully</Text>
        </View>

        <View style={styles.successDescription}>
          <Text style={styles.descriptionText}>
            The react-native-rdna-client has been successfully initialized and is ready to use for secure authentication and communication.
          </Text>
        </View>

      </View>

      {/* Session Details Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Session Details</Text>

         <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status Code:</Text>
            <Text style={styles.statusCodeText}>{statusCode}</Text>
        </View>

        <View style={styles.sessionRow}>
            <Text style={styles.sessionLabel}>Session Type:</Text>
            <Text style={styles.sessionValue}>{sessionTypeDescription}</Text>
          </View>

        <View style={styles.sessionContainer}>
          <View style={styles.sessionRow}>
            <Text style={styles.sessionLabel}>Session ID:</Text>
            <View style={styles.sessionIdContainer}>
              <Text style={styles.sessionIdText}>{formatSessionId(sessionId)}</Text>
            </View>
          </View>

        </View>
      </View>

      {/* Next Steps Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>What's Next?</Text>

        <View style={styles.nextStepsContainer}>
          <View style={styles.nextStep}>
            <View style={styles.stepIcon}>
              <Text style={styles.stepIconText}>✓</Text>
            </View>
            <Text style={styles.nextStepText}>react-native-rdna-client is now ready for secure operations</Text>
          </View>

          <View style={styles.nextStep}>
            <View style={styles.stepIcon}>
              <Text style={styles.stepIconText}>🔐</Text>
            </View>
            <Text style={styles.nextStepText}>You can now perform authenticated API calls</Text>
          </View>

          <View style={styles.nextStep}>
            <View style={styles.stepIcon}>
              <Text style={styles.stepIconText}>🚀</Text>
            </View>
            <Text style={styles.nextStepText}>Use the session for secure communication</Text>
          </View>

          <View style={styles.nextStep}>
            <View style={styles.stepIcon}>
              <Text style={styles.stepIconText}>📱</Text>
            </View>
            <Text style={styles.nextStepText}>Continue with your application flow</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#16a34a',
    padding: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#bbf7d0',
  },
  card: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  successCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  successBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  successBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  successDescription: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  statusCodeText: {
    fontSize: 16,
    color: '#166534',
    fontFamily: 'monospace',
  },
  sessionContainer: {
    marginTop: 8,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sessionLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  sessionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'monospace',
  },
  sessionIdContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    marginLeft: 12,
  },
  sessionIdText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  nextStepsContainer: {
    marginTop: 8,
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepIconText: {
    fontSize: 16,
  },
  nextStepText: {
    flex: 1,
    fontSize: 16,
    color: '#4b5563',
  },
});

export default TutorialSuccessScreen;
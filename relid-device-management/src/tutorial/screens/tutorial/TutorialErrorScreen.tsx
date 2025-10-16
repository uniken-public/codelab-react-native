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

type TutorialErrorNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TutorialError'>;
type TutorialErrorRouteProp = RouteProp<RootStackParamList, 'TutorialError'>;


const TutorialErrorScreen: React.FC = () => {
  const navigation = useNavigation<TutorialErrorNavigationProp>();
  const route = useRoute<TutorialErrorRouteProp>();
  const { shortErrorCode, longErrorCode, errorString } = route.params;

  const errorDescription = errorString;

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#dc2626" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Initialization Failed</Text>
        <Text style={styles.subtitle}>Error Details</Text>
      </View>

      {/* Error Summary Card */}
      <View style={[styles.card, styles.errorCard]}>
        <View style={styles.errorHeader}>
          <View style={styles.severityBadge}>
            <Text style={styles.severityText}>ERROR</Text>
          </View>
          <Text style={styles.errorTitle}>react-native-rdna-client Initialization Error</Text>
        </View>
        
        <View style={styles.errorDescription}>
          <Text style={styles.descriptionText}>{errorDescription}</Text>
        </View>
      </View>

      {/* Error Codes Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Error Codes</Text>
        
        <View style={styles.codeContainer}>
          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>Short Error Code:</Text>
            <View style={styles.codeValue}>
              <Text style={styles.codeText}>{shortErrorCode}</Text>
            </View>
          </View>
          
          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>Long Error Code:</Text>
            <View style={styles.codeValue}>
              <Text style={styles.codeText}>{longErrorCode}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Troubleshooting Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Troubleshooting Steps</Text>
        
        <View style={styles.troubleshootingContainer}>
          <View style={styles.troubleshootingStep}>
            <View style={styles.stepBullet} />
             <Text style={styles.troubleshootingText}>Check your network connection</Text>
          </View>
              
          <View style={styles.troubleshootingStep}>
            <View style={styles.stepBullet} />
            <Text style={styles.troubleshootingText}>Verify the connection profile configuration</Text>
          </View>
          
          <View style={styles.troubleshootingStep}>
            <View style={styles.stepBullet} />
            <Text style={styles.troubleshootingText}>Ensure the react-native-rdna-client server is accessible</Text>
          </View>
          
          <View style={styles.troubleshootingStep}>
            <View style={styles.stepBullet} />
            <Text style={styles.troubleshootingText}>Try restarting the application</Text>
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
    backgroundColor: '#dc2626',
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
    color: '#fecaca',
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
  errorCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  severityHigh: {
    backgroundColor: '#dc2626',
  },
  severityMedium: {
    backgroundColor: '#f59e0b',
  },
  severityLow: {
    backgroundColor: '#10b981',
  },
  severityText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  errorDescription: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#7f1d1d',
    lineHeight: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  codeContainer: {
    marginTop: 8,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  codeValue: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'monospace',
  },
  troubleshootingContainer: {
    marginTop: 8,
  },
  troubleshootingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
    marginRight: 12,
  },
  troubleshootingText: {
    flex: 1,
    fontSize: 16,
    color: '#4b5563',
  },
  buttonContainer: {
    margin: 16,
  },
  retryButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TutorialErrorScreen;

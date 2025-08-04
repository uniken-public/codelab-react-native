import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import rdnaService from '../../../uniken/services/rdnaService';
import { getProgressMessage } from '../../../uniken/utils/progressHelper';
import type {
  RDNAProgressData,
  RDNASyncResponse,
  RDNAError,
  RDNAInitializeErrorData
} from '../../../uniken/types/rdnaEvents';

type TutorialHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TutorialHome'>;

const TutorialHomeScreen: React.FC = () => {
  const navigation = useNavigation<TutorialHomeNavigationProp>();
  const [sdkVersion, setSdkVersion] = useState<string>('Loading...');
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [initializeError, setInitializeError] = useState<RDNAInitializeErrorData | null>(null);

  useEffect(() => {
    loadSDKVersion();

    // Register error handler directly in TutorialHomeScreen
    const eventManager = rdnaService.getEventManager();
    eventManager.setInitializeErrorHandler((errorData: RDNAInitializeErrorData) => {
      console.log('TutorialHomeScreen - Received initialize error:', errorData);

      // Update local state
      setIsInitializing(false);
      setProgressMessage('');
      setInitializeError(errorData);

      // Navigate to error screen with the error details
      navigation.navigate('TutorialError', {
        shortErrorCode: errorData.shortErrorCode,
        longErrorCode: errorData.longErrorCode,
        errorString: errorData.errorString,
      });
    });

    return () => {
      // Cleanup - reset handlers
      const eventManager = rdnaService.getEventManager();
      eventManager.setInitializeProgressHandler(undefined);
      eventManager.setInitializeErrorHandler(undefined);
      //rdnaService.cleanup();
      setIsInitializing(false);
      setProgressMessage('');
      setInitializeError(null);
    };
  }, [navigation]);

  const loadSDKVersion = async () => {
    try {
      const version = await rdnaService.getSDKVersion();
      setSdkVersion(version);
    } catch (error) {
      console.error('Failed to load SDK version:', error);
      setSdkVersion('Unknown');
    }
  };

  const handleInitializePress = () => {
    if (isInitializing) return;

    setIsInitializing(true);
    setProgressMessage('Starting RDNA initialization...');

    console.log('TutorialHomeScreen - User clicked Initialize - Starting RDNA...');

    // Register progress handler directly with the event manager
    const eventManager = rdnaService.getEventManager();
    eventManager.setInitializeProgressHandler((data: RDNAProgressData) => {
      console.log('TutorialHomeScreen - Progress update:', data);
      const message = getProgressMessage(data);
      setProgressMessage(message);
    });

    // Call rdnaService.initialize() using .then()/.catch() pattern
    rdnaService.initialize()
      .then((syncResponse: RDNASyncResponse) => {
        console.log('TutorialHomeScreen - RDNA initialization promise resolved successfully');
        console.log('TutorialHomeScreen - Sync response received:', {
          longErrorCode: syncResponse.error?.longErrorCode,
          shortErrorCode: syncResponse.error?.shortErrorCode,
          errorString: syncResponse.error?.errorString
        });

      })
      .catch((error) => {
        console.error('TutorialHomeScreen - RDNA initialization promise rejected:', error);
        setIsInitializing(false);
        setProgressMessage('');

        const result: RDNASyncResponse = error;
       /*
        Error Code: 88 (RDNA_ERR_RDNA_ALREADY_INITIALIZED)
        Terminate the SDK to avoid re-initialization. This helps during development and prevents errors during React Native code refresh.
        Error Code: 179 (RDNA_ERR_INITIALIZE_ALREADY_IN_PROGRESS)
        Avoid invoking the Initialize API again while initialization is already in progress. Wait for the current initialization to complete.
        Error Code: 218 (RDNA_ERR_DEVICE_SECURITY_CHECKS_FAILED_FRIDA_MODULES_DETECTED)
        The SDK detected a Frida attack.
        */

        Alert.alert(
          'Initialization Failed',
          `${result.error.errorString}\n\nError Codes:\nLong: ${result.error.longErrorCode}\nShort: ${result.error.shortErrorCode}`,
          [
            { text: 'OK', style: 'default' }
          ]
        );
      });
  };


  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>REL-ID Integration Tutorial</Text>
        <Text style={styles.subtitle}>Learn react-native-rdna-client plugin Integration</Text>
      </View>

      {/* SDK Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>SDK Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>SDK Version:</Text>
          <Text style={styles.infoValue}>{sdkVersion}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Platform:</Text>
          <Text style={styles.infoValue}>React Native</Text>
        </View>
      </View>

      {/* Tutorial Steps */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tutorial Steps</Text>
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Click "Initialize" to start the initialization</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Watch the initialization progress</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>View the result on completion</Text>
          </View>
        </View>
      </View>

      {/* Initialize Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.initializeButton, isInitializing && styles.initializeButtonDisabled]}
          onPress={handleInitializePress}
          disabled={isInitializing}
        >
          {isInitializing ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.buttonText}>Initializing...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Initialize</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Progress Message - Real-time progress updates */}
      {isInitializing && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {progressMessage || 'RDNA initialization in progress...'}
          </Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This tutorial demonstrates react-native-rdna-client plugin initialization with real-time progress tracking
        </Text>
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
    backgroundColor: '#2563eb',
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
    color: '#bfdbfe',
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
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  stepContainer: {
    marginTop: 8,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#4b5563',
  },
  buttonContainer: {
    margin: 16,
  },
  initializeButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  initializeButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  progressContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  progressText: {
    fontSize: 16,
    color: '#1e40af',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TutorialHomeScreen;

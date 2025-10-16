import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';

/**
 * SecurityExitScreen - iOS-specific HIG-compliant security exit screen
 * 
 * This screen is primarily designed for iOS to provide persistent, accessible
 * exit guidance following Apple's Human Interface Guidelines for critical system states.
 * 
 * Platform behavior:
 * - iOS: Full-screen persistent guidance (HIG-compliant)
 * - Android: May also use this screen, but BackHandler.exitApp() is preferred
 * 
 * This screen is reached when MTDThreatContext.handlePlatformSpecificExit() 
 * detects iOS and navigates here instead of showing simple alerts.
 */
const SecurityExitScreen: React.FC = () => {
  useEffect(() => {
    console.log('SecurityExitScreen: Component mounted - user reached security exit screen');
    console.log('SecurityExitScreen: Platform:', Platform.OS);
    console.log('SecurityExitScreen: This is the iOS-specific HIG-compliant exit screen');
    
    return () => {
      console.log('SecurityExitScreen: Component unmounted');
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🔒</Text>
        <Text style={styles.title}>Security Protection Active</Text>
        <Text style={styles.message}>
          A security threat was detected. For your protection, this application 
          has been secured and must be manually closed.
        </Text>
        
        {Platform.OS === 'ios' && (
          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>How to close the app on iOS:</Text>
            <Text style={styles.instruction}>• Press the home button</Text>
            <Text style={styles.instruction}>• Or swipe up from bottom (newer iPhones)</Text>
            <Text style={styles.instruction}>• Or double-tap home and swipe up on this app</Text>
          </View>
        )}
        
        {Platform.OS === 'android' && (
          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>How to close the app on Android:</Text>
            <Text style={styles.instruction}>• Use the back button or recent apps</Text>
            <Text style={styles.instruction}>• Or press the home button</Text>
          </View>
        )}
        
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ Do not reopen this app until the security issue is resolved.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  instructions: {
    width: '100%',
    marginBottom: 20,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
    paddingLeft: 8,
  },
  warningContainer: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
    width: '100%',
  },
  warningText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default SecurityExitScreen;
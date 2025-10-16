import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import rdnaService from '../../../uniken/services/rdnaService';
import { RDNASyncUtils } from '../../../uniken/types/rdnaEvents';
import type { 
  RDNASyncResponse,
} from '../../../uniken/types/rdnaEvents';

interface DrawerContentProps extends DrawerContentComponentProps {
  userParams?: {
    userID: string;
    sessionID: string;
    sessionType: number;
    jwtToken: string;
    loginTime?: string;
    userRole?: string;
    currentWorkFlow?: string;
  };
}

const DrawerContent: React.FC<DrawerContentProps> = ({ userParams, ...props }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isInitiatingOptIn, setIsInitiatingOptIn] = useState(false);
  const [isInitiatingOptOut, setIsInitiatingOptOut] = useState(false);

  console.log('DrawerContent - Received userParams:', userParams);
  console.log('DrawerContent - userParams.userID:', userParams?.userID);

  const userID = userParams?.userID || 'Unknown User';



  const handleLogOut = () => {
    Alert.alert(
      'Log Off',
      'Are you sure you want to log off?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Off', style: 'destructive', onPress: performLogOut },
      ]
    );
  };

  const performLogOut = async () => {
    setIsLoggingOut(true);
    try {
      console.log('DrawerContent - Initiating logOff for user:', userID);
      
      const syncResponse: RDNASyncResponse = await rdnaService.logOff(userID);
      console.log('DrawerContent - LogOff sync response successful');
      console.log('DrawerContent - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });
      
    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('DrawerContent - LogOff sync error:', error);
      
      // Cast the error back to RDNASyncResponse as per TutorialHomeScreen pattern
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      Alert.alert('Logout Error', errorMessage);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const performBiometricOptIn = async () => {
    setIsInitiatingOptIn(true);
    try {
      console.log('DrawerContent - Initiating biometric opt-in for user:', userID);
      
      const syncResponse: RDNASyncResponse = await rdnaService.initiateIDVBiometricOptIn('User Biometric Enrollment');
      console.log('DrawerContent - InitiateIDVBiometricOptIn sync response successful');
      console.log('DrawerContent - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });
      
      
    } catch (error) {
      console.error('DrawerContent - InitiateIDVBiometricOptIn sync error:', error);
      
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      Alert.alert('Biometric Opt-In Error', `Failed to initiate biometric opt-in: ${errorMessage}`);
    } finally {
      setIsInitiatingOptIn(false);
    }
  };

  const performBiometricOptOut = async () => {
    setIsInitiatingOptOut(true);
    try {
      console.log('DrawerContent - Initiating biometric opt-in for user:', userID);
      
      const syncResponse: RDNASyncResponse = await rdnaService.initiateIDVBiometricOptOut('User Biometric Enrollment');
      console.log('DrawerContent - InitiateIDVBiometricOptIn sync response successful');
      console.log('DrawerContent - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });
      
      
    } catch (error) {
      console.error('DrawerContent - InitiateIDVBiometricOptIn sync error:', error);
      
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      Alert.alert('Biometric Opt-In Error', `Failed to initiate biometric opt-in: ${errorMessage}`);
    } finally {
      setIsInitiatingOptOut(false);
    }
  };

  const executeBiometricOptOut = async () => {
    setIsInitiatingOptOut(true);
    try {
      console.log('DrawerContent - Initiating biometric opt-out for user:', userID);
      
      const syncResponse: RDNASyncResponse = await rdnaService.initiateIDVBiometricOptOut('User Biometric Removal');
      console.log('DrawerContent - InitiateIDVBiometricOptOut sync response successful');
      console.log('DrawerContent - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });
      
      Alert.alert(
        'Biometric Opt-Out',
        'Biometric opt-out process has been completed successfully. Your biometric data has been removed.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('DrawerContent - InitiateIDVBiometricOptOut sync error:', error);
      
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      Alert.alert('Biometric Opt-Out Error', `Failed to initiate biometric opt-out: ${errorMessage}`);
    } finally {
      setIsInitiatingOptOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userID.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{userID}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('Dashboard')}
          >
            <Text style={styles.menuText}>🏠 Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('GetNotifications')}
          >
            <Text style={styles.menuText}>🔔 Get Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={performBiometricOptIn}
            disabled={isInitiatingOptIn}
          >
            {isInitiatingOptIn ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#27ae60" />
                <Text style={[styles.menuText, styles.loadingText]}>🔄 Enabling Biometrics...</Text>
              </View>
            ) : (
              <Text style={styles.menuText}>👤 Biometric Opt-In</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={performBiometricOptOut}
            disabled={isInitiatingOptOut}
          >
            {isInitiatingOptOut ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#e74c3c" />
                <Text style={[styles.menuText, styles.loadingText]}>🔄 Removing Biometrics...</Text>
              </View>
            ) : (
              <Text style={styles.menuText}>🚫 Biometric Opt-Out</Text>
            )}
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogOut}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#e74c3c" />
          ) : (
            <Text style={styles.logoutText}>🚪 Log Off</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menu: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: '#3498db',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 20,
  },
  logoutButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '500',
  },
});

export default DrawerContent;
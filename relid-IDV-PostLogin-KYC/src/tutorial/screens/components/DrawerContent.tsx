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
  RDNAIDVActivatedCustomerKYCResponseData 
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
  const [isInitiatingKYC, setIsInitiatingKYC] = useState(false);

  console.log('DrawerContent - Received userParams:', userParams);
  console.log('DrawerContent - userParams.userID:', userParams?.userID);

  const userID = userParams?.userID || 'Unknown User';

  // Set up event listener for KYC response
  useEffect(() => {
    console.log('DrawerContent - Setting up KYC response event listener');
    
    const eventManager = rdnaService.getEventManager();
    
    const handleKYCResponse = (data: RDNAIDVActivatedCustomerKYCResponseData) => {
      console.log('DrawerContent - Received KYC response:', data);
      console.log('DrawerContent - Error shortErrorCode:', data.error?.shortErrorCode);
      console.log('DrawerContent - Status statusCode:', data.challengeResponse?.status?.statusCode);
      console.log('DrawerContent - KYC Workflow Type:', data.kycWorkflow?.workflowType);
      
      setIsInitiatingKYC(false);
      
      // Following exact reference implementation validation pattern
      // Reference: if (response.error.shortErrorCode == 0 && response.status.statusCode == 100)
      if (data.error?.shortErrorCode == 0 && data.challengeResponse?.status?.statusCode == 100) {
        // Success case - following reference implementation pattern exactly
        // Reference: RdnaErrorUtils.showStatusErrorMessage(response.status, null, callback)
        const statusMessage = data.challengeResponse?.status?.statusMessage || 'Activated customer KYC has been initiated successfully.';
        
        Alert.alert(
          '', // Empty title following reference pattern
          statusMessage,
          [{ 
            text: 'OK',
            onPress: () => {
              // Navigate to Dashboard following reference implementation
              props.navigation.navigate('Dashboard');
            }
          }]
        );
        
      } else if (data.error?.shortErrorCode != 0) {
        // API Error case - following reference implementation pattern exactly
        // Reference: RdnaErrorUtils.showGenericErrorMessage(response.error, null, callback)
        const errorMessage = data.error?.errorString || 'An error occurred during KYC initiation';
        const longErrorCode = data.error?.longErrorCode || 0;
        const shortErrorCode = data.error?.shortErrorCode || 0;
        
        Alert.alert(
          'Error', 
          `${errorMessage}\nError Code: ${longErrorCode} (${shortErrorCode})`,
          [{ 
            text: 'OK',
            onPress: () => {
              // Navigate to Dashboard following reference implementation
              props.navigation.navigate('Dashboard');
            }
          }]
        );
        
      } else if (data.challengeResponse?.status?.statusCode != 100) {
        // Status Error case - following reference implementation pattern exactly
        // Reference: RdnaErrorUtils.showStatusErrorMessage(response.status, response, callback)
        const statusMessage = data.challengeResponse?.status?.statusMessage || 'KYC process failed with status error';
        
        Alert.alert(
          '', // Empty title following reference pattern
          statusMessage,
          [{ 
            text: 'OK',
            onPress: () => {
              // Navigate to Dashboard following reference implementation
              props.navigation.navigate('Dashboard');
            }
          }]
        );
      }
    };
    
    eventManager.setIDVActivatedCustomerKYCResponseHandler(handleKYCResponse);
    
    // Cleanup on unmount
    return () => {
      console.log('DrawerContent - Cleaning up KYC response event listener');
      eventManager.setIDVActivatedCustomerKYCResponseHandler(undefined);
    };
  }, []);

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

  const performActivatedCustomerKYC = async () => {
    setIsInitiatingKYC(true);
    try {
      console.log('DrawerContent - Initiating activated customer KYC for user:', userID);
      
      const syncResponse: RDNASyncResponse = await rdnaService.initiateActivatedCustomerKYC('Post Login KYC');
      console.log('DrawerContent - InitiateActivatedCustomerKYC sync response successful');
      console.log('DrawerContent - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });
      
      // Success - the actual KYC response will be handled by the event listener
      console.log('DrawerContent - KYC API call successful, waiting for onIDVActivatedCustomerKYCResponse event');
      
    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('DrawerContent - InitiateActivatedCustomerKYC sync error:', error);
      
      // Cast the error back to RDNASyncResponse as per existing pattern
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      Alert.alert('KYC Error', `Failed to initiate KYC process: ${errorMessage}`);
      setIsInitiatingKYC(false); // Only reset loading state on sync error
    }
    // Note: Don't set isInitiatingKYC to false here - let the event handler do it
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
            onPress={performActivatedCustomerKYC}
            disabled={isInitiatingKYC}
          >
            {isInitiatingKYC ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#3498db" />
                <Text style={[styles.menuText, styles.loadingText]}>🔄 Initiating KYC...</Text>
              </View>
            ) : (
              <Text style={styles.menuText}>📋 Activated customer KYC</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('IDVConfigSettings')}
          >
            <Text style={styles.menuText}>⚙️ IDV Settings</Text>
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
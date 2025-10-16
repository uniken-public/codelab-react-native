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
  RDNAIDVAdditionalDocumentScanData
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
  const [isInitiatingAdditionalDocScan, setIsInitiatingAdditionalDocScan] = useState(false);

  console.log('DrawerContent - Received userParams:', userParams);
  console.log('DrawerContent - userParams.userID:', userParams?.userID);

  const userID = userParams?.userID || 'Unknown User';

  // Set up event listener for Additional Document Scan response
  useEffect(() => {
    console.log('🎯 DrawerContent - Setting up additional document scan state handler');
    
    const eventManager = rdnaService.getEventManager();
    
    // Instead of overriding the main handler, we'll create a wrapper that calls both
    const existingHandler = eventManager['idvAdditionalDocumentScanHandler'];
    
    const combinedHandler = (data: RDNAIDVAdditionalDocumentScanData) => {
      console.log('🎯 DrawerContent - Additional document scan response received, updating state');
      setIsInitiatingAdditionalDocScan(false);
      
      // Call the existing handler (SDKEventProvider navigation)
      if (existingHandler) {
        console.log('🎯 DrawerContent - Calling existing navigation handler');
        existingHandler(data);
      }
    };
    
    // Set the combined handler
    eventManager.setIDVAdditionalDocumentScanHandler(combinedHandler);
    
    // Cleanup on unmount
    return () => {
      console.log('🎯 DrawerContent - Cleaning up combined event handler');
      // Restore original handler if it existed
      if (existingHandler) {
        eventManager.setIDVAdditionalDocumentScanHandler(existingHandler);
      } else {
        eventManager.setIDVAdditionalDocumentScanHandler(undefined);
      }
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


  const performAdditionalDocumentScan = async () => {
    setIsInitiatingAdditionalDocScan(true);
    try {
      console.log('DrawerContent - Initiating additional document scan for user:', userID);
      
      const syncResponse: RDNASyncResponse = await rdnaService.initiateIDVAdditionalDocumentScan('Additional Document Verification');
      console.log('DrawerContent - InitiateIDVAdditionalDocumentScan sync response successful');
      console.log('DrawerContent - Sync response received:', {
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      });
      
      // Success - the actual additional document scan response will be handled by the event listener
      console.log('DrawerContent - Additional document scan API call successful, waiting for onIDVAdditionalDocumentScan event');
      
    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('DrawerContent - InitiateIDVAdditionalDocumentScan sync error:', error);
      
      // Cast the error back to RDNASyncResponse as per existing pattern
      const result: RDNASyncResponse = error as RDNASyncResponse;
      const errorMessage = RDNASyncUtils.getErrorMessage(result);
      
      Alert.alert('Additional Document Scan Error', `Failed to initiate additional document scan process: ${errorMessage}`);
      setIsInitiatingAdditionalDocScan(true); // Only reset loading state on sync error
    }
    // Note: Don't set isInitiatingAdditionalDocScan to false here - let the event handler do it
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
            onPress={performAdditionalDocumentScan}
            disabled={isInitiatingAdditionalDocScan}
          >
            {isInitiatingAdditionalDocScan ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#3498db" />
                <Text style={[styles.menuText, styles.loadingText]}>🔄 Initiating Document Scan...</Text>
              </View>
            ) : (
              <Text style={styles.menuText}>📄 Additional Document Scan</Text>
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
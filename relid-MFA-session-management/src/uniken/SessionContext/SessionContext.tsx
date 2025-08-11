import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Alert } from 'react-native';
import rdnaService from '../services/rdnaService';
import SessionModal from '../components/modals/SessionModal';
import NavigationService from '../../tutorial/navigation/NavigationService';
import type {
  RDNASessionTimeoutData,
  RDNASessionTimeoutNotificationData,
  RDNASessionExtensionResponseData,
  RDNASyncResponse
} from '../types/rdnaEvents';

interface SessionState {
  // Modal visibility and data
  isSessionModalVisible: boolean;
  sessionTimeoutData?: RDNASessionTimeoutData;
  sessionTimeoutNotificationData?: RDNASessionTimeoutNotificationData;
  isProcessing: boolean;

  // Session management methods
  showSessionTimeout: (data: RDNASessionTimeoutData) => void;
  showSessionTimeoutNotification: (data: RDNASessionTimeoutNotificationData) => void;
  hideSessionModal: () => void;
  handleExtendSession: () => void;
  handleDismiss: () => void;
}

const SessionContext = createContext<SessionState | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [isSessionModalVisible, setIsSessionModalVisible] = useState(false);
  const [sessionTimeoutData, setSessionTimeoutData] = useState<RDNASessionTimeoutData | undefined>();
  const [sessionTimeoutNotificationData, setSessionTimeoutNotificationData] = useState<RDNASessionTimeoutNotificationData | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);

  // Ref to track current session operation to avoid conflicts
  const currentOperationRef = useRef<'none' | 'extend'>('none');

  useEffect(() => {
    const eventManager = rdnaService.getEventManager();

    // Set up session event handlers
    eventManager.setSessionTimeoutHandler((data: RDNASessionTimeoutData) => {
      console.log('SessionProvider - Session timeout received:', data);
      showSessionTimeout(data);
    });

    eventManager.setSessionTimeoutNotificationHandler((data: RDNASessionTimeoutNotificationData) => {
      console.log('SessionProvider - Session timeout notification received:', {
        userID: data.userID,
        timeLeft: data.timeLeftInSeconds,
        canExtend: data.sessionCanBeExtended === 1
      });
      showSessionTimeoutNotification(data);
    });

    eventManager.setSessionExtensionResponseHandler((data: RDNASessionExtensionResponseData) => {
      console.log('SessionProvider - Session extension response received:', {
        statusCode: data.status.statusCode,
        statusMessage: data.status.statusMessage,
        errorCode: data.error.longErrorCode,
        errorString: data.error.errorString
      });

      // Handle extension response
      handleSessionExtensionResponse(data);
    });

    return () => {
      // Cleanup handlers
      eventManager.setSessionTimeoutHandler(undefined);
      eventManager.setSessionTimeoutNotificationHandler(undefined);
      eventManager.setSessionExtensionResponseHandler(undefined);
      console.log('SessionProvider cleanup');
    };
  }, []);

  const showSessionTimeout = (data: RDNASessionTimeoutData) => {
    console.log('SessionProvider - Session timed out, showing modal');
    
    // Show session timeout modal with just OK button
    setSessionTimeoutData(data);
    setSessionTimeoutNotificationData(undefined);
    setIsSessionModalVisible(true);
    setIsProcessing(false);
    currentOperationRef.current = 'none';
  };

  const showSessionTimeoutNotification = (data: RDNASessionTimeoutNotificationData) => {
    console.log('SessionProvider - Showing session timeout notification modal');
    setSessionTimeoutNotificationData(data);
    setSessionTimeoutData(undefined);
    setIsSessionModalVisible(true);
    setIsProcessing(false);
    currentOperationRef.current = 'none';
  };

  const hideSessionModal = () => {
    console.log('SessionProvider - Hiding session modal');
    setIsSessionModalVisible(false);
    setSessionTimeoutData(undefined);
    setSessionTimeoutNotificationData(undefined);
    setIsProcessing(false);
    currentOperationRef.current = 'none';
  };


  const handleExtendSession = async () => {
    console.log('SessionProvider - User chose to extend session');
    
    if (currentOperationRef.current !== 'none') {
      console.log('SessionProvider - Operation already in progress, ignoring extend request');
      return;
    }

    setIsProcessing(true);
    currentOperationRef.current = 'extend';

    try {
      // Call extend session API
      await rdnaService.extendSessionIdleTimeout();
      console.log('SessionProvider - Session extension API called successfully');
      
      // Note: We don't hide the modal immediately as we're waiting for onSessionExtensionResponse
      // The response handler will determine success/failure and take appropriate action
    } catch (error) {
      console.error('SessionProvider - Session extension failed:', error);
      setIsProcessing(false);
      currentOperationRef.current = 'none';
      
      const result: RDNASyncResponse = error as RDNASyncResponse;
      Alert.alert(
        'Extension Failed',
        `Failed to extend session:\n${result.error.errorString}\n\nError Code: ${result.error.longErrorCode}`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleDismiss = () => {
    console.log('SessionProvider - User dismissed session modal');
    
    // Always hide modal first
    hideSessionModal();
    
    // For hard session timeout (mandatory), navigate to home screen
    if (sessionTimeoutData) {
      console.log('SessionProvider - Hard session timeout - navigating to home screen');
      NavigationService.reset('TutorialHome');
    }
    
    // For session timeout notification, just dismiss - user chose to let it expire
    if (sessionTimeoutNotificationData) {
      console.log('SessionProvider - User chose to let idle session expire');
    }
  };

  const handleSessionExtensionResponse = (data: RDNASessionExtensionResponseData) => {
    console.log('SessionProvider - Processing session extension response');
    
    // Only process if we're currently extending
    if (currentOperationRef.current !== 'extend') {
      console.log('SessionProvider - Extension response received but no extend operation in progress, ignoring');
      return;
    }

    const isSuccess = data.error.longErrorCode === 0 && data.status.statusCode === 100;
    
    if (isSuccess) {
      console.log('SessionProvider - Session extension successful');
      hideSessionModal();
    } else {
      console.log('SessionProvider - Session extension failed:', {
        statusCode: data.status.statusCode,
        statusMessage: data.status.statusMessage,
        errorCode: data.error.longErrorCode,
        errorString: data.error.errorString
      });
      
      setIsProcessing(false);
      currentOperationRef.current = 'none';
      
      const errorMessage = data.error.longErrorCode !== 0 
        ? data.error.errorString 
        : data.status.statusMessage;
      
      Alert.alert(
        'Extension Failed',
        `Failed to extend session:\n${errorMessage}`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const contextValue: SessionState = {
    isSessionModalVisible,
    sessionTimeoutData,
    sessionTimeoutNotificationData,
    isProcessing,
    showSessionTimeout,
    showSessionTimeoutNotification,
    hideSessionModal,
    handleExtendSession,
    handleDismiss,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}

      {/* Global Session Management Modal */}
      <SessionModal
        visible={isSessionModalVisible}
        sessionTimeoutData={sessionTimeoutData}
        sessionTimeoutNotificationData={sessionTimeoutNotificationData}
        isProcessing={isProcessing}
        onExtendSession={handleExtendSession}
        onDismiss={handleDismiss}
      />
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionState => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export default SessionProvider;
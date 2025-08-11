import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { BackHandler, Alert, Platform } from 'react-native';
import rdnaService from '../services/rdnaService';
import ThreatDetectionModal from '../components/modals/ThreatDetectionModal';
// Note: showIOSExitGuidance is now deprecated - iOS uses SecurityExitScreen directly
import NavigationService from '../../tutorial/navigation/NavigationService';
import type {
  RDNAThreatInfo,
  RDNAUserConsentThreatsData,
  RDNATerminateWithThreatsData,
  RDNASyncResponse
} from '../types/rdnaEvents';

interface MTDThreatState {
  isModalVisible: boolean;
  threats: RDNAThreatInfo[];
  isConsentMode: boolean;
  isProcessing: boolean;
  showThreatModal: (threats: RDNAThreatInfo[], isConsent: boolean) => void;
  hideThreatModal: () => void;
  handleProceed: () => void;
  handleExit: () => void;
}


const MTDThreatContext = createContext<MTDThreatState | undefined>(undefined);

interface MTDThreatProviderProps {
  children: ReactNode;
}

export const MTDThreatProvider: React.FC<MTDThreatProviderProps> = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [threats, setThreats] = useState<RDNAThreatInfo[]>([]);
  const [isConsentMode, setIsConsentMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Platform-specific security exit handler
  const handlePlatformSpecificExit = (exitType: 'self-triggered' | 'terminate') => {
    console.log('MTDThreatContext: Platform-specific exit called', { 
      platform: Platform.OS, 
      exitType 
    });

    if (Platform.OS === 'ios') {
      console.log('MTDThreatContext: iOS detected - navigating to SecurityExitScreen');
      // iOS: Navigate to SecurityExitScreen for HIG-compliant exit guidance
      NavigationService.reset('SecurityExit');
    } else {
      console.log('MTDThreatContext: Non-iOS platform - using BackHandler.exitApp()');
      // Android and other platforms: Use direct app exit
      try {
        BackHandler.exitApp();
        console.log('MTDThreatContext: BackHandler.exitApp() called successfully');
      } catch (error) {
        console.error('MTDThreatContext: Failed to exit app on platform:', Platform.OS, error);
      }
    }
  };
  
  // State to track pending exit actions to differentiate between self-triggered and genuine terminateWithThreats events
  // This helps avoid showing the threat dialog twice when user chooses to exit in consent mode
  const [pendingExitThreats, setPendingExitThreats] = useState<string[]>([]);
  
  // Use ref to ensure the callback always has access to the latest pendingExitThreats value
  // This fixes the closure issue where the callback was using stale state
  const pendingExitThreatsRef = useRef<string[]>([]);
  
  // Keep ref in sync with state
  useEffect(() => {
    pendingExitThreatsRef.current = pendingExitThreats;
  }, [pendingExitThreats]);

  useEffect(() => {
    // Override default threat handlers with MTD-specific logic
    const eventManager = rdnaService.getEventManager();

    // Override threat handlers with MTD-specific logic
    eventManager.setUserConsentThreatsHandler((data: RDNAUserConsentThreatsData) => {
      console.log('MTDThreatProvider - User consent threats received:', data.threats.length);
      showThreatModal(data.threats, true);
    });

    eventManager.setTerminateWithThreatsHandler((data: RDNATerminateWithThreatsData) => {
      console.log('MTDThreatProvider - Terminate with threats received:', data.threats.length);
        
        // Check if this is a self-triggered terminate event (result of our own takeActionOnThreats call)
        // by comparing incoming threat IDs with the ones we're currently processing for exit
        const incomingThreatIds = data.threats.map(threat => threat.threatId);
        const currentPendingThreats = pendingExitThreatsRef.current;
        console.log('Threat comparison debug:', {
          pendingExitThreats: currentPendingThreats,
          incomingThreatIds,
          pendingLength: currentPendingThreats.length,
          incomingLength: incomingThreatIds.length,
          everyMatch: incomingThreatIds.every(id => currentPendingThreats.includes(id)),
          isSelfTriggered: currentPendingThreats.length > 0 && 
            incomingThreatIds.every(id => currentPendingThreats.includes(id)) &&
            incomingThreatIds.length === currentPendingThreats.length
        });
        
        const isSelfTriggered = currentPendingThreats.length > 0 && 
          incomingThreatIds.every(id => currentPendingThreats.includes(id)) &&
          incomingThreatIds.length === currentPendingThreats.length;

        if (isSelfTriggered) {
          console.log('Self-triggered terminate event - exiting directly without showing dialog');
          // Clear pending state since we're handling the exit now
          setPendingExitThreats([]);
          setIsProcessing(false);
          hideThreatModal();
          
          // Direct app termination - user already made the decision in consent mode
          console.log('MTDThreatContext: Self-triggered terminate event - processing exit');
          handlePlatformSpecificExit('self-triggered');
        } else {
          console.log('Genuine terminate event - showing dialog for user action');
          // Genuine terminate event from external source - show dialog as normal
          setIsProcessing(false);
          showThreatModal(data.threats, false);
        }
      });

    return () => {
      // Cleanup pending exit tracking state
      setPendingExitThreats([]);
      pendingExitThreatsRef.current = [];
      console.log('MTDThreatProvider cleanup');
    };
  }, []);

  const showThreatModal = (threatList: RDNAThreatInfo[], isConsent: boolean) => {
    console.log('Showing threat modal:', {
      threatCount: threatList.length,
      isConsentMode: isConsent,
      threats: threatList.map(t => ({ name: t.threatName, severity: t.threatSeverity }))
    });

    setThreats(threatList);
    setIsConsentMode(isConsent);
    setIsModalVisible(true);
  };

  const hideThreatModal = () => {
    console.log('Hiding threat modal');
    setIsModalVisible(false);
    setThreats([]);
    setIsConsentMode(false);
    setIsProcessing(false);
  };

  const handleProceed = () => {
    
    console.log('User chose to proceed with threats');
    setIsProcessing(true);

    // Modify all threats to proceed with action
    // This implementation chooses to proceed with all threats and remember the decision
    const modifiedThreats = threats.map(threat => ({
        ...threat,
        shouldProceedWithThreats: true,    // Allow app to continue despite threats
        rememberActionForSession: true,    // Remember this decision for the current session
        // Convert threatReason array to string if it exists (API requirement)
        threatReason: Array.isArray(threat.threatReason)
        ? threat.threatReason.join(',')
        : threat.threatReason
    }));  

    // Convert to JSON string as expected by the API
    const threatsJsonString = JSON.stringify(modifiedThreats);
    console.log('JSON string being sent to API:', threatsJsonString);
  
    // Call RdnaService to take action on threats
    rdnaService.takeActionOnThreats(threatsJsonString)
    .then(() => {
        console.log('RDNA initialization promise resolved successfully');
        // Success will be handled by the async event callbacks
        // Don't need to do anything here as events will navigate to success screen
        hideThreatModal();
    })
    .catch((error) => {
      setIsProcessing(false);
      Alert.alert(
      `Failed to proceed with threats`,
      `${error.errorString}\n\nError Codes:\nLong: ${error.longErrorCode}\nShort: ${error.shortErrorCode}`,
      [
        { text: 'OK', style: 'default' }
      ]
      );
    });
  };

  const handleExit = () => {
    console.log('User chose to exit application due to threats');

    if (isConsentMode) {
      console.log('Consent mode: calling takeAction with shouldProceedWithThreats = false');
      setIsProcessing(true);

      // Track threat IDs for pending exit to identify self-triggered terminateWithThreats events
      // This prevents showing the threat dialog twice when the API call triggers terminateWithThreats
      const threatIds = threats.map(threat => threat.threatId);
      setPendingExitThreats(threatIds);
      console.log('Tracking pending exit for threat IDs:', threatIds);

      // Modify all threats to NOT proceed with action
      const modifiedThreats = threats.map(threat => ({
        ...threat,
        shouldProceedWithThreats: false,    // Do not allow app to continue with threats
        rememberActionForSession: true,     // Remember this decision for the current session
        // Convert threatReason array to string if it exists (API requirement)
        threatReason: Array.isArray(threat.threatReason)
          ? threat.threatReason.join(',')
          : threat.threatReason
      }));

      // Convert to JSON string as expected by the API
      const threatsJsonString = JSON.stringify(modifiedThreats);
      console.log('JSON string being sent to API for exit action:', threatsJsonString);

      // Call RdnaService to take action on threats (required for tracking purposes)
      // This will trigger a terminateWithThreats event which we'll handle differently
      rdnaService.takeActionOnThreats(threatsJsonString)
        .then(() => {
          console.log('RDNA takeAction promise resolved - threats rejected, awaiting terminateWithThreats event');
          // The terminateWithThreats event will be handled by the callback
          // and should directly exit without showing dialog since we're tracking this as pending
        })
        .catch((error) => {
          // Clear pending state on error
          const result: RDNASyncResponse = error;
          setPendingExitThreats([]);
          setIsProcessing(false);
          console.error('Failed to take action on threats:', error);
          Alert.alert(
            `Failed to process threat action`,
            `${result.error.errorString}\n\nError Codes:\nLong: ${result.error.longErrorCode}\nShort: ${result.error.shortErrorCode}`,
            [
              { text: 'OK', style: 'default' }
            ]
          );
        });
    } else {
      console.log('MTDThreatContext: Terminate mode - directly exiting application');
      // Direct exit for terminate mode (genuine terminate events)
      handlePlatformSpecificExit('terminate');
      // On non-iOS platforms, if exit fails, hide the modal as fallback
      if (Platform.OS !== 'ios') {
        hideThreatModal();
      }
    }
  };

  const contextValue: MTDThreatState = {
    isModalVisible,
    threats,
    isConsentMode,
    isProcessing,
    showThreatModal,
    hideThreatModal,
    handleProceed,
    handleExit,
  };

  return (
    <MTDThreatContext.Provider value={contextValue}>
      {children}

      {/* Global MTD Threat Detection Modal */}
      <ThreatDetectionModal
        visible={isModalVisible}
        threats={threats}
        isConsentMode={isConsentMode}
        isProcessing={isProcessing}
        processingExit={pendingExitThreats.length > 0} // Indicates we're processing an exit action
        onProceed={isConsentMode ? handleProceed : undefined}
        onExit={handleExit}
      />
    </MTDThreatContext.Provider>
  );
};

export const useMTDThreat = (): MTDThreatState => {
  const context = useContext(MTDThreatContext);
  if (context === undefined) {
    throw new Error('useMTDThreat must be used within an MTDThreatProvider');
  }
  return context;
};

export default MTDThreatProvider;

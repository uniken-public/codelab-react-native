/**
 * SDK Event Provider
 * 
 * Centralized React Context provider for REL-ID SDK event handling.
 * Manages all SDK events, screen state, and navigation logic in one place.
 * 
 * Key Features:
 * - Consolidated event handling for all SDK events
 * - Screen state management for active screen tracking
 * - Response routing to appropriate screens
 * - Navigation logic for different event types
 * - React lifecycle integration
 * 
 * Usage:
 * ```typescript
 * <SDKEventProvider>
 *   <YourApp />
 * </SDKEventProvider>
 * ```
 */

import React, { createContext, useContext, useEffect, useCallback, ReactNode, useState } from 'react';
import { Alert } from 'react-native';
import rdnaService from '../services/rdnaService';
import NavigationService from '../../tutorial/navigation/NavigationService';
import type {
  RDNAInitializedData,
  RDNAGetUserData,
  RDNAGetActivationCodeData,
  RDNAGetUserConsentForLDAData,
  RDNAGetPasswordData,
  RDNAUserLoggedInData,
  RDNAUserLoggedOffData,
  RDNACredentialsAvailableForUpdateData,
  RDNAUpdateCredentialResponseData,
  RDNAAddNewDeviceOptionsData,
  RDNAGetIDVSelfieProcessStartConfirmationData
} from '../types/rdnaEvents';

/**
 * SDK Event Context Interface - Simplified for direct navigation approach
 */
interface SDKEventContextType {
  availableCredentials: string[];
}


/**
 * SDK Event Context
 */
const SDKEventContext = createContext<SDKEventContextType | undefined>(undefined);

/**
 * SDK Event Provider Props
 */
interface SDKEventProviderProps {
  children: ReactNode;
}

/**
 * SDK Event Provider Component
 */
export const SDKEventProvider: React.FC<SDKEventProviderProps> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);
  const [availableCredentials, setAvailableCredentials] = useState<string[]>([]);

  /**
   * Event handler for successful initialization
   */
  const handleInitialized = useCallback((data: RDNAInitializedData) => {
    console.log('SDKEventProvider - Successfully initialized, Session ID:', data.session.sessionID);
    //In the MFA (Multi-Factor Authentication) flow, there is no need to explicitly handle this event. 
    //When this event is triggered, the SDK will automatically invoke one of the following methods—getUser, getActivationCode, or getPassword—depending on the user state and the current state of the SDK.
  }, []);

  /**
   * Event handler for get user requests
   */
  const handleGetUser = useCallback((data: RDNAGetUserData) => {
    console.log('SDKEventProvider - Get user event received, status:', data.challengeResponse.status.statusCode);
    
    // Use navigateOrUpdate to prevent duplicate screens and update existing screen with new event data
    NavigationService.navigateOrUpdate('CheckUserScreen', {
      eventData: data,
      inputType: 'text',
      title: 'Set User',
      subtitle: 'Enter your username to continue',
      placeholder: 'Enter your username',
      buttonText: 'Set User',
      // Pass response data directly
      responseData: data,
    });
  }, []);

  /**
   * Event handler for get activation code requests
   */
  const handleGetActivationCode = useCallback((data: RDNAGetActivationCodeData) => {
    console.log('SDKEventProvider - Get activation code event received, status:', data.challengeResponse.status.statusCode);
    console.log('SDKEventProvider - UserID:', data.userID, 'AttemptsLeft:', data.attemptsLeft);
    
    // Use navigateOrUpdate to prevent duplicate screens and update existing screen with new event data
    NavigationService.navigateOrUpdate('ActivationCodeScreen', {
      eventData: data,
      inputType: 'text',
      title: 'Enter Activation Code',
      subtitle: `Enter the activation code for user: ${data.userID}`,
      placeholder: 'Enter activation code',
      buttonText: 'Verify Code',
      attemptsLeft: data.attemptsLeft,
      // Pass response data directly
      responseData: data,
    });
  }, []);

  /**
   * Event handler for get user consent for LDA requests
   */
  const handleGetUserConsentForLDA = useCallback((data: RDNAGetUserConsentForLDAData) => {
    console.log('SDKEventProvider - Get user consent for LDA event received, status:', data.challengeResponse.status.statusCode);
    console.log('SDKEventProvider - UserID:', data.userID, 'ChallengeMode:', data.challengeMode, 'AuthenticationType:', data.authenticationType);
    
    // Use navigateOrUpdate to prevent duplicate screens and update existing screen with new event data
    NavigationService.navigateOrUpdate('UserLDAConsentScreen', {
      eventData: data,
      title: 'Local Device Authentication Consent',
      subtitle: `Grant permission for device authentication for user: ${data.userID}`,
      // Pass response data directly
      responseData: data,
    });
  }, []);

  /**
   * Event handler for get password requests
   */
  const handleGetPassword = useCallback((data: RDNAGetPasswordData) => {
    console.log('SDKEventProvider - Get password event received, status:', data.challengeResponse.status.statusCode);
    console.log('SDKEventProvider - UserID:', data.userID, 'ChallengeMode:', data.challengeMode, 'AttemptsLeft:', data.attemptsLeft);

    // Navigate to appropriate screen based on challengeMode
    if (data.challengeMode === 0) {
      // challengeMode = 0: Verify existing password
      NavigationService.navigateOrUpdate('VerifyPasswordScreen', {
        eventData: data,
        title: 'Verify Password',
        subtitle: `Enter your password to continue`,
        userID: data.userID,
        challengeMode: data.challengeMode,
        attemptsLeft: data.attemptsLeft,
        responseData: data,
      });
    } else if (data.challengeMode === 2) {
      // challengeMode = 2: Update password (RDNA_OP_UPDATE_CREDENTIALS)
      // Navigate within drawer navigator to UpdatePassword screen
      NavigationService.navigateOrUpdate('DrawerNavigator', {
        screen: 'UpdatePassword',
        params: {
          eventName: 'getPassword',
          eventData: data,
          responseData: data,
        }
      });
    } else if (data.challengeMode === 4) {
      // challengeMode = 4: Update expired password (RDNA_OP_UPDATE_ON_EXPIRY)
      // Extract status message from response (e.g., "Password has expired. Please contact the admin.")
      const statusMessage = data.challengeResponse?.status?.statusMessage || 'Your password has expired. Please update it to continue.';

      NavigationService.navigateOrUpdate('UpdateExpiryPasswordScreen', {
        eventData: data,
        title: 'Update Expired Password',
        subtitle: statusMessage,
        responseData: data,
      });
    } else {
      // challengeMode = 1: Set new password
      NavigationService.navigateOrUpdate('SetPasswordScreen', {
        eventData: data,
        title: 'Set Password',
        subtitle: `Create a secure password for user: ${data.userID}`,
        responseData: data,
      });
    }
  }, []);

  /**
   * Event handler for user logged in event
   */
  const handleUserLoggedIn = useCallback(async (data: RDNAUserLoggedInData) => {
    console.log('SDKEventProvider - User logged in event received for user:', data.userID);
    console.log('SDKEventProvider - Session ID:', data.challengeResponse.session.sessionID);
    console.log('SDKEventProvider - Current workflow:', data.challengeResponse.additionalInfo.currentWorkFlow);

    // Extract session and JWT information
    const sessionID = data.challengeResponse.session.sessionID;
    const sessionType = data.challengeResponse.session.sessionType;
    const additionalInfo = data.challengeResponse.additionalInfo;
    const jwtToken = additionalInfo.jwtJsonTokenInfo;
    const userRole = additionalInfo.idvUserRole;
    const currentWorkFlow = additionalInfo.currentWorkFlow;

    // Navigate to DrawerNavigator with all session data
    const navigationParams = {
      userID: data.userID,
      sessionID,
      sessionType,
      jwtToken,
      loginTime: new Date().toLocaleString(),
      userRole,
      currentWorkFlow,
    };

    console.log('SDKEventProvider - Navigating to DrawerNavigator with params:', navigationParams);

    NavigationService.navigate('DrawerNavigator', {
      screen: 'Dashboard',
      params: navigationParams
    });

    // After successful login, call getAllChallenges to check available credential updates
    try {
      console.log('SDKEventProvider - Calling getAllChallenges after login for user:', data.userID);
      await rdnaService.getAllChallenges(data.userID);
      console.log('SDKEventProvider - getAllChallenges called successfully, waiting for onCredentialsAvailableForUpdate event');
    } catch (error) {
      console.error('SDKEventProvider - getAllChallenges failed:', error);
    }
  }, []);

  /**
   * Event handler for user logged off event
   */
  const handleUserLoggedOff = useCallback((data: RDNAUserLoggedOffData) => {
    console.log('SDKEventProvider - User logged off event received for user:', data.userID);
    console.log('SDKEventProvider - Session ID:', data.challengeResponse.session.sessionID);
    
    // Log the event as requested - no further action needed
    // The getUser event will be triggered automatically by the SDK and handled by existing logic
  }, []);

  /**
   * Event handler for credentials available for update event
   */
  const handleCredentialsAvailableForUpdate = useCallback((data: RDNACredentialsAvailableForUpdateData) => {
    console.log('SDKEventProvider - Credentials available for update event received for user:', data.userID);
    console.log('SDKEventProvider - Available options:', data.options);

    // Store available credentials for drawer menu to use
    setAvailableCredentials(data.options);
  }, []);

  /**
   * Event handler for update credential response event
   * Note: This is a fallback handler. UpdatePasswordScreen sets its own handler when mounted.
   */
  const handleUpdateCredentialResponse = useCallback((data: RDNAUpdateCredentialResponseData) => {
    console.log('SDKEventProvider - Update credential response event received (fallback handler):', {
      userID: data.userID,
      credType: data.credType,
      statusCode: data.status.statusCode,
      statusMessage: data.status.statusMessage
    });

    // This is a fallback handler in case the screen-specific handler is not set
    // Normally, UpdatePasswordScreen should handle this when it's open
  }, []);

  /**
   * Event handler for add new device options event
   */
  const handleAddNewDeviceOptions = useCallback((data: RDNAAddNewDeviceOptionsData) => {
    console.log('SDKEventProvider - Add new device options event received for user:', data.userID);
    console.log('SDKEventProvider - Available options:', data.newDeviceOptions);
    console.log('SDKEventProvider - Challenge info count:', data.challengeInfo.length);

    // Use navigateOrUpdate to prevent duplicate screens and update existing screen with new event data
    NavigationService.navigateOrUpdate('VerifyAuthScreen', {
      eventName: 'addNewDeviceOptions',
      eventData: data,
      title: 'Additional Device Activation',
      subtitle: `Activate this device for user: ${data.userID}`,
      // Pass response data directly
      responseData: data,
    });
  }, []);

  /**
   * Event handler for IDV selfie process start confirmation
   */
  const handleGetIDVSelfieProcessStartConfirmation = useCallback((data: RDNAGetIDVSelfieProcessStartConfirmationData) => {
    console.log('SDKEventProvider - Get IDV selfie process start confirmation event received');
    console.log('SDKEventProvider - IDV Workflow:', data.idvWorkflow);
    console.log('SDKEventProvider - Use back camera:', data.useDeviceBackCamera);
    console.log('SDKEventProvider - Challenge status:', data.challengeResponse.status.statusCode);

    // Use navigateOrUpdate to prevent duplicate screens and update existing screen with new event data
    NavigationService.navigateOrUpdate('IDVSelfieProcessStartConfirmationScreen', {
      eventName: 'getIDVSelfieProcessStartConfirmation',
      eventData: data,
      title: 'IDV Selfie Capture',
      subtitle: 'Prepare to capture your selfie for identity verification',
      // Pass response data directly
      responseData: data,
    });
  }, []);


  /**
   * Set up SDK Event Subscriptions on mount
   */
  useEffect(() => {
    const eventManager = rdnaService.getEventManager();
    
    // Original MFA event handlers
    eventManager.setInitializedHandler(handleInitialized);
    eventManager.setGetUserHandler(handleGetUser);
    eventManager.setGetActivationCodeHandler(handleGetActivationCode);
    eventManager.setGetUserConsentForLDAHandler(handleGetUserConsentForLDA);
    eventManager.setGetPasswordHandler(handleGetPassword);
    eventManager.setOnUserLoggedInHandler(handleUserLoggedIn);
    eventManager.setCredentialsAvailableForUpdateHandler(handleCredentialsAvailableForUpdate);
    eventManager.setUpdateCredentialResponseHandler(handleUpdateCredentialResponse);
    eventManager.setAddNewDeviceOptionsHandler(handleAddNewDeviceOptions);
    eventManager.setOnUserLoggedOffHandler(handleUserLoggedOff);
    eventManager.setGetIDVSelfieProcessStartConfirmationHandler(handleGetIDVSelfieProcessStartConfirmation);

    // Only cleanup on component unmount
    return () => {
      console.log('SDKEventProvider - Component unmounting, cleaning up event handlers');
      eventManager.cleanup();
    };
  }, []); // Empty dependency array - setup once on mount

  
  /**
   * Context Value - Simplified for direct navigation approach
   */
  const contextValue: SDKEventContextType = {
    availableCredentials,
  };

  return (
    <SDKEventContext.Provider value={contextValue}>
      {children}
    </SDKEventContext.Provider>
  );
};

/**
 * Hook to access SDK Event Context
 */
export const useSDKEvent = (): SDKEventContextType => {
  const context = useContext(SDKEventContext);
  if (context === undefined) {
    throw new Error('useSDKEvent must be used within an SDKEventProvider');
  }
  return context;
};

export default SDKEventProvider;
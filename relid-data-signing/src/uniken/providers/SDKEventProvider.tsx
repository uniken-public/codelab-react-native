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
  RDNASyncResponse,
  RDNADataSigningResponse
} from '../types/rdnaEvents';

// Import data signing services and types
import { DataSigningService } from '../../tutorial/services/DataSigningService';
import type {
  DataSigningFormState,
  PasswordModalState,
  DataSigningResponse,
  DataSigningResultDisplay,
} from '../../tutorial/types/DataSigningTypes';

/**
 * SDK Event Context Interface - Extended with data signing functionality
 */
interface SDKEventContextType {
availableCredentials: string[];
  // Data Signing State
  formState: DataSigningFormState;
  updateFormState: (updates: Partial<DataSigningFormState>) => void;
  passwordModalState: PasswordModalState;
  updatePasswordModalState: (updates: Partial<PasswordModalState>) => void;

  // Data Signing Actions
  submitDataSigning: () => Promise<void>;
  submitPassword: () => Promise<void>;
  cancelPasswordModal: () => Promise<void>;
  resetDataSigningState: () => Promise<void>;

  // Data Signing Results
  signingResult: DataSigningResponse | null;
  resultDisplay: DataSigningResultDisplay | null;
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

  // =============================================================================
  // DATA SIGNING STATE
  // =============================================================================

  // Form state for data signing input
  const [formState, setFormState] = useState<DataSigningFormState>({
    payload: '',
    selectedAuthLevel: '',
    selectedAuthenticatorType: '',
    reason: '',
    isLoading: false,
  });

  // Password modal state for step-up authentication
  const [passwordModalState, setPasswordModalState] = useState<PasswordModalState>({
    isVisible: false,
    password: '',
    challengeMode: 0,
    attemptsLeft: 3,
    authenticationOptions: [],
    isLargeModal: false,
    keyboardHeight: 0,
    responseData: null,
  });

  // Results from data signing operation
  const [signingResult, setSigningResult] = useState<DataSigningResponse | null>(null);
  const [resultDisplay, setResultDisplay] = useState<DataSigningResultDisplay | null>(null);

  // =============================================================================
  // DATA SIGNING EVENT HANDLERS
  // =============================================================================

  /**
   * Handles the final data signing response event
   */
  const handleDataSigningResponse = useCallback((response: RDNADataSigningResponse) => {
    console.log('SDKEventProvider - Data signing response received:', response);

    // Convert SDK response to our internal format
    const internalResponse: DataSigningResponse = {
      dataPayload: response.dataPayload,
      dataPayloadLength: response.dataPayloadLength,
      reason: response.reason,
      payloadSignature: response.payloadSignature,
      dataSignatureID: response.dataSignatureID,
      authLevel: response.authLevel,
      authenticationType: response.authenticationType,
      status: response.status,
      error: response.error,
    };

    // Update state
    setSigningResult(internalResponse);
    setFormState(prev => ({ ...prev, isLoading: false }));

    // Check if signing was successful
    if (response.error.shortErrorCode === 0 && response.status.statusCode === 100) {
      // Format result for display (excluding status and error)
      const displayData = DataSigningService.formatSigningResultForDisplay(internalResponse);
      setResultDisplay(displayData);

      // Hide password modal if visible
      setPasswordModalState(prev => ({ ...prev, isVisible: false }));

      // Navigate to results screen
      NavigationService.navigate('DataSigningResult');

      console.log('SDKEventProvider - Data signing completed successfully');
    } else {
      // Handle errors
      console.error('SDKEventProvider - Data signing failed:', {
        errorCode: response.error.shortErrorCode,
        statusCode: response.status.statusCode,
        errorMessage: response.error.errorString,
      });

      // Hide password modal
      setPasswordModalState(prev => ({ ...prev, isVisible: false }));
    }
  }, []);


  // =============================================================================
  // DATA SIGNING ACTIONS
  // =============================================================================

  /**
   * Updates form state with partial updates
   */
  const updateFormState = useCallback((updates: Partial<DataSigningFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Updates password modal state with partial updates
   */
  const updatePasswordModalState = useCallback((updates: Partial<PasswordModalState>) => {
    setPasswordModalState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Submits data signing request
   */
  const submitDataSigning = useCallback(async () => {
    console.log('SDKEventProvider - Submitting data signing request');

    // Validate input
    const validation = DataSigningService.validateSigningInput(
      formState.payload,
      formState.selectedAuthLevel,
      formState.selectedAuthenticatorType,
      formState.reason
    );

    if (!validation.isValid) {
      console.error('SDKEventProvider - Validation failed:', validation.errors);
      throw new Error('Validation failed: ' + validation.errors.join(', '));
    }

    // Convert dropdown values to enums
    const { authLevel, authenticatorType } = DataSigningService.convertDropdownToEnums(
      formState.selectedAuthLevel,
      formState.selectedAuthenticatorType
    );

    // Set loading state
    setFormState(prev => ({ ...prev, isLoading: true }));

    try {
      // Clear previous results
      setSigningResult(null);
      setResultDisplay(null);

      // Submit to SDK
      await DataSigningService.signData({
        payload: formState.payload,
        authLevel,
        authenticatorType,
        reason: formState.reason,
      });

      console.log('SDKEventProvider - Data signing request submitted successfully');
    } catch (error) {
      console.error('SDKEventProvider - Failed to submit data signing request:', error);
      setFormState(prev => ({ ...prev, isLoading: false }));

      // Cast the error back to RDNASyncResponse for detailed error info
      const syncResponse = error as RDNASyncResponse;
      if (syncResponse && syncResponse.error) {
        const errorMessage = `${syncResponse.error.errorString}\n\nError Codes:\nLong: ${syncResponse.error.longErrorCode}\nShort: ${syncResponse.error.shortErrorCode}`;
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  }, [formState]);

  /**
   * Submits password for step-up authentication
   */
  const submitPassword = useCallback(async () => {
    console.log('SDKEventProvider - Submitting password for step-up auth');

    // Validate password
    const validation = DataSigningService.validatePassword(passwordModalState.password);
    if (!validation.isValid) {
      console.error('SDKEventProvider - Password validation failed:', validation.error);
      throw new Error(validation.error || 'Password validation failed');
    }

    try {
      // Submit password to SDK
      await DataSigningService.submitPassword(
        passwordModalState.password,
        passwordModalState.challengeMode
      );

      console.log('SDKEventProvider - Password submitted successfully');
    } catch (error) {
      console.error('SDKEventProvider - Failed to submit password:', error);

      // Cast the error back to RDNASyncResponse for detailed error info
      const syncResponse = error as RDNASyncResponse;
      if (syncResponse && syncResponse.error) {
        const errorMessage = `${syncResponse.error.errorString}\n\nError Codes:\nLong: ${syncResponse.error.longErrorCode}\nShort: ${syncResponse.error.shortErrorCode}`;
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  }, [passwordModalState.password, passwordModalState.challengeMode]);

  /**
   * Cancels password modal and resets data signing state
   */
  const cancelPasswordModal = useCallback(async () => {
    console.log('SDKEventProvider - Cancelling password modal');

    try {
      // Reset data signing state in SDK
      await DataSigningService.resetState();

      // Hide modal and reset states
      setPasswordModalState(prev => ({
        ...prev,
        isVisible: false,
        password: '',
      }));

      setFormState(prev => ({ ...prev, isLoading: false }));

      console.log('SDKEventProvider - Password modal cancelled successfully');
    } catch (error) {
      console.error('SDKEventProvider - Failed to cancel password modal:', error);

      // Hide modal anyway
      setPasswordModalState(prev => ({
        ...prev,
        isVisible: false,
        password: '',
      }));
      setFormState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  /**
   * Resets all data signing state
   */
  const resetDataSigningState = useCallback(async () => {
    console.log('SDKEventProvider - Resetting data signing state');

    try {
      // Reset SDK state
      await DataSigningService.resetState();
    } catch (error) {
      console.error('SDKEventProvider - Failed to reset SDK state:', error);
    }

    // Reset all local state
    setFormState({
      payload: '',
      selectedAuthLevel: '',
      selectedAuthenticatorType: '',
      reason: '',
      isLoading: false,
    });

    setPasswordModalState({
      isVisible: false,
      password: '',
      challengeMode: 0,
      attemptsLeft: 3,
      authenticationOptions: [],
      isLargeModal: false,
      keyboardHeight: 0,
    });

    setSigningResult(null);
    setResultDisplay(null);

    console.log('SDKEventProvider - Data signing state reset completed');
  }, []);

  // =============================================================================
  // EXISTING MFA EVENT HANDLERS
  // =============================================================================

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

    // Handle data signing challenge mode 12 - use existing password modal infrastructure
    if (data.challengeMode === 12) {
      console.log('SDKEventProvider - Data signing challenge mode 12 detected - showing authentication modal');
      setPasswordModalState({
        isVisible: true,
        password: '',
        challengeMode: data.challengeMode,
        attemptsLeft: data.attemptsLeft,
        authenticationOptions: [],
        isLargeModal: false,
        keyboardHeight: 0,
        responseData: data,
      });
      return;
    }

    // Navigate to appropriate screen based on challengeMode
    if (data.challengeMode === 0 || data.challengeMode === 5 || data.challengeMode === 15) {
      // challengeMode = 0: Verify existing password
      // challengeMode = 5: Verify password for LDA toggling (enable)
      // challengeMode = 15: Verify password for LDA toggling (disable)
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
    } else if (data.challengeMode === 1 || data.challengeMode === 14) {
      // challengeMode = 1: Set new password
      // challengeMode = 14: Set password for LDA toggling
      NavigationService.navigateOrUpdate('SetPasswordScreen', {
        eventData: data,
        title: 'Set Password',
        subtitle: `Create a secure password for user: ${data.userID}`,
        responseData: data,
      });
    } else {
      // Fallback for any other challenge modes
      console.warn('SDKEventProvider - Unknown challengeMode:', data.challengeMode, '- defaulting to SetPasswordScreen');
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

    // Data signing event handlers
    eventManager.setDataSigningResponseHandler(handleDataSigningResponse);

    // Only cleanup on component unmount
    return () => {
      console.log('SDKEventProvider - Component unmounting, cleaning up event handlers');
      eventManager.cleanup();
    };
  }, []); // Empty dependency array - setup once on mount

  
  /**
   * Context Value - Extended with data signing functionality
   */
  const contextValue: SDKEventContextType = {
    availableCredentials,
 // Data Signing State
    formState,
    updateFormState,
    passwordModalState,
    updatePasswordModalState,

    // Data Signing Actions
    submitDataSigning,
    submitPassword,
    cancelPasswordModal,
    resetDataSigningState,

    // Data Signing Results
    signingResult,
    resultDisplay,
  };

  return (
    <SDKEventContext.Provider value={contextValue}>
      {children}
    </SDKEventContext.Provider>
  );
};

/**
 * Hook to access SDK Event Context
 * Must be used within SDKEventProvider
 */
export const useSDKEvent = (): SDKEventContextType => {
  const context = useContext(SDKEventContext);
  if (context === undefined) {
    throw new Error('useSDKEvent must be used within an SDKEventProvider');
  }
  return context;
};

/**
 * Hook to access data signing functionality specifically
 * Convenience hook that extracts only data signing related functionality
 */
export const useDataSigning = () => {
  const {
    formState,
    updateFormState,
    passwordModalState,
    updatePasswordModalState,
    submitDataSigning,
    submitPassword,
    cancelPasswordModal,
    resetDataSigningState,
    signingResult,
    resultDisplay,
  } = useSDKEvent();

  return {
    formState,
    updateFormState,
    passwordModalState,
    updatePasswordModalState,
    submitDataSigning,
    submitPassword,
    cancelPasswordModal,
    resetState: resetDataSigningState,
    signingResult,
    resultDisplay,
  };
};

export default SDKEventProvider;

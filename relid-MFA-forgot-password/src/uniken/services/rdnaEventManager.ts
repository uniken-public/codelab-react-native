import { NativeEventEmitter, NativeModules } from 'react-native';
import type {
  RDNAJsonResponse,
  RDNAProgressData,
  RDNAInitializeErrorData,
  RDNAInitializedData,
  RDNAUserConsentThreatsData,
  RDNATerminateWithThreatsData,
  RDNAGetUserData,
  RDNAGetActivationCodeData,
  RDNAGetUserConsentForLDAData,
  RDNAGetPasswordData,
  RDNAUserLoggedInData,
  RDNAUserLoggedOffData,
  RDNACredentialsAvailableForUpdateData,
  RDNASessionTimeoutData,
  RDNASessionTimeoutNotificationData,
  RDNASessionExtensionResponseData,
  RDNAProgressCallback,
  RDNAErrorCallback,
  RDNASuccessCallback,
  RDNAUserConsentThreatsCallback,
  RDNATerminateWithThreatsCallback,
  RDNAGetUserCallback,
  RDNAGetActivationCodeCallback,
  RDNAGetUserConsentForLDACallback,
  RDNAGetPasswordCallback,
  RDNAUserLoggedInCallback,
  RDNAUserLoggedOffCallback,
  RDNACredentialsAvailableForUpdateCallback,
  RDNAAddNewDeviceOptionsData,
  RDNAAddNewDeviceOptionsCallback,
  RDNASessionTimeoutCallback,
  RDNASessionTimeoutNotificationCallback,
  RDNASessionExtensionResponseCallback,
  RDNAGetNotificationsData,
  RDNAUpdateNotificationData,
  RDNAGetNotificationsCallback,
  RDNAUpdateNotificationCallback
} from '../types/rdnaEvents';

/**
 * REL-ID SDK Event Manager
 * 
 * Manages all REL-ID SDK events in a centralized, type-safe manner.
 * Provides a singleton pattern for consistent event handling across the application.
 * 
 * Supported Events:
 * - onInitializeProgress: SDK initialization progress updates
 * - onInitializeError: SDK initialization error handling  
 * - onInitialized: Successful SDK initialization with session data
 * - onUserConsentThreats: Non-terminating threats requiring user consent
 * - onTerminateWithThreats: Critical threats requiring app termination
 * - onGetUser: User input requests for MFA
 * - onUserLoggedOff: User logout confirmation events
 * 
 * Key Features:
 * - Singleton pattern for global event management
 * - Type-safe callback handling with TypeScript interfaces
 * - Automatic event listener registration and cleanup
 * - Single event handler per type for simplicity
 * - Comprehensive error handling and logging
 * 
 * @see https://developer.uniken.com/docs/initialize-1
 */
class RdnaEventManager {
  private static instance: RdnaEventManager;
  private rdnaEmitter: NativeEventEmitter;
  private listeners: Array<any> = [];

  // Composite event handlers (can handle multiple concerns)
  private initializeProgressHandler?: RDNAProgressCallback;
  private initializeErrorHandler?: RDNAErrorCallback;
  private initializedHandler?: RDNASuccessCallback;
  private userConsentThreatsHandler?: RDNAUserConsentThreatsCallback;
  private terminateWithThreatsHandler?: RDNATerminateWithThreatsCallback;
  private getUserHandler?: RDNAGetUserCallback;
  private getActivationCodeHandler?: RDNAGetActivationCodeCallback;
  private getUserConsentForLDAHandler?: RDNAGetUserConsentForLDACallback;
  private getPasswordHandler?: RDNAGetPasswordCallback;
  private onUserLoggedInHandler?: RDNAUserLoggedInCallback;
  private onUserLoggedOffHandler?: RDNAUserLoggedOffCallback;
  private credentialsAvailableForUpdateHandler?: RDNACredentialsAvailableForUpdateCallback;
  private addNewDeviceOptionsHandler?: RDNAAddNewDeviceOptionsCallback;
  
  // Session management handlers
  private sessionTimeoutHandler?: RDNASessionTimeoutCallback;
  private sessionTimeoutNotificationHandler?: RDNASessionTimeoutNotificationCallback;
  private sessionExtensionResponseHandler?: RDNASessionExtensionResponseCallback;
  
  // Notification management handlers
  private getNotificationsHandler?: RDNAGetNotificationsCallback;
  private updateNotificationHandler?: RDNAUpdateNotificationCallback;

  constructor() {
    this.rdnaEmitter = new NativeEventEmitter(NativeModules.RdnaClient);
    this.registerEventListeners();
  }

  static getInstance(): RdnaEventManager {
    if (!RdnaEventManager.instance) {
      RdnaEventManager.instance = new RdnaEventManager();
    }
    return RdnaEventManager.instance;
  }

  /**
   * Registers native event listeners for all SDK events
   */
  private registerEventListeners() {
    console.log('RdnaEventManager - Registering native event listeners');

    this.listeners.push(
      this.rdnaEmitter.addListener('onInitializeProgress', this.onInitializeProgress.bind(this)),
      this.rdnaEmitter.addListener('onInitializeError', this.onInitializeError.bind(this)),
      this.rdnaEmitter.addListener('onInitialized', this.onInitialized.bind(this)),
      this.rdnaEmitter.addListener('onUserConsentThreats', this.onUserConsentThreats.bind(this)),
      this.rdnaEmitter.addListener('onTerminateWithThreats', this.onTerminateWithThreats.bind(this)),
      this.rdnaEmitter.addListener('getUser', this.onGetUser.bind(this)),
      this.rdnaEmitter.addListener('getActivationCode', this.onGetActivationCode.bind(this)),
      this.rdnaEmitter.addListener('getUserConsentForLDA', this.onGetUserConsentForLDA.bind(this)),
      this.rdnaEmitter.addListener('getPassword', this.onGetPassword.bind(this)),
      this.rdnaEmitter.addListener('onUserLoggedIn', this.onUserLoggedIn.bind(this)),
      this.rdnaEmitter.addListener('onUserLoggedOff', this.onUserLoggedOff.bind(this)),
      this.rdnaEmitter.addListener('onCredentialsAvailableForUpdate', this.onCredentialsAvailableForUpdate.bind(this)),
      
      // Session management event listeners
      this.rdnaEmitter.addListener('onSessionTimeout', this.onSessionTimeout.bind(this)),
      this.rdnaEmitter.addListener('onSessionTimeOutNotification', this.onSessionTimeOutNotification.bind(this)),
      this.rdnaEmitter.addListener('onSessionExtensionResponse', this.onSessionExtensionResponse.bind(this)),
      
      // Additional device activation event listeners
      this.rdnaEmitter.addListener('addNewDeviceOptions', this.onAddNewDeviceOptions.bind(this)),
      
      // Notification management event listeners
      this.rdnaEmitter.addListener('onGetNotifications', this.onGetNotifications.bind(this)),
      this.rdnaEmitter.addListener('onUpdateNotification', this.onUpdateNotification.bind(this))
    );
    
    console.log('RdnaEventManager - Native event listeners registered');
  }

  /**
   * Handles SDK initialization progress events
   * @param response Raw response from native SDK
   */
  private onInitializeProgress(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Initialize progress event received");

    try {
      const progressData: RDNAProgressData = JSON.parse(response.response);
      console.log("RdnaEventManager - Progress:", progressData.initializeStatus);

      if (this.initializeProgressHandler) {
        this.initializeProgressHandler(progressData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse initialize progress:", error);
    }
  }

  /**
   * Handles SDK initialization error events
   * @param response Raw response from native SDK containing error details
   */
  private onInitializeError(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Initialize error event received");

    try {
      const errorData: RDNAInitializeErrorData = JSON.parse(response.response);
      console.error("RdnaEventManager - Initialize error:", errorData.errorString);
      
      if (this.initializeErrorHandler) {
        this.initializeErrorHandler(errorData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse initialize error:", error);
    }
  }

  /**
   * Handles SDK initialization success events
   * @param response Raw response from native SDK containing session data
   */
  private onInitialized(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Initialize success event received");

    try {
      const initializedData: RDNAInitializedData = JSON.parse(response.response);
      console.log("RdnaEventManager - Successfully initialized, Session ID:", initializedData.session.sessionID);

      if (this.initializedHandler) {
        this.initializedHandler(initializedData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse initialize success:", error);
    }
  }

  /**
   * Handles security threat events requiring user consent
   * @param response Raw response from native SDK containing threat details
   */
  private onUserConsentThreats(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - User consent threats event received");

    try {
      // Try parsing as JSON string first
      const threatArray = JSON.parse(response.response);
      const userConsentData: RDNAUserConsentThreatsData = { threats: threatArray };
      console.log("RdnaEventManager - Consent threats detected:", threatArray.length);

      if (this.userConsentThreatsHandler) {
        this.userConsentThreatsHandler(userConsentData);
      }
    } catch (error) {
      // Handle iOS response format (direct array)
      if (Array.isArray(response.response)) {
        const userConsentData: RDNAUserConsentThreatsData = { threats: response.response };
        console.log("RdnaEventManager - Consent threats detected (iOS format):", response.response.length);
        
        if (this.userConsentThreatsHandler) {
          this.userConsentThreatsHandler(userConsentData);
        }
      } else {
        console.error("RdnaEventManager - Failed to parse user consent threats:", error);
      }
    }
  }

  /**
   * Handles critical security threat events requiring app termination
   * @param response Raw response from native SDK containing threat details
   */
  private onTerminateWithThreats(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Terminate with threats event received");

    try {
      // Try parsing as JSON string first
      const threatArray = JSON.parse(response.response);
      const terminateData: RDNATerminateWithThreatsData = { threats: threatArray };
      console.error("RdnaEventManager - Critical threats detected, terminating:", threatArray.length);

      if (this.terminateWithThreatsHandler) {
        this.terminateWithThreatsHandler(terminateData);
      }
    } catch (error) {
      // Handle iOS response format (direct array)
      if (Array.isArray(response.response)) {
        const terminateData: RDNATerminateWithThreatsData = { threats: response.response };
        console.error("RdnaEventManager - Critical threats detected (iOS format), terminating:", response.response.length);
        
        if (this.terminateWithThreatsHandler) {
          this.terminateWithThreatsHandler(terminateData);
        }
      } else {
        console.error("RdnaEventManager - Failed to parse terminate threats:", error);
      }
    }
  }

  /**
   * Handles user input request events for MFA authentication
   * @param response Raw response from native SDK containing user data
   */
  private onGetUser(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Get user event received");

    try {
      const getUserData: RDNAGetUserData = JSON.parse(response.response);
      console.log("RdnaEventManager - Get user status:", getUserData.challengeResponse.status.statusCode);

      if (this.getUserHandler) {
        this.getUserHandler(getUserData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse get user:", error);
    }
  }

  /**
   * Handles activation code request events for MFA authentication
   * @param response Raw response from native SDK containing activation code data
   */
  private onGetActivationCode(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Get activation code event received");

    try {
      const getActivationCodeData: RDNAGetActivationCodeData = JSON.parse(response.response);
      console.log("RdnaEventManager - Get activation code status:", getActivationCodeData.challengeResponse.status.statusCode);
      console.log("RdnaEventManager - UserID:", getActivationCodeData.userID, "AttemptsLeft:", getActivationCodeData.attemptsLeft);

      if (this.getActivationCodeHandler) {
        this.getActivationCodeHandler(getActivationCodeData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse get activation code:", error);
    }
  }

  /**
   * Handles user consent for LDA request events
   * @param response Raw response from native SDK containing user consent for LDA data
   */
  private onGetUserConsentForLDA(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Get user consent for LDA event received");

    try {
      const getUserConsentForLDAData: RDNAGetUserConsentForLDAData = JSON.parse(response.response);
      console.log("RdnaEventManager - Get user consent for LDA status:", getUserConsentForLDAData.challengeResponse.status.statusCode);
      console.log("RdnaEventManager - UserID:", getUserConsentForLDAData.userID, "ChallengeMode:", getUserConsentForLDAData.challengeMode, "AuthenticationType:", getUserConsentForLDAData.authenticationType);

      if (this.getUserConsentForLDAHandler) {
        this.getUserConsentForLDAHandler(getUserConsentForLDAData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse get user consent for LDA:", error);
    }
  }

  /**
   * Handles password request events for MFA authentication
   * @param response Raw response from native SDK containing password data
   */
  private onGetPassword(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Get password event received");

    try {
      const getPasswordData: RDNAGetPasswordData = JSON.parse(response.response);
      console.log("RdnaEventManager - Get password status:", getPasswordData.challengeResponse.status.statusCode);
      console.log("RdnaEventManager - UserID:", getPasswordData.userID, "ChallengeMode:", getPasswordData.challengeMode, "AttemptsLeft:", getPasswordData.attemptsLeft);

      if (this.getPasswordHandler) {
        this.getPasswordHandler(getPasswordData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse get password:", error);
    }
  }

  /**
   * Handles user logged in events indicating successful authentication
   * @param response Raw response from native SDK containing user login data
   */
  private onUserLoggedIn(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - User logged in event received");

    try {
      const userLoggedInData: RDNAUserLoggedInData = JSON.parse(response.response);
      console.log("RdnaEventManager - User logged in:", userLoggedInData.userID);
      console.log("RdnaEventManager - Session ID:", userLoggedInData.challengeResponse.session.sessionID);

      if (this.onUserLoggedInHandler) {
        this.onUserLoggedInHandler(userLoggedInData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse user logged in:", error);
    }
  }

  /**
   * Handles user logged off events indicating successful logout
   * @param response Raw response from native SDK containing user logout data
   */
  private onUserLoggedOff(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - User logged off event received");

    try {
      const userLoggedOffData: RDNAUserLoggedOffData = JSON.parse(response.response);
      console.log("RdnaEventManager - User logged off:", userLoggedOffData.userID);
      console.log("RdnaEventManager - Session ID:", userLoggedOffData.challengeResponse.session.sessionID);

      if (this.onUserLoggedOffHandler) {
        this.onUserLoggedOffHandler(userLoggedOffData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse user logged off:", error);
    }
  }

  /**
   * Handles credentials available for update events
   * @param response Raw response from native SDK containing credentials update data
   */
  private onCredentialsAvailableForUpdate(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Credentials available for update event received");

    try {
      const credentialsUpdateData: RDNACredentialsAvailableForUpdateData = JSON.parse(response.response);
      console.log("RdnaEventManager - Credentials available for update for user:", credentialsUpdateData.userID);
      console.log("RdnaEventManager - Available options:", credentialsUpdateData.options);

      if (this.credentialsAvailableForUpdateHandler) {
        this.credentialsAvailableForUpdateHandler(credentialsUpdateData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse credentials available for update:", error);
    }
  }

  // Session Management Event Handlers

  /**
   * Handles session timeout events for mandatory sessions
   * @param response Raw response from native SDK containing session timeout data
   */
  private onSessionTimeout(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Session timeout event received");
    console.log("RdnaEventManager - Raw response data:", response.response);
    console.log("RdnaEventManager - Response data type:", typeof response.response);

    try {
      let sessionTimeoutData: RDNASessionTimeoutData;
      
      if (typeof response.response === 'string') {
        // Treat the string as a plain message
        sessionTimeoutData = {
          message: response.response
        };
      } else {
        // If it's already an object, use it directly
        sessionTimeoutData = response.response as RDNASessionTimeoutData;
      }
      
      console.log("RdnaEventManager - Session timeout message:", sessionTimeoutData.message);

      if (this.sessionTimeoutHandler) {
        this.sessionTimeoutHandler(sessionTimeoutData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to handle session timeout:", error);
      console.error("RdnaEventManager - Raw response causing error:", response.response);
    }
  }

  /**
   * Handles session timeout notification events for idle sessions
   * @param response Raw response from native SDK containing session timeout notification data
   */
  private onSessionTimeOutNotification(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Session timeout notification event received");

    try {
      const sessionNotificationData: RDNASessionTimeoutNotificationData = JSON.parse(response.response);
      console.log("RdnaEventManager - Session timeout notification:", {
        userID: sessionNotificationData.userID,
        timeLeft: sessionNotificationData.timeLeftInSeconds,
        canExtend: sessionNotificationData.sessionCanBeExtended === 1,
        sessionType: sessionNotificationData.info.sessionType
      });

      if (this.sessionTimeoutNotificationHandler) {
        this.sessionTimeoutNotificationHandler(sessionNotificationData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse session timeout notification:", error);
    }
  }

  /**
   * Handles session extension response events
   * @param response Raw response from native SDK containing session extension response data
   */
  private onSessionExtensionResponse(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Session extension response event received");

    try {
      const sessionExtensionData: RDNASessionExtensionResponseData = JSON.parse(response.response);
      console.log("RdnaEventManager - Session extension response:", {
        statusCode: sessionExtensionData.status.statusCode,
        statusMessage: sessionExtensionData.status.statusMessage,
        errorCode: sessionExtensionData.error.longErrorCode,
        errorString: sessionExtensionData.error.errorString
      });

      if (this.sessionExtensionResponseHandler) {
        this.sessionExtensionResponseHandler(sessionExtensionData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse session extension response:", error);
    }
  }

  /**
   * Handles add new device options events (REL-ID Verify)
   * @param response Raw response from native SDK
   */
  private onAddNewDeviceOptions(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Add new device options event received");

    try {
      const addNewDeviceData: RDNAAddNewDeviceOptionsData = JSON.parse(response.response);
      
      console.log("RdnaEventManager - Add new device options data:", {
        errCode: addNewDeviceData.errCode,
        userID: addNewDeviceData.userID,
        deviceOptionsCount: addNewDeviceData.newDeviceOptions?.length || 0
      });

      if (this.addNewDeviceOptionsHandler) {
        this.addNewDeviceOptionsHandler(addNewDeviceData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse add new device options response:", error);
    }
  }

  /**
   * Handles notification retrieval response events
   * @param response Raw response from native SDK
   */
  private onGetNotifications(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Get notifications event received");

    try {
      const notificationData: RDNAGetNotificationsData = JSON.parse(response.response);
      
      console.log("RdnaEventManager - Get notifications data:", {
        errCode: notificationData.errCode,
        userID: notificationData.userID,
        notificationCount: notificationData.pArgs?.response?.ResponseData?.notifications?.length || 0
      });

      if (this.getNotificationsHandler) {
        this.getNotificationsHandler(notificationData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse get notifications response:", error);
    }
  }

  /**
   * Handles notification update response events
   * @param response Raw response from native SDK
   */
  private onUpdateNotification(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Update notification event received");

    try {
      const updateData: RDNAUpdateNotificationData = JSON.parse(response.response);
      
      console.log("RdnaEventManager - Update notification data:", {
        errCode: updateData.errCode,
        statusCode: updateData.pArgs?.response?.StatusCode,
        statusMsg: updateData.pArgs?.response?.StatusMsg
      });

      if (this.updateNotificationHandler) {
        this.updateNotificationHandler(updateData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse update notification response:", error);
    }
  }

  /**
   * Sets event handlers for SDK events. Only one handler per event type.
   */
  public setInitializeProgressHandler(callback?: RDNAProgressCallback): void {
    this.initializeProgressHandler = callback;
  }

  public setInitializeErrorHandler(callback?: RDNAErrorCallback): void {
    this.initializeErrorHandler = callback;
  }

  public setInitializedHandler(callback?: RDNASuccessCallback): void {
    this.initializedHandler = callback;
  }

  public setUserConsentThreatsHandler(callback?: RDNAUserConsentThreatsCallback): void {
    this.userConsentThreatsHandler = callback;
  }

  public setTerminateWithThreatsHandler(callback?: RDNATerminateWithThreatsCallback): void {
    this.terminateWithThreatsHandler = callback;
  }

  public setGetUserHandler(callback?: RDNAGetUserCallback): void {
    this.getUserHandler = callback;
  }

  public setGetActivationCodeHandler(callback?: RDNAGetActivationCodeCallback): void {
    this.getActivationCodeHandler = callback;
  }

  public setGetUserConsentForLDAHandler(callback?: RDNAGetUserConsentForLDACallback): void {
    this.getUserConsentForLDAHandler = callback;
  }

  public setGetPasswordHandler(callback?: RDNAGetPasswordCallback): void {
    this.getPasswordHandler = callback;
  }

  public setOnUserLoggedInHandler(callback?: RDNAUserLoggedInCallback): void {
    this.onUserLoggedInHandler = callback;
  }

  public setOnUserLoggedOffHandler(callback?: RDNAUserLoggedOffCallback): void {
    this.onUserLoggedOffHandler = callback;
  }

  public setCredentialsAvailableForUpdateHandler(callback?: RDNACredentialsAvailableForUpdateCallback): void {
    this.credentialsAvailableForUpdateHandler = callback;
  }

  public setAddNewDeviceOptionsHandler(callback?: RDNAAddNewDeviceOptionsCallback): void {
    this.addNewDeviceOptionsHandler = callback;
  }

  // Session Management Handler Setters

  public setSessionTimeoutHandler(callback?: RDNASessionTimeoutCallback): void {
    this.sessionTimeoutHandler = callback;
  }

  public setSessionTimeoutNotificationHandler(callback?: RDNASessionTimeoutNotificationCallback): void {
    this.sessionTimeoutNotificationHandler = callback;
  }

  public setSessionExtensionResponseHandler(callback?: RDNASessionExtensionResponseCallback): void {
    this.sessionExtensionResponseHandler = callback;
  }

  // Notification Management Handler Setters

  public setGetNotificationsHandler(callback?: RDNAGetNotificationsCallback): void {
    this.getNotificationsHandler = callback;
  }

  public setUpdateNotificationHandler(callback?: RDNAUpdateNotificationCallback): void {
    this.updateNotificationHandler = callback;
  }

  /**
   * Cleans up all event listeners and handlers
   */
  public cleanup() {
    console.log('RdnaEventManager - Cleaning up event listeners and handlers');
    
    // Remove native event listeners
    this.listeners.forEach(listener => {
      if (listener && listener.remove) {
        listener.remove();
      }
    });
    this.listeners = [];
    
    // Clear all event handlers
    this.initializeProgressHandler = undefined;
    this.initializeErrorHandler = undefined;
    this.initializedHandler = undefined;
    this.userConsentThreatsHandler = undefined;
    this.terminateWithThreatsHandler = undefined;
    this.getUserHandler = undefined;
    this.getActivationCodeHandler = undefined;
    this.getUserConsentForLDAHandler = undefined;
    this.getPasswordHandler = undefined;
    this.onUserLoggedInHandler = undefined;
    this.onUserLoggedOffHandler = undefined;
    this.credentialsAvailableForUpdateHandler = undefined;
    this.addNewDeviceOptionsHandler = undefined;
    
    // Clear session management handlers
    this.sessionTimeoutHandler = undefined;
    this.sessionTimeoutNotificationHandler = undefined;
    this.sessionExtensionResponseHandler = undefined;
    
    // Clear notification management handlers
    this.getNotificationsHandler = undefined;
    this.updateNotificationHandler = undefined;
    
    console.log('RdnaEventManager - Cleanup completed');
  }
}

export default RdnaEventManager;

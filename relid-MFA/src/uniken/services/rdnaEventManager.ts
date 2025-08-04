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
  RDNACredentialsAvailableForUpdateCallback
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
      this.rdnaEmitter.addListener('onCredentialsAvailableForUpdate', this.onCredentialsAvailableForUpdate.bind(this))
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
    
    console.log('RdnaEventManager - Cleanup completed');
  }
}

export default RdnaEventManager;
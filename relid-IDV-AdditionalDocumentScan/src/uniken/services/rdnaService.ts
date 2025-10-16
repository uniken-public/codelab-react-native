import RdnaClient, {
  RDNALoggingLevel,
} from 'react-native-rdna-client/src/index';
import { loadAgentInfo } from '../utils/connectionProfileParser';
import RdnaEventManager from './rdnaEventManager';
import type {RDNASyncResponse,} from '../types/rdnaEvents';

const RDNA_NO_LOGS = RDNALoggingLevel.RDNA_NO_LOGS;

export class RdnaService {
  private static instance: RdnaService;
  private eventManager: RdnaEventManager;

  constructor() {
    this.eventManager = RdnaEventManager.getInstance();
  }

  static getInstance(): RdnaService {
    if (!RdnaService.instance) {
      RdnaService.instance = new RdnaService();
    }
    return RdnaService.instance;
  }

  /**
   * Gets the event manager instance for external callback setup
   */
  getEventManager(): RdnaEventManager {
    return this.eventManager;
  }

   /**
   * Cleans up the service and event manager
   */
  cleanup(): void {
    console.log('RdnaService - Cleaning up service');
    this.eventManager.cleanup();
  }

   /**
   * Gets the version of the REL-ID SDK
   */
  async getSDKVersion(): Promise<string> {
    return new Promise((resolve, reject) => {
      RdnaClient.getSDKVersion(response => {
        console.log('RdnaService - SDK version response received');

        try {
          const version = (response as any)?.[0]?.response || (response as any)?.response || 'Unknown';
          console.log('RdnaService - SDK Version:', version);
          resolve(version);
        } catch (error) {
          console.error('RdnaService - Failed to parse SDK version:', error);
          reject(new Error('Failed to parse SDK version response'));
        }
      });
    });
  }

  /**
   * Initializes the REL-ID SDK
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async initialize(): Promise<RDNASyncResponse> {
    const profile = await loadAgentInfo();
    console.log('RdnaService - Loaded connection profile:', {
      host: profile.host,
      port: profile.port,
      relId: profile.relId.substring(0, 10) + '...',
    });

    console.log('RdnaService - Starting initialization');

    return new Promise((resolve, reject) => {
      RdnaClient.initialize(
        profile.relId,
        profile.host,
        profile.port,
        '',
        '',
        '',
        '',
        RDNA_NO_LOGS,
        response => {
          console.log('RdnaService - Initialize sync callback received');
          console.log('RdnaService - initialize Sync raw response', response);

          const result: RDNASyncResponse = (response as any)[0] || response;
          
          if (result.error && result.error.longErrorCode === 0) {
            console.log(
              'RdnaService - Sync response success, waiting for async events',
            );
            resolve(result);
          } else {
            console.error('RdnaService - Sync response error:', result);
            reject(result);
          }
        },
      );
    });
  }

  /**
   * Takes action on detected security threats
   * @param modifiedThreatsJson JSON string containing threat action decisions
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async takeActionOnThreats(modifiedThreatsJson: number): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      RdnaClient.takeActionOnThreats(modifiedThreatsJson, response => {
        console.log('RdnaService - Take action on threats response received');

        const result: RDNASyncResponse = (response as any)[0] || response;

        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - Successfully took action on threats');
          resolve(result);
        } else {
          const errorMessage =
            result.error?.errorString ||
            'Unknown error from takeActionOnThreats';
          console.error(
            'RdnaService - Take action on threats failed:',
            errorMessage,
          );
          reject(result);
        }
      });
    });
  }

  /**
   * Sets user for MFA User Activation Flow
   *
   * This method submits the username for user validation during the MFA flow.
   * It validates the user identity and prepares for subsequent authentication steps.
   * Uses sync response pattern similar to initialize() method.
   *
   * @see https://developer.uniken.com/docs/setuser
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Async events will be handled by event listeners for getUser, etc.
   *
   * @param username The username to validate
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async setUser(username: string): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Setting user for MFA flow:', username);
      
      RdnaClient.setUser(username, response => {
        console.log('RdnaService - SetUser sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - SetUser sync response success, waiting for async events');
          resolve(result);
        } else {
          console.error('RdnaService - SetUser sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Sets activation code for MFA User Activation Flow
   *
   * This method submits the activation code for user validation during the MFA flow.
   * It processes the OTP/activation code and validates the user identity.
   * Uses sync response pattern similar to initialize() method.
   *
   * @see https://developer.uniken.com/docs/setactivationcode
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Async events will be handled by event listeners for getActivationCode, etc.
   *
   * @param activationCode The activation code to validate
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async setActivationCode(activationCode: string): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Setting activation code for MFA flow:', activationCode);
      
      RdnaClient.setActivationCode(activationCode, response => {
        console.log('RdnaService - SetActivationCode sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - SetActivationCode sync response success, waiting for async events');
          resolve(result);
        } else {
          console.error('RdnaService - SetActivationCode sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Sets user consent for LDA (Local Device Authentication)
   *
   * This method submits the user's consent for LDA enrollment during authentication flows.
   * It processes the user's decision and the authentication parameters from getUserConsentForLDA event.
   * Uses sync response pattern similar to initialize() method.
   *
   * @see https://developer.uniken.com/docs/get-user-consent-for-lda
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Async events will be handled by event listeners for subsequent authentication steps
   *
   * @param isEnrollLDA User consent decision (true = approve, false = reject)
   * @param challengeMode Challenge mode from getUserConsentForLDA event
   * @param authenticationType Authentication type from getUserConsentForLDA event
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async setUserConsentForLDA(isEnrollLDA: boolean, challengeMode: number, authenticationType: number): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Setting user consent for LDA:', {
        isEnrollLDA,
        challengeMode,
        authenticationType
      });
      
      RdnaClient.setUserConsentForLDA(isEnrollLDA, challengeMode, authenticationType, response => {
        console.log('RdnaService - SetUserConsentForLDA sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - SetUserConsentForLDA sync response success, waiting for async events');
          resolve(result);
        } else {
          console.error('RdnaService - SetUserConsentForLDA sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Resends activation code for MFA User Activation Flow
   *
   * This method requests a new activation code (OTP) to be sent to the user via email or SMS.
   * It's used when the user hasn't received their original activation code and needs a resend.
   * Calling this method triggers a new getActivationCode event with updated information.
   * Uses sync response pattern similar to initialize() method.
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. A new getActivationCode event will be triggered with fresh OTP information
   * 3. Async events will be handled by event listeners for getActivationCode, etc.
   *
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async resendActivationCode(): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Requesting resend of activation code');
      
      RdnaClient.resendActivationCode(response => {
        console.log('RdnaService - ResendActivationCode sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - ResendActivationCode sync response success, waiting for new getActivationCode event');
          resolve(result);
        } else {
          console.error('RdnaService - ResendActivationCode sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Sets password for MFA User Authentication Flow
   *
   * This method submits the user's password for authentication during the MFA flow.
   * It processes the password and validates it against the challenge requirements.
   * Uses sync response pattern similar to initialize() method.
   *
   * @see https://developer.uniken.com/docs/setpassword
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Async events will be handled by event listeners for subsequent authentication steps
   *
   * @param password The password to validate
   * @param challengeMode Challenge mode from getPassword event (default: 1)
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async setPassword(password: string, challengeMode: number = 1): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Setting password for MFA flow');
      
      RdnaClient.setPassword(password, challengeMode, response => {
        console.log('RdnaService - SetPassword sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - SetPassword sync response success, waiting for async events');
          resolve(result);
        } else {
          console.error('RdnaService - SetPassword sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Resets authentication state and returns to initial flow
   *
   * This method resets the current authentication flow and clears any stored state.
   * After successful reset, the SDK will trigger a new getUser event to restart the flow.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/reset-authentication
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. A new getUser event will be triggered to restart the authentication flow
   * 3. Async events will be handled by event listeners
   *
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async resetAuthState(): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Resetting authentication state');
      
      RdnaClient.resetAuthState(response => {
        console.log('RdnaService - ResetAuthState sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - ResetAuthState sync response success, waiting for new getUser event');
          resolve(result);
        } else {
          console.error('RdnaService - ResetAuthState sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Logs off the user and terminates their authenticated session
   *
   * This method securely terminates the user's authenticated session.
   * After successful logoff, the SDK will trigger an onUserLoggedOff event followed by getUser event.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/logoff
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onUserLoggedOff event will be triggered to confirm successful logout
   * 3. A getUser event will be triggered to restart the authentication flow
   * 4. Async events will be handled by event listeners
   *
   * @param userID The unique user identifier for the user to log off
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async logOff(userID: string): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Logging off user:', userID);
      
      RdnaClient.logOff(userID, response => {
        console.log('RdnaService - LogOff sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - LogOff sync response success, waiting for onUserLoggedOff event');
          resolve(result);
        } else {
          console.error('RdnaService - LogOff sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Sets IDV document scan process start confirmation for IDV flow
   *
   * This method submits the user's confirmation to start the IDV document scanning process.
   * It processes the user's decision and the IDV workflow parameter for document scanning.
   * After successful API call, the SDK will trigger a getIDVDocumentScanProcessStartConfirmation event.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/setidvdocumentscanprocessstartconfirmation
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. A getIDVDocumentScanProcessStartConfirmation event will be triggered with document scan details
   * 3. Async events will be handled by event listeners
   *
   * @param isConfirm User confirmation decision (true = start document scan, false = cancel)
   * @param idvWorkflow IDV workflow type for the document scanning process
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async setIDVDocumentScanProcessStartConfirmation(isConfirm: boolean, idvWorkflow: number): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Setting IDV document scan process start confirmation:', {
        isConfirm,
        idvWorkflow
      });
      
      RdnaClient.setIDVDocumentScanProcessStartConfirmation(isConfirm, idvWorkflow, response => {
        console.log('RdnaService - SetIDVDocumentScanProcessStartConfirmation sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - SetIDVDocumentScanProcessStartConfirmation sync response success, waiting for getIDVDocumentScanProcessStartConfirmation event');
          resolve(result);
        } else {
          console.error('RdnaService - SetIDVDocumentScanProcessStartConfirmation sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Sets IDV configuration settings for IDV flow
   *
   * This method sets the IDV configuration JSON string that controls various IDV workflow settings.
   * The configuration defines parameters like document types, capture settings, validation rules, etc.
   * This is a synchronous operation that stores the configuration in the SDK.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/setidvconfig
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Configuration will be stored and applied to subsequent IDV operations
   *
   * @param configJson JSON string containing IDV configuration settings
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async setIDVConfig(configJson: string): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Setting IDV configuration');
      
      RdnaClient.setIDVConfig(configJson, response => {
        console.log('RdnaService - SetIDVConfig sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - SetIDVConfig sync response success');
          resolve(result);
        } else {
          console.error('RdnaService - SetIDVConfig sync response error:', result);
          reject(result);
        }
      });
    });
  }


  /**
   * Sets IDV biometric opt-in consent for IDV flow
   *
   * This method submits the user's consent for biometric template storage.
   * It processes the user's decision to allow or deny biometric template saving.
   * After successful API call, the IDV flow continues to the next step.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/setidvbiometricoptinconsent
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. The IDV flow will continue to the next step
   * 3. Async events will be handled by event listeners
   *
   * @param isOptIn User consent decision (true = allow biometric storage, false = deny)
   * @param challengeMode Challenge mode from the getIDVBiometricOptInConsent event
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async setIDVBiometricOptInConsent(isOptIn: boolean, challengeMode: number): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Setting IDV biometric opt-in consent:', {
        isOptIn,
        challengeMode
      });
      
      RdnaClient.setIDVBiometricOptInConsent(isOptIn, challengeMode, response => {
        console.log('RdnaService - SetIDVBiometricOptInConsent sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - SetIDVBiometricOptInConsent sync response success');
          resolve(result);
        } else {
          console.error('RdnaService - SetIDVBiometricOptInConsent sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Gets IDV configuration settings for IDV flow
   *
   * This method retrieves the current IDV configuration settings from the SDK.
   * The configuration contains parameters like document types, capture settings, validation rules, etc.
   * This is a synchronous operation that returns the current configuration directly in the response.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/getidvconfig
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. The configuration JSON will be available in the response object
   *
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure containing config data
   */
  async getIDVConfig(): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Getting IDV configuration');
      
      RdnaClient.getIDVConfig(response => {
        console.log('RdnaService - GetIDVConfig sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - GetIDVConfig sync response success');
          resolve(result);
        } else {
          console.error('RdnaService - GetIDVConfig sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Extends the idle session timeout
   *
   * This method extends the current idle session timeout when the session is eligible for extension.
   * Should be called in response to onSessionTimeOutNotification events when sessionCanBeExtended = 1.
   * After calling this method, the SDK will trigger an onSessionExtensionResponse event with the result.
   *
   * @see https://developer.uniken.com/docs/extend-session-timeout
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onSessionExtensionResponse event will be triggered with detailed response
   * 3. The extension success/failure will be determined by the async event response
   *
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async extendSessionIdleTimeout(): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Extending session idle timeout');
      
      RdnaClient.extendSessionIdleTimeout(response => {
        console.log('RdnaService - ExtendSessionIdleTimeout sync callback received');
        console.log('RdnaService - ExtendSessionIdleTimeout sync raw response:', response);

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - ExtendSessionIdleTimeout sync response success, waiting for onSessionExtensionResponse event');
          resolve(result);
        } else {
          console.error('RdnaService - ExtendSessionIdleTimeout sync response error:', result);
          reject(result);
        }
      });
    });
  }


  /**
   * Gets notifications from the REL-ID SDK server
   *
   * This method fetches notifications for the current user. It follows the sync+async pattern:
   * the method returns a sync response, then triggers an onGetNotifications event with notification data.
   * Uses sync response pattern similar to other API methods.
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onGetNotifications event will be triggered with notification data
   * 3. Async events will be handled by event listeners
   *
   * @param recordCount Number of records to fetch (0 = all active notifications)
   * @param startIndex Index to begin fetching from (must be >= 1)
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async getNotifications(recordCount: number = 0, startIndex: number = 1, startDate: string = '', endDate: string = ''): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Fetching notifications with recordCount:', recordCount, 'startIndex:', startIndex);
      
      RdnaClient.getNotifications(
        recordCount,     // recordCount
        '',              // enterpriseID (optional)
        startIndex,      // startIndex 
        startDate,              // startDate (optional)
        endDate,              // endDate (optional)
        response => {    // syncCallback
          console.log('RdnaService - GetNotifications sync callback received');

          const result: RDNASyncResponse = (response as any)[0] || response;
          
          if (result.error && result.error.longErrorCode === 0) {
            console.log('RdnaService - GetNotifications sync response success, waiting for onGetNotifications event');
            resolve(result);
          } else {
            console.error('RdnaService - GetNotifications sync response error:', result);
            reject(result);
          }
        }
      );
    });
  }

  /**
   * Performs verify authentication for new device activation
   *
   * This method processes the user's decision on new device activation via REL-ID Verify.
   * When called with true, it sends verification notifications to registered devices.
   * When called with false, it cancels the verification process.
   * Uses sync response pattern similar to other API methods.
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Async events will be handled by event listeners for subsequent steps
   * 3. Success typically leads to LDA consent or password flow
   *
   * @param verifyAuthStatus User's decision (true = proceed with verification, false = cancel)
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async performVerifyAuth(verifyAuthStatus: boolean): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Performing verify auth with status:', verifyAuthStatus);
      
      RdnaClient.performVerifyAuth(verifyAuthStatus, response => {
        console.log('RdnaService - PerformVerifyAuth sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - PerformVerifyAuth sync response success, waiting for async events');
          resolve(result);
        } else {
          console.error('RdnaService - PerformVerifyAuth sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Initiates fallback new device activation flow
   *
   * This method provides an alternative device activation method when REL-ID Verify
   * is not available, fails, or expires. It initiates a server-configured fallback
   * challenge flow, typically triggering a getActivationCode event.
   * Uses sync response pattern similar to other API methods.
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Typically triggers getActivationCode event for alternative verification
   * 3. Async events will be handled by event listeners
   *
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async fallbackNewDeviceActivationFlow(): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Initiating fallback new device activation flow');
      
      RdnaClient.fallbackNewDeviceActivationFlow(response => {
        console.log('RdnaService - FallbackNewDeviceActivationFlow sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - FallbackNewDeviceActivationFlow sync response success, waiting for async events');
          resolve(result);
        } else {
          console.error('RdnaService - FallbackNewDeviceActivationFlow sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Updates a notification with user's action response
   *
   * This method submits the user's response to a notification action.
   * After successful API call, the SDK will trigger an onUpdateNotification event with update status.
   * Uses sync response pattern similar to other API methods.
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onUpdateNotification event will be triggered with update status
   * 3. Async events will be handled by event listeners
   *
   * @param notificationId The notification UUID to update
   * @param response The action response value selected by user
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async updateNotification(notificationId: string, response: string): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Updating notification:', notificationId, 'with response:', response);
      
      RdnaClient.updateNotification(
        notificationId,  // notificationId
        response,        // response
        result => {      // syncCallback
          console.log('RdnaService - UpdateNotification sync callback received');

          const syncResponse: RDNASyncResponse = (result as any)[0] || result;
          
          if (syncResponse.error && syncResponse.error.longErrorCode === 0) {
            console.log('RdnaService - UpdateNotification sync response success, waiting for onUpdateNotification event');
            resolve(syncResponse);
          } else {
            console.error('RdnaService - UpdateNotification sync response error:', syncResponse);
            reject(syncResponse);
          }
        }
      );
    });
  }

  /**
   * Initiates forgot password flow for password reset
   *
   * This method initiates the forgot password flow when challengeMode == 0 and ENABLE_FORGOT_PASSWORD is true.
   * It triggers a verification challenge followed by password reset process.
   * Can only be used on an active device and requires user verification.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/forgot-password
   *
   * Workflow:
   * 1. User initiates forgot password
   * 2. SDK triggers verification challenge (e.g., activation code, email OTP)
   * 3. User completes challenge
   * 4. SDK validates challenge
   * 5. User sets new password
   * 6. SDK logs user in automatically
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Success typically navigates to home screen
   * 3. Error Code 170 = Feature not supported
   * 4. Async events will be handled by event listeners
   *
   * @param userId user ID for the forgot password flow (React Native specific)
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async forgotPassword(userId?: string): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Initiating forgot password flow for userId:', userId || 'current user');

      RdnaClient.forgotPassword(userId, response => {
        console.log('RdnaService - ForgotPassword sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;

        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - ForgotPassword sync response success, starting verification challenge');
          resolve(result);
        } else {
          console.error('RdnaService - ForgotPassword sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Initiates IDV additional document scan process for document verification
   *
   * This method initiates the IDV additional document scan process for users who need
   * to provide additional identity verification documents. It's typically used when
   * the initial document verification requires supplementary documentation or when
   * users need to provide multiple document types for enhanced verification.
   * After successful API call, the SDK will trigger onIDVAdditionalDocumentScan event.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/initiateIdvAdditionalDocumentScan
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onIDVAdditionalDocumentScan event will be triggered with document scan details
   * 3. Async events will be handled by event listeners for subsequent IDV steps
   *
   * @param reason The reason for initiating additional document scan (e.g., "Additional Document Verification", "Supplementary ID Check")
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async initiateIDVAdditionalDocumentScan(reason: string): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Initiating IDV additional document scan with reason:', reason);
      
      RdnaClient.initiateIDVAdditionalDocumentScan(reason, response => {
        console.log('RdnaService - InitiateIDVAdditionalDocumentScan sync callback received');

        const result: RDNASyncResponse = (response as any)[0] || response;
        
        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - InitiateIDVAdditionalDocumentScan sync response success, waiting for onIDVAdditionalDocumentScan event');
          resolve(result);
        } else {
          console.error('RdnaService - InitiateIDVAdditionalDocumentScan sync response error:', result);
          reject(result);
        }
      });
    });
  }

}

export default RdnaService.getInstance();

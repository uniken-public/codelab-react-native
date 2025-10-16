import RdnaClient, {
  RDNALoggingLevel,
  RDNAAuthLevel,
  RDNAAuthenticatorType,
} from 'react-native-rdna-client/src/index';
import { loadAgentInfo } from '../utils/connectionProfileParser';
import RdnaEventManager from './rdnaEventManager';
import type {
  RDNASyncResponse,
  RDNADeviceAuthenticationDetailsData,
  RDNADeviceAuthManagementStatusData,
} from '../types/rdnaEvents';

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
          const version = response?.response || 'Unknown';
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
   * Registers device push notification token with REL-ID SDK
   *
   * This method registers the device's FCM/APNS push notification token with the REL-ID SDK.
   * The token is used by the backend to send push notifications to this specific device.
   * Unlike other REL-ID APIs, this method is synchronous and doesn't use callbacks.
   *
   * @param token The FCM (Android) or APNS (iOS) device token string
   * @throws Error if token registration fails
   */
  setDeviceToken(token: string): void {
    console.log('RdnaService - Registering device push token with REL-ID SDK');
    console.log('RdnaService - Token length:', token.length);

    try {
      RdnaClient.setDeviceToken(token);
      console.log('RdnaService - Device push token registration successful');
    } catch (error) {
      console.error('RdnaService - Device push token registration failed:', error);
      throw new Error(`Failed to register device push token: ${error}`);
    }
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

          const result: RDNASyncResponse = response;
          
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
  async takeActionOnThreats(modifiedThreatsJson: string): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      RdnaClient.takeActionOnThreats(modifiedThreatsJson, response => {
        console.log('RdnaService - Take action on threats response received');

        const result: RDNASyncResponse = response;

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

        const result: RDNASyncResponse = response;
        
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

        const result: RDNASyncResponse = response;
        
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

        const result: RDNASyncResponse = response;
        
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

        const result: RDNASyncResponse = response;
        
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

        const result: RDNASyncResponse = response;
        
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
   * Updates password for credential update or password expiry flows
   *
   * This method is used for updating passwords in two scenarios:
   *
   * 1. Password Expiry Flow (challengeMode = 4 - RDNA_OP_UPDATE_ON_EXPIRY):
   *    - When a password is expired during login (challengeMode=0), the SDK automatically
   *      re-triggers getPassword() with challengeMode=4
   *    - The app should then call this method with both current and new passwords
   *    - On success, triggers onUserLoggedIn event for automatic login
   *
   * 2. Password Update Flow (challengeMode = 2 - RDNA_OP_UPDATE_CREDENTIALS):
   *    - When user wants to update password from dashboard/settings
   *    - After login, call getAllChallenges() to check if password update is available
   *    - Call initiateUpdateFlowForCredential('Password') to trigger getPassword with challengeMode=2
   *    - The app should then call this method with both current and new passwords
   *    - On success, triggers onUpdateCredentialResponse event (no automatic login)
   *
   * Uses sync response pattern similar to setPassword() method.
   *
   * @see https://developer.uniken.com/docs/password-expiry
   * @see https://developer.uniken.com/docs/update-credentials
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. For challengeMode=4: On success, triggers onUserLoggedIn event (automatic login)
   * 3. For challengeMode=2: On success, triggers onUpdateCredentialResponse event
   * 4. Async events will be handled by event listeners
   *
   * @param currentPassword The user's current password
   * @param newPassword The new password to set
   * @param challengeMode Challenge mode (2 = RDNA_OP_UPDATE_CREDENTIALS, 4 = RDNA_OP_UPDATE_ON_EXPIRY)
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async updatePassword(currentPassword: string, newPassword: string, challengeMode: number = 4): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Updating password with challengeMode:', challengeMode);

      RdnaClient.updatePassword(currentPassword, newPassword, challengeMode, response => {
        console.log('RdnaService - UpdatePassword sync callback received');

        const result: RDNASyncResponse = response;

        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - UpdatePassword sync response success, waiting for async events (onUpdateCredentialResponse or onUserLoggedIn)');
          resolve(result);
        } else {
          console.error('RdnaService - UpdatePassword sync response error:', result);
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

        const result: RDNASyncResponse = response;
        
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

        const result: RDNASyncResponse = response;
        
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

        const result: RDNASyncResponse = response;
        
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

          const result: RDNASyncResponse = response;
          
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
   * Gets notification history from the REL-ID SDK server
   *
   * This method fetches notification history for the current user. It follows the sync+async pattern:
   * the method returns a sync response, then triggers an onGetNotificationHistory event with history data.
   * Uses sync response pattern similar to other API methods.
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onGetNotificationHistory event will be triggered with history data
   * 3. Async events will be handled by event listeners
   *
   * @param recordCount Number of records to fetch (0 = all history records)
   * @param startIndex Index to begin fetching from (must be >= 1)
   * @param enterpriseId Enterprise ID filter (optional)
   * @param startDate Start date filter in YYYY-MM-DD format (optional)
   * @param endDate End date filter in YYYY-MM-DD format (optional)
   * @param notificationStatus Status filter (UPDATED, EXPIRED, DISCARDED, DISMISSED, etc.) (optional)
   * @param actionPerformed Action filter (Accept, Reject, NONE, etc.) (optional)
   * @param keywordSearch Keyword search filter (optional)
   * @param deviceId Device ID filter (optional)
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async getNotificationHistory(
    recordCount: number = 10,
    startIndex: number = 1,
    enterpriseId: string = '',
    startDate: string = '',
    endDate: string = '',
    notificationStatus: string = '',
    actionPerformed: string = '',
    keywordSearch: string = '',
    deviceId: string = ''
  ): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Fetching notification history with params:', {
        recordCount,
        startIndex,
        enterpriseId,
        startDate,
        endDate,
        notificationStatus,
        actionPerformed,
        keywordSearch,
        deviceId
      });

      RdnaClient.getNotificationHistory(
        recordCount,           // recordCount
        enterpriseId,          // enterpriseId
        startIndex,            // startIndex
        startDate,             // startDate
        endDate,               // endDate
        notificationStatus,    // notificationStatus
        actionPerformed,       // actionPerformed
        keywordSearch,         // keywordSearch
        deviceId,              // deviceId
        response => {          // syncCallback
          console.log('RdnaService - GetNotificationHistory sync callback received');

          const result: RDNASyncResponse = response;

          if (result.error && result.error.longErrorCode === 0) {
            console.log('RdnaService - GetNotificationHistory sync response success, waiting for onGetNotificationHistory event');
            resolve(result);
          } else {
            console.error('RdnaService - GetNotificationHistory sync response error:', result);
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

        const result: RDNASyncResponse = response;
        
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

        const result: RDNASyncResponse = response;
        
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

          const syncResponse: RDNASyncResponse = result;
          
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

        const result: RDNASyncResponse = response;

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
   * Gets all available challenges for credential updates
   *
   * This method retrieves all available credential update options for the specified user.
   * After successful API call, the SDK triggers onCredentialsAvailableForUpdate event
   * with an array of available credential types (e.g., ["Password"]).
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/getallchallenges
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onCredentialsAvailableForUpdate event will be triggered with available options
   * 3. Async events will be handled by event listeners
   *
   * @param username The username for which to retrieve available challenges
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async getAllChallenges(username: string): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Getting all available challenges for user:', username);

      RdnaClient.getAllChallenges(username, response => {
        console.log('RdnaService - GetAllChallenges sync callback received');

        const result: RDNASyncResponse = response;

        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - GetAllChallenges sync response success, waiting for onCredentialsAvailableForUpdate event');
          resolve(result);
        } else {
          console.error('RdnaService - GetAllChallenges sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Initiates update flow for a specific credential type
   *
   * This method starts the credential update flow for the specified credential type.
   * After successful API call, the SDK triggers the appropriate getXXX event based on
   * the credential type (e.g., getPassword for "Password" credential).
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/initiateupdateflowforcredential
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. For "Password", triggers getPassword event with challengeMode = 2 (RDNA_OP_UPDATE_CREDENTIALS)
   * 3. Async events will be handled by event listeners
   *
   * @param credentialType The credential type to update (e.g., "Password")
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async initiateUpdateFlowForCredential(credentialType: string): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Initiating update flow for credential:', credentialType);

      RdnaClient.initiateUpdateFlowForCredential(credentialType, response => {
        console.log('RdnaService - InitiateUpdateFlowForCredential sync callback received');

        const result: RDNASyncResponse = response;

        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - InitiateUpdateFlowForCredential sync response success, waiting for get credential event');
          resolve(result);
        } else {
          console.error('RdnaService - InitiateUpdateFlowForCredential sync response error:', result);
          reject(result);
        }
      });
    });
  }

  /**
   * Gets device authentication details
   *
   * This method retrieves the current authentication mode details and available authentication types.
   * The SDK returns the data directly in the sync callback response.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/lda-toggling
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Data is returned in the sync callback response
   * 3. Event manager will be notified to trigger handlers
   *
   * @returns Promise<RDNADeviceAuthenticationDetailsData> that resolves with authentication details
   */
  async getDeviceAuthenticationDetails(): Promise<RDNADeviceAuthenticationDetailsData> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Getting device authentication details');

      RdnaClient.getDeviceAuthenticationDetails(response => {
        console.log('RdnaService - GetDeviceAuthenticationDetails sync callback received');
        console.log('RdnaService - GetDeviceAuthenticationDetails raw response:', JSON.stringify(response));

        const rawResponse = response as any;

        // Parse the nested response - the structure is { error: {...}, response: "{...json...}" }
        let parsedData: any;
        try {
          if (rawResponse.response && typeof rawResponse.response === 'string') {
            // Response is wrapped in { response: "..." } format
            parsedData = JSON.parse(rawResponse.response);
          } else if (typeof response === 'string') {
            parsedData = JSON.parse(response);
          } else {
            parsedData = response;
          }
        } catch (error) {
          console.error('RdnaService - Failed to parse response:', error);
          parsedData = rawResponse;
        }

        console.log('RdnaService - Parsed data:', JSON.stringify(parsedData));

        // Check error from the outer response object
        if (rawResponse.error && rawResponse.error.longErrorCode === 0) {
          console.log('RdnaService - GetDeviceAuthenticationDetails sync response success');
          console.log('RdnaService - Authentication capabilities:', parsedData.authenticationCapabilities);

          // Create the final result with error from outer response and data from parsed response
          const result: RDNADeviceAuthenticationDetailsData = {
            authenticationCapabilities: parsedData.authenticationCapabilities || [],
            error: rawResponse.error
          };

          resolve(result);
        } else {
          console.error('RdnaService - GetDeviceAuthenticationDetails sync response error:', rawResponse.error);
          reject({
            authenticationCapabilities: [],
            error: rawResponse.error
          });
        }
      });
    });
  }

  /**
   * Manages device authentication modes (enables or disables LDA types)
   *
   * This method initiates the process of switching authentication modes.
   * The SDK may return data directly in the sync callback or trigger async events.
   * The flow may also trigger getPassword or getUserConsentForLDA events based on the scenario.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/lda-toggling
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Data may be returned in sync callback or via onDeviceAuthManagementStatus event
   * 3. May trigger getPassword event for password verification
   * 4. May trigger getUserConsentForLDA event for user consent
   * 5. Async events will be handled by event listeners
   *
   * @param isEnabled true to enable, false to disable the authentication type
   * @param authType The LDA type to be managed (1=Touch ID, 2=Face ID, 3=Pattern, 4=Biometric, 9=General LDA)
   * @returns Promise<RDNASyncResponse | RDNADeviceAuthManagementStatusData> that resolves with response
   */
  async manageDeviceAuthenticationModes(isEnabled: boolean, authType: number): Promise<RDNASyncResponse | RDNADeviceAuthManagementStatusData> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Managing device authentication modes:', { isEnabled, authType });

      RdnaClient.manageDeviceAuthenticationModes(isEnabled, authType, response => {
        console.log('RdnaService - ManageDeviceAuthenticationModes sync callback received');
        console.log('RdnaService - ManageDeviceAuthenticationModes raw response:', JSON.stringify(response));

        const rawResponse = response as any;

        // Parse the nested response - the structure is { error: {...}, response: "{...json...}" }
        let parsedData: any;
        try {
          if (rawResponse.response && typeof rawResponse.response === 'string') {
            // Response is wrapped in { response: "..." } format
            parsedData = JSON.parse(rawResponse.response);
          } else if (typeof response === 'string') {
            parsedData = JSON.parse(response);
          } else {
            parsedData = response;
          }
        } catch (error) {
          console.error('RdnaService - Failed to parse response:', error);
          parsedData = rawResponse;
        }

        console.log('RdnaService - Parsed data:', JSON.stringify(parsedData));

        // Check error from the outer response object
        if (rawResponse.error && rawResponse.error.longErrorCode === 0) {
          console.log('RdnaService - ManageDeviceAuthenticationModes sync response success');

          // Check if the parsed data has management status information
          if (parsedData.userID || parsedData.OpMode !== undefined || parsedData.ldaType !== undefined) {
            console.log('RdnaService - Received management status in sync callback');

            // Create the final result with error from outer response and data from parsed response
            const result: RDNADeviceAuthManagementStatusData = {
              userID: parsedData.userID || '',
              OpMode: parsedData.OpMode,
              ldaType: parsedData.ldaType,
              status: parsedData.status,
              error: rawResponse.error
            };

            // Trigger the event handler manually
            const eventManager = this.eventManager;
            const handler = (eventManager as any).deviceAuthManagementStatusHandler;
            if (handler) {
              handler(result);
            }

            resolve(result);
          } else {
            // Simple sync response without management status
            resolve(rawResponse);
          }
        } else {
          console.error('RdnaService - ManageDeviceAuthenticationModes sync response error:', rawResponse.error);
          reject(rawResponse);
        }
      });
    });
  }

  
  // =============================================================================
  // DATA SIGNING METHODS
  // =============================================================================

  /**
   * Authenticates user and signs data payload
   *
   * This method initiates the data signing flow with step-up authentication.
   * It requires user authentication (typically biometric/PIN/password) and
   * cryptographically signs the provided payload upon successful authentication.
   *
   * The method follows an async callback pattern:
   * 1. Initial sync response indicates if the request was accepted
   * 2. SDK may trigger getPasswordStepUpAuthentication for step-up auth
   * 3. Final result comes through onAuthenticateUserAndSignData event
   *
   * @see https://developer.uniken.com/docs/data-signing
   *
   * Response Validation Logic:
   * 1. Check error.shortErrorCode: 0 = success, > 0 = error
   * 2. If successful, await getPasswordStepUpAuthentication callback
   * 3. Final signature data comes via onAuthenticateUserAndSignData event
   *
   * @param payload The data payload to be cryptographically signed
   * @param authLevel Authentication level (0-4, recommended: 4 for biometric)
   * @param authenticatorType Type of authenticator (0-3)
   * @param reason Human-readable reason for signing (shown to user)
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async authenticateUserAndSignData(
    payload: string,
    authLevel: RDNAAuthLevel,
    authenticatorType: RDNAAuthenticatorType,
    reason: string
  ): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Initiating data signing:', {
        payloadLength: payload.length,
        authLevel,
        authenticatorType,
        reason,
      });

      RdnaClient.authenticateUserAndSignData(
        payload,
        authLevel,
        authenticatorType,
        reason,
        response => {
          console.log('RdnaService - AuthenticateUserAndSignData sync callback received');
          console.log('RdnaService - AuthenticateUserAndSignData sync raw response:', response);

          const result: RDNASyncResponse = response;

          if (result.error && result.error.longErrorCode === 0) {
            console.log('RdnaService - AuthenticateUserAndSignData sync response success, waiting for authentication challenge');
            resolve(result);
          } else {
            console.error('RdnaService - AuthenticateUserAndSignData sync response error:', result);
            reject(result);
          }
        }
      );
    });
  }

  /**
   * Resets the data signing authentication state
   *
   * This method clears any cached authentication state from the data signing flow.
   * Should be called after completing data signing or when cancelling the flow
   * to ensure clean state for subsequent operations.
   * Uses sync response pattern similar to other API methods.
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. No async events are triggered by this method
   *
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async resetAuthenticateUserAndSignDataState(): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Resetting data signing authentication state');

      RdnaClient.resetAuthenticateUserAndSignDataState(response => {
        console.log('RdnaService - ResetAuthenticateUserAndSignDataState sync callback received');

        const result: RDNASyncResponse = response;

        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - ResetAuthenticateUserAndSignDataState sync response success');
          resolve(result);
        } else {
          console.error('RdnaService - ResetAuthenticateUserAndSignDataState sync response error:', result);
          reject(result);
        }
      });
    });
  }

  
  // =============================================================================
  // DEVICE MANAGEMENT API
  // =============================================================================

  /**
   * Gets registered device details for the current user
   *
   * This method fetches all devices registered to the user's account. It follows the sync+async pattern:
   * the method returns a sync response, then triggers an onGetRegistredDeviceDetails event with device data.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/get-registered-devices
   *
   * Response Validation Logic (following reference app pattern):
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onGetRegistredDeviceDetails event will be triggered with device list
   * 3. Async events will be handled by event listeners
   * 4. StatusCode 146 indicates cooling period is active for device management actions
   *
   * @param userId The user ID to fetch device details for
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async getRegisteredDeviceDetails(userId: string): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Fetching registered device details for user:', userId);

      RdnaClient.getRegisteredDeviceDetails(
        userId,          // userId
        response => {    // syncCallback
          console.log('RdnaService - GetRegisteredDeviceDetails sync callback received');

          const result: RDNASyncResponse = response;

          if (result.error && result.error.longErrorCode === 0) {
            console.log('RdnaService - GetRegisteredDeviceDetails sync response success, waiting for onGetRegistredDeviceDetails event');
            resolve(result);
          } else {
            console.error('RdnaService - GetRegisteredDeviceDetails sync response error:', result);
            reject(result);
          }
        }
      );
    });
  }

  /**
   * Updates device details (rename or delete)
   *
   * This method updates device information including renaming or deleting a device.
   * It follows the sync+async pattern: the method returns a sync response,
   * then triggers an onUpdateDeviceDetails event with operation result.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/update-device-details
   *
   * SDK Payload Format:
   * {
   *   "device": [{
   *     "devUUID": "device-uuid",
   *     "devName": "new-device-name",
   *     "status": "Update" | "Delete"
   *   }]
   * }
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onUpdateDeviceDetails event will be triggered with operation result
   * 3. Async events will be handled by event listeners
   * 4. StatusCode 100 indicates successful operation
   * 5. StatusCode 146 indicates cooling period is active (operation not allowed)
   *
   * @param userId The user ID who owns the device
   * @param devUuid The device UUID to update
   * @param devName The new device name (for rename) or empty string (for delete)
   * @param operationType Operation type: 0 = rename (status="Update"), 1 = delete (status="Delete")
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async updateDeviceDetails(
    userId: string,
    devUuid: string,
    devName: string,
    operationType: number
  ): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      const operation = operationType === 0 ? 'rename' : 'delete';
      console.log(`RdnaService - Updating device details (${operation}) for user:`, userId);
      console.log('RdnaService - Device UUID:', devUuid);
      if (operationType === 0) {
        console.log('RdnaService - New device name:', devName);
      }

      // SDK expects JSON string payload with device array format
      // Status field: "Update" for rename, "Delete" for delete
      const status = operationType === 0 ? 'Update' : 'Delete';

      const payload = JSON.stringify({
        device: [{
          devUUID: devUuid,
          devName: devName,
          status: status
        }]
      });

      console.log('RdnaService - JSON payload:', payload);

      RdnaClient.updateDeviceDetails(
        userId,          // userId
        payload,         // jsonDevices (JSON string with device update info)
        response => {    // syncCallback
          console.log('RdnaService - UpdateDeviceDetails sync callback received');
          console.log('RdnaService - UpdateDeviceDetails sync raw response:', JSON.stringify(response));

          const result: RDNASyncResponse = response;

          if (result.error && result.error.longErrorCode === 0) {
            console.log('RdnaService - UpdateDeviceDetails sync response success, waiting for onUpdateDeviceDetails event');
            resolve(result);
          } else {
            console.error('RdnaService - UpdateDeviceDetails sync response error:', result);
            reject(result);
          }
        }
      );
    });
  }

}

export default RdnaService.getInstance();

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
}

export default RdnaService.getInstance();

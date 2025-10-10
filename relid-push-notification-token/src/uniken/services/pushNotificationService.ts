/**
 * Push Notification Service
 *
 * Simplified Android FCM integration for REL-ID SDK.
 * Handles token registration with REL-ID backend via rdnaService.setDeviceToken().
 *
 * Features:
 * - Android FCM token retrieval and registration
 * - Automatic token refresh handling
 * - REL-ID SDK integration
 *
 * Usage:
 * const pushService = PushNotificationService.getInstance();
 * await pushService.initialize();
 */

import { Platform, PermissionsAndroid } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { RdnaService } from './rdnaService';

/**
 * Push Notification Service
 * Simplified singleton for FCM token management
 */
export class PushNotificationService {
  private static instance: PushNotificationService;
  private rdnaService: RdnaService;
  private isInitialized: boolean = false;

  private constructor() {
    this.rdnaService = RdnaService.getInstance();
  }

  /**
   * Gets singleton instance
   */
  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Initialize FCM and register token with REL-ID SDK
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('PushNotificationService - Already initialized');
      return;
    }

    // Android only
    if (Platform.OS !== 'android') {
      console.log('PushNotificationService - Android only, skipping');
      return;
    }

    console.log('PushNotificationService - Starting FCM initialization');

    try {
      // Trust React Native Firebase auto-initialization from google-services.json
      console.log('PushNotificationService - Relying on Firebase auto-initialization');

      // Request permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('PushNotificationService - Permission not granted');
        return;
      }

      // Get and register initial token
      await this.getAndRegisterToken();

      // Set up token refresh listener
      this.setupTokenRefreshListener();

      this.isInitialized = true;
      console.log('PushNotificationService - Initialization complete');
    } catch (error) {
      console.error('PushNotificationService - Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Request FCM permissions (Android 13+ support)
   */
  private async requestPermissions(): Promise<boolean> {
    try {
      console.log('PushNotificationService - Platform OS:', Platform.OS);
      console.log('PushNotificationService - Platform Version:', Platform.Version);

      // Android 13+ (API 33+) requires POST_NOTIFICATIONS permission
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        console.log('PushNotificationService - Requesting POST_NOTIFICATIONS permission (Android 13+)');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('PushNotificationService - POST_NOTIFICATIONS result:', granted);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('PushNotificationService - POST_NOTIFICATIONS permission denied');
          return false;
        }
      }

      // Request FCM authorization
      console.log('PushNotificationService - Requesting FCM authorization');

      // Use modular API - get app then messaging
      const app = getApp();
      const messagingInstance = messaging(app);
      console.log('PushNotificationService - Got messaging instance');

      const authStatus = await messagingInstance.requestPermission();
      console.log('PushNotificationService - FCM auth status:', authStatus);
      console.log('PushNotificationService - Expected AUTHORIZED value:', messaging.AuthorizationStatus.AUTHORIZED);

      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;

      console.log('PushNotificationService - FCM permission:', enabled ? 'granted' : 'denied');
      return enabled;
    } catch (error) {
      console.error('PushNotificationService - Permission request failed:', error);
      return false;
    }
  }

  /**
   * Get FCM token and register with REL-ID SDK
   */
  private async getAndRegisterToken(): Promise<void> {
    try {
      console.log('PushNotificationService - Getting FCM token');

      const app = getApp();
      const token = await messaging(app).getToken();
      if (!token) {
        console.warn('PushNotificationService - No FCM token received');
        return;
      }

      console.log('PushNotificationService - FCM token received, length:', token.length);
      console.log('PushNotificationService - FCM TOKEN:', token);

      // Register with REL-ID SDK
      this.rdnaService.setDeviceToken(token);

      console.log('PushNotificationService - Token registered with REL-ID SDK');
    } catch (error) {
      console.error('PushNotificationService - Token registration failed:', error);
      throw error;
    }
  }

  /**
   * Set up automatic token refresh
   */
  private setupTokenRefreshListener(): void {
    console.log('PushNotificationService - Setting up token refresh listener');

    const app = getApp();
    messaging(app).onTokenRefresh(async (token) => {
      console.log('PushNotificationService - Token refreshed, length:', token.length);
      console.log('PushNotificationService - REFRESHED FCM TOKEN:', token);
      try {
        // Register new token with REL-ID SDK
        this.rdnaService.setDeviceToken(token);
        console.log('PushNotificationService - Refreshed token registered with REL-ID SDK');
      } catch (error) {
        console.error('PushNotificationService - Token refresh registration failed:', error);
      }
    });
  }

  /**
   * Get current FCM token (for debugging)
   */
  async getCurrentToken(): Promise<string | null> {
    try {
      if (Platform.OS !== 'android') {
        return null;
      }
      const app = getApp();
      return await messaging(app).getToken();
    } catch (error) {
      console.error('PushNotificationService - Failed to get current token:', error);
      return null;
    }
  }

  /**
   * Cleanup (reset initialization state)
   */
  cleanup(): void {
    console.log('PushNotificationService - Cleanup');
    this.isInitialized = false;
  }
}

// Export singleton instance
const pushNotificationService = PushNotificationService.getInstance();
export default pushNotificationService;
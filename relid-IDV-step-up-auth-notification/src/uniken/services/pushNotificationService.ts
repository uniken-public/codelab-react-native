/**
 * Push Notification Service
 *
 * Cross-platform FCM integration for REL-ID SDK (Android & iOS).
 * Handles token registration with REL-ID backend via rdnaService.setDeviceToken().
 *
 * Features:
 * - Android & iOS FCM token retrieval and registration
 * - Android 13+ POST_NOTIFICATIONS permission handling
 * - iOS authorization via @react-native-firebase/messaging (no AppDelegate changes needed)
 * - Automatic token refresh handling
 * - REL-ID SDK integration
 *
 * iOS Note: Requires GoogleService-Info.plist and APNS certificate uploaded to Firebase Console.
 * The @react-native-firebase/messaging library handles APNS delegate methods automatically via swizzling.
 *
 * Usage:
 * const pushService = PushNotificationService.getInstance();
 * await pushService.initialize();
 */

import { Platform, PermissionsAndroid } from 'react-native';
import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { RdnaService } from './rdnaService';

/**
 * Push Notification Service
 * Cross-platform singleton for FCM token management (Android & iOS)
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
   * Supports both Android and iOS platforms
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('PushNotificationService - Already initialized');
      return;
    }

    console.log(`PushNotificationService - Starting FCM initialization for ${Platform.OS}`);

    try {
      // Ensure Firebase is initialized (auto-init or manual fallback)
      await this.ensureFirebaseInitialized();

      // Request permissions (handles both Android and iOS)
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn(`PushNotificationService - Permission not granted on ${Platform.OS}`);
        return;
      }

      // Get and register initial token
      await this.getAndRegisterToken();

      // Set up token refresh listener
      this.setupTokenRefreshListener();

      this.isInitialized = true;
      console.log(`PushNotificationService - Initialization complete for ${Platform.OS}`);
    } catch (error) {
      console.error('PushNotificationService - Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Ensure Firebase is initialized
   * React Native Firebase auto-initializes natively, this just verifies it's ready
   */
  private async ensureFirebaseInitialized(): Promise<void> {
    try {
      // Give native auto-initialization a moment to complete
      // React Native Firebase initializes from native side before JS loads
      await new Promise(resolve => setTimeout(resolve, 100));

      const apps = getApps();
      if (apps.length === 0) {
        console.warn('PushNotificationService - No Firebase app found after native init');
        console.warn('PushNotificationService - This may indicate GoogleService-Info.plist is not being loaded');
        throw new Error('Firebase failed to auto-initialize. Check GoogleService-Info.plist configuration.');
      } else {
        console.log('PushNotificationService - Firebase already initialized via native auto-init');
      }
    } catch (error) {
      console.error('PushNotificationService - Firebase initialization check failed:', error);
      throw error;
    }
  }

  /**
   * Request FCM permissions
   * Android: Handles POST_NOTIFICATIONS permission for Android 13+
   * iOS: Requests notification authorization (Alert, Sound, Badge)
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

      // Request FCM authorization (works for both Android and iOS)
      console.log(`PushNotificationService - Requesting FCM authorization for ${Platform.OS}`);

      // Use modular API - get app then messaging
      const app = getApp();
      const messagingInstance = messaging(app);
      console.log('PushNotificationService - Got messaging instance');

      const authStatus = await messagingInstance.requestPermission();
      console.log('PushNotificationService - FCM auth status:', authStatus);
      console.log('PushNotificationService - AUTHORIZED value:', messaging.AuthorizationStatus.AUTHORIZED);
      console.log('PushNotificationService - PROVISIONAL value:', messaging.AuthorizationStatus.PROVISIONAL);

      // iOS supports PROVISIONAL authorization (quiet notifications without prompt)
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log('PushNotificationService - FCM permission:', enabled ? 'granted' : 'denied');
      return enabled;
    } catch (error) {
      console.error('PushNotificationService - Permission request failed:', error);
      return false;
    }
  }

  /**
   * Get FCM token and register with REL-ID SDK
   * Android: Gets FCM registration token
   * iOS: Gets FCM token (mapped from APNS token by Firebase automatically)
   */
  private async getAndRegisterToken(): Promise<void> {
    try {
      console.log(`PushNotificationService - Getting FCM token for ${Platform.OS}`);

      const app = getApp();

      // On iOS, check if APNS token is available first
      if (Platform.OS === 'ios') {
        const apnsToken = await messaging(app).getAPNSToken();
        if (apnsToken) {
          console.log('PushNotificationService - iOS APNS token available, length:', apnsToken.length);
        } else {
          console.log('PushNotificationService - iOS APNS token not yet available, will retry via getToken()');
        }
      }

      const token = await messaging(app).getToken();
      if (!token) {
        console.warn(`PushNotificationService - No FCM token received for ${Platform.OS}`);
        return;
      }

      console.log(`PushNotificationService - FCM token received for ${Platform.OS}, length:`, token.length);
      console.log('PushNotificationService - FCM TOKEN:', token);

      // Register with REL-ID SDK (works for both Android FCM and iOS FCM tokens)
      this.rdnaService.setDeviceToken(token);

      console.log('PushNotificationService - Token registered with REL-ID SDK');
    } catch (error) {
      console.error('PushNotificationService - Token registration failed:', error);
      throw error;
    }
  }

  /**
   * Set up automatic token refresh
   * Handles token refresh for both Android and iOS
   */
  private setupTokenRefreshListener(): void {
    console.log(`PushNotificationService - Setting up token refresh listener for ${Platform.OS}`);

    const app = getApp();
    messaging(app).onTokenRefresh(async (token) => {
      console.log(`PushNotificationService - Token refreshed for ${Platform.OS}, length:`, token.length);
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
   * Works for both Android and iOS
   */
  async getCurrentToken(): Promise<string | null> {
    try {
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
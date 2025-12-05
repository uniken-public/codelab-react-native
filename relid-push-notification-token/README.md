# REL-ID React Native Codelab: Push Notification Integration

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![Push Notifications](https://img.shields.io/badge/Push%20Notifications-FCM-orange.svg)]()
[![Android](https://img.shields.io/badge/Android-13%2B%20Support-green.svg)]()

> **Codelab Advanced:** Master Push Notification Integration with REL-ID SDK token management

This folder contains the source code for the solution demonstrating [REL-ID Push Notification Integration](https://codelab.uniken.com/codelabs/rn-push-notification-integration/index.html?index=..%2F..index#0) with secure token registration.

## 🔔 What You'll Learn

In this advanced push notification codelab, you'll master production-ready FCM integration patterns:

- ✅ **FCM Token Management**: Generate and manage Firebase Cloud Messaging tokens for Android
- ✅ **REL-ID SDK Integration**: Register device tokens using `setDeviceToken()` API
- ✅ **Permission Handling**: Handle Android 13+ POST_NOTIFICATIONS permission requirements
- ✅ **Service Architecture**: Implement singleton pattern for push notification services
- ✅ **Token Refresh**: Automatic token refresh handling with REL-ID re-registration
- ✅ **Provider Pattern**: React context providers for automatic service initialization
- ✅ **Error Handling**: Comprehensive error management and logging strategies

## 🎯 Learning Objectives

By completing this Push Notification Integration codelab, you'll be able to:

1. **Implement FCM token generation** with Firebase Cloud Messaging integration
2. **Register device tokens with REL-ID** using the secure `setDeviceToken()` API
3. **Handle Android permissions** including Android 13+ notification permissions
4. **Build scalable service architecture** with singleton patterns and dependency injection
5. **Manage token lifecycle** with automatic refresh and re-registration
6. **Create seamless initialization** with React context providers
7. **Debug push notification flows** and troubleshoot token-related issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you have:

- **React Native Development Environment** - Complete React Native CLI setup
- **Android Development** - Android SDK and development tools configured
- **Firebase Project** - Google Firebase project with FCM enabled
- **REL-ID SDK Integration** - Basic understanding of REL-ID SDK architecture
- **TypeScript Knowledge** - Familiarity with TypeScript interfaces and patterns
- **Android Permissions** - Understanding of Android permission model

## 📁 Push Notification Project Structure

```
relid-push-notification-token/
├── 📱 React Native Push Notification App
│   ├── android/                 # Android-specific configuration + Google Services
│   ├── ios/                     # iOS-specific configuration
│   └── react-native-rdna-client/ # REL-ID Native Bridge
│
├── 📦 Push Notification Source Architecture
│   └── src/
│       ├── tutorial/            # Tutorial screens and navigation
│       │   ├── navigation/      # App navigation structure
│       │   │   ├── AppNavigator.tsx        # Main navigation stack
│       │   │   ├── DrawerNavigator.tsx     # Drawer navigation
│       │   │   └── NavigationService.ts    # Navigation utilities
│       │   └── screens/         # Tutorial and demo screens
│       │       ├── components/  # Reusable UI components
│       │       │   ├── Button.tsx                # Interactive buttons
│       │       │   ├── Input.tsx                 # Form inputs
│       │       │   ├── StatusBanner.tsx          # Status displays
│       │       │   └── ...                       # Other components
│       │       ├── mfa/         # MFA integration screens
│       │       ├── notification/ # 🔔 Push Notification Demo
│       │       │   ├── GetNotificationsScreen.tsx # Token display and testing
│       │       │   └── index.ts                   # Notification exports
│       │       └── tutorial/    # Base tutorial screens
│       └── uniken/              # 🛡️ REL-ID SDK Integration
│           ├── providers/       # 🆕 Push Notification Providers
│           │   ├── SDKEventProvider.tsx          # SDK event handling
│           │   └── PushNotificationProvider.tsx  # 🆕 Auto-initialization provider
│           ├── services/        # 🆕 Push Notification Services
│           │   ├── rdnaService.ts                # 🆕 Enhanced with setDeviceToken()
│           │   ├── pushNotificationService.ts    # 🆕 FCM token management singleton
│           │   └── rdnaEventManager.ts           # SDK event management
│           ├── types/           # 📝 TypeScript definitions
│           │   ├── rdnaEvents.ts                # Event type definitions
│           │   └── index.ts                     # Type exports
│           └── utils/           # Helper utilities
│               ├── connectionProfileParser.ts  # Profile configuration
│               └── passwordPolicyUtils.ts      # Utility functions
│
└── 📚 Production Configuration
    ├── package.json             # Dependencies with Firebase packages
    ├── android/                 # 🆕 Google Services configuration
    │   ├── build.gradle         # Google Services plugin
    │   └── app/build.gradle     # App-level Google Services
    └── tsconfig.json
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-push-notification-token

# Place the react-native-rdna-client plugin
# at root folder of this project (refer to Project Structure above for more info)

# Install dependencies (includes Firebase packages)
npm install

# iOS additional setup (required for CocoaPods)
cd ios && pod install && cd ..

# Run the application
npx react-native run-android
# or
npx react-native run-ios
```

### Verify Push Notification Features

Once the app launches, verify these push notification capabilities:

1. ✅ FCM token generation on Android devices
2. ✅ Automatic permission requests for Android 13+ devices
3. ✅ REL-ID SDK token registration via `setDeviceToken()` API
4. ✅ Token refresh handling with automatic re-registration
5. ✅ Service initialization through PushNotificationProvider
6. ✅ Token display and logging for debugging purposes

## 🎓 Learning Checkpoints

### Checkpoint 1: REL-ID setDeviceToken Integration
- [ ] I understand the purpose of `setDeviceToken()` API in REL-ID architecture
- [ ] I can implement REL-ID SDK token registration with proper error handling
- [ ] I know how to integrate FCM tokens with REL-ID's secure communication channel
- [ ] I can debug REL-ID token registration issues and failures
- [ ] I understand the two-channel security model (FCM wake-up + REL-ID secure channel)

### Checkpoint 2: Service Architecture & Singleton Pattern
- [ ] I can implement singleton pattern for push notification service management
- [ ] I understand dependency injection patterns with RdnaService integration
- [ ] I can create scalable service architecture with proper initialization
- [ ] I know how to manage service state and prevent double initialization
- [ ] I can implement cleanup and lifecycle management for push notification services


## 🔄 Push Notification User Flow

### Token Registration Flow
1. **App launches** → PushNotificationProvider initializes services
2. **Token generation** → Device token generated and retrieved
3. **REL-ID registration** → `setDeviceToken()` registers token with REL-ID backend
4. **Service ready** → Push notification service initialized successfully

### Token Refresh Flow
1. **Token refresh** → System automatically refreshes device token
2. **REL-ID re-registration** → `setDeviceToken()` updates REL-ID backend with new token
3. **Service continuity** → Push notification service continues with updated token

## 📚 Advanced Resources

- **REL-ID Push Notification Documentation**: [Push Notification Integration Guide](https://developer.uniken.com/docs/push-notifications)
- **Firebase Cloud Messaging**: [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)
- **Android Permissions**: [Notification Permission Guide](https://developer.android.com/develop/ui/views/notifications/notification-permission)

## 💡 Pro Tips

1. **Initialize early** - Set up REL-ID token registration as early as possible in app lifecycle
2. **Use singleton patterns** - Ensure single point of control for REL-ID service management
3. **Handle setDeviceToken errors** - Always wrap `setDeviceToken()` calls in try-catch blocks
4. **Test token refresh** - Verify automatic token refresh and REL-ID re-registration works correctly
5. **Secure token handling** - Never expose device tokens in production logs or analytics

## 🔗 Key Implementation Files

### Core Push Notification Service
```typescript
// pushNotificationService.ts - FCM Token Management
export class PushNotificationService {
  private static instance: PushNotificationService;
  private rdnaService: RdnaService;
  private isInitialized: boolean = false;

  async initialize(): Promise<void> {
    // Platform check, permissions, token generation, REL-ID registration
    const hasPermission = await this.requestPermissions();
    if (hasPermission) {
      await this.getAndRegisterToken();
      this.setupTokenRefreshListener();
    }
  }

  private async getAndRegisterToken(): Promise<void> {
    const token = await messaging().getToken();
    // Register with REL-ID SDK
    this.rdnaService.setDeviceToken(token);
  }
}
```

### REL-ID SDK Integration
```typescript
// rdnaService.ts - Device Token Registration
setDeviceToken(token: string): void {
  console.log('RdnaService - Registering device push token with REL-ID SDK');

  try {
    // Register token with REL-ID native SDK
    RdnaClient.setDeviceToken(token);
    console.log('RdnaService - Device push token registration successful');
  } catch (error) {
    console.error('RdnaService - Device push token registration failed:', error);
    throw new Error(`Failed to register device push token: ${error}`);
  }
}
```

### Provider Integration Pattern
```tsx
// PushNotificationProvider.tsx - Auto-initialization
export const PushNotificationProvider: React.FC<PushNotificationProviderProps> = ({
  children
}) => {
  useEffect(() => {
    const initializePushNotifications = async () => {
      try {
        await pushNotificationService.initialize();
      } catch (error) {
        console.error('PushNotificationProvider - Initialization failed:', error);
      }
    };

    initializePushNotifications();
  }, []);

  return <>{children}</>;
};
```

### Permission Request Implementation
```typescript
// Permission handling with Android 13+ support
private async requestPermissions(): Promise<boolean> {
  // Android 13+ (API 33+) requires POST_NOTIFICATIONS permission
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      return false;
    }
  }

  // Request FCM authorization
  const authStatus = await messaging().requestPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
}
```

---

**🔔 Congratulations! You've mastered Push Notification Integration with REL-ID SDK!**

*You're now equipped to implement secure, efficient push notification systems that integrate Firebase Cloud Messaging with REL-ID's secure communication architecture. Use this knowledge to create robust notification systems that enhance user experience while maintaining the highest security standards.*

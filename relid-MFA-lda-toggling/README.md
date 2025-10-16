# REL-ID React Native Codelab: LDA Toggling Management

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![LDA Toggling](https://img.shields.io/badge/LDA%20Toggling-Enabled-orange.svg)]()
[![Authentication Modes](https://img.shields.io/badge/Authentication%20Modes-Password%2FLDA-purple.svg)]()

> **Codelab Advanced:** Master LDA Toggling workflows with REL-ID SDK for seamless authentication mode switching

This folder contains the source code for the solution demonstrating [REL-ID LDA Toggling Management](https://developer.uniken.com/docs/lda-toggling) using secure authentication mode switching between password and Local Device Authentication (LDA).

## 🔐 What You'll Learn

In this advanced LDA toggling codelab, you'll master production-ready authentication mode switching patterns:

- ✅ **Device Authentication Detection**: `getDeviceAuthenticationDetails()` API to retrieve supported LDA types
- ✅ **Interactive Toggle Interface**: User-friendly switches for enabling/disabling authentication methods
- ✅ **Authentication Mode Management**: `manageDeviceAuthenticationModes()` API for toggling LDA
- ✅ **Event-Driven Status Updates**: Handle `onDeviceAuthManagementStatus` for real-time feedback
- ✅ **Challenge Mode Routing**: Manage password verification (modes 5, 14, 15) and consent flows (mode 16)
- ✅ **Two-Way Switching**: Enable switching from Password to LDA and LDA to Password
- ✅ **Type-Safe Implementation**: Complete TypeScript interfaces for LDA data structures

## 🎯 Learning Objectives

By completing this LDA Toggling Management codelab, you'll be able to:

1. **Implement LDA toggling workflows** with device authentication capability detection
2. **Build interactive toggle interfaces** with real-time status updates and loading states
3. **Handle authentication mode switching** from password to LDA and vice versa
4. **Create seamless user experiences** with proper challenge mode routing and revalidation
5. **Design event-driven LDA management** with proper SDK event handling
6. **Integrate LDA toggling functionality** with existing MFA authentication workflows
7. **Debug LDA toggling flows** and troubleshoot authentication mode switching issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/rn-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- **[REL-ID Forgot Password Codelab](https://codelab.uniken.com/codelabs/rn-forgot-password-flow/index.html?index=..%2F..index#0)** - Understanding of challenge modes and revalidation flows
- Understanding of password verification and LDA consent flows
- Experience with React Native UI components and state management
- Knowledge of REL-ID SDK event-driven architecture patterns
- Familiarity with biometric authentication on mobile devices
- Basic understanding of authentication mode switching concepts

## 📁 LDA Toggling Management Project Structure

```
relid-MFA-lda-toggling/
├── 📱 Enhanced React Native MFA + LDA Toggling App
│   ├── android/                 # Android-specific configuration
│   ├── ios/                     # iOS-specific configuration
│   └── react-native-rdna-client/ # REL-ID Native Bridge
│
├── 📦 LDA Toggling Source Architecture
│   └── src/
│       ├── tutorial/            # Enhanced MFA + LDA Toggling flow
│       │   ├── navigation/      # Enhanced navigation with LDA toggling support
│       │   │   ├── AppNavigator.tsx        # Stack navigation
│       │   │   ├── DrawerNavigator.tsx     # Drawer navigation + LDA Toggling screen
│       │   │   └── NavigationService.ts    # Navigation utilities
│       │   └── screens/         # Enhanced screens with LDA toggling
│       │       ├── components/  # Enhanced UI components
│       │       │   ├── Button.tsx                # Loading and disabled states
│       │       │   ├── Input.tsx                 # Password input with masking
│       │       │   ├── StatusBanner.tsx          # Error and warning displays
│       │       │   └── ...                       # Other reusable components
│       │       ├── lda-toggling/ # 🆕 LDA Toggling Management
│       │       │   └── LDATogglingScreen.tsx     # 🆕 Interactive LDA toggle interface
│       │       ├── mfa/         # 🔐 MFA screens + LDA Toggling support
│       │       │   ├── VerifyPasswordScreen.tsx  # Password verification for toggling
│       │       │   ├── SetPasswordScreen.tsx     # Password creation when disabling LDA
│       │       │   ├── UserLDAConsentScreen.tsx  # LDA consent for enabling biometric
│       │       │   ├── CheckUserScreen.tsx       # Enhanced user validation
│       │       │   ├── DashboardScreen.tsx       # Enhanced dashboard
│       │       │   └── ...                       # Other MFA screens
│       │       ├── notification/ # Notification Management System
│       │       │   ├── GetNotificationsScreen.tsx # Server notification management
│       │       │   └── index.ts                   # Notification exports
│       │       └── tutorial/    # Base tutorial screens
│       └── uniken/              # 🛡️ Enhanced REL-ID Integration
│           ├── providers/       # Enhanced providers
│           │   └── SDKEventProvider.tsx          # Complete event handling
│           ├── services/        # 🆕 Enhanced SDK service layer
│           │   ├── rdnaService.ts                # Added LDA toggling APIs
│           │   │                                # - getDeviceAuthenticationDetails()
│           │   │                                # - manageDeviceAuthenticationModes()
│           │   │                                # - setPassword() for LDA disable
│           │   │                                # - setUserConsentForLDA() for LDA enable
│           │   └── rdnaEventManager.ts           # Complete event management
│           │                                    # - onDeviceAuthManagementStatus handler
│           │                                    # - getPassword handler (modes 5, 14, 15)
│           │                                    # - getUserConsentForLDA handler (mode 16)
│           ├── types/           # 📝 Enhanced TypeScript definitions
│           │   ├── rdnaEvents.ts                # Complete event type definitions
│           │   │                                # - RDNAAuthenticationCapability
│           │   │                                # - RDNADeviceAuthenticationDetailsData
│           │   │                                # - RDNADeviceAuthManagementStatusData
│           │   │                                # - RDNADeviceAuthManagementStatusCallback
│           │   └── index.ts                     # Type exports
│           └── utils/           # Helper utilities
│               ├── connectionProfileParser.ts  # Profile configuration
│               └── passwordPolicyUtils.ts      # Password validation
│
└── 📚 Production Configuration
    ├── package.json             # Dependencies
    ├── tsconfig.json
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-MFA-lda-toggling

# Place the react-native-rdna-client plugin
# at root folder of this project (refer to Project Structure above for more info)

# Install dependencies
npm install

# iOS additional setup (required for CocoaPods)
cd ios && pod install && cd ..

# Run the application
npx react-native run-android
# or
npx react-native run-ios
```

### Verify LDA Toggling Features

Once the app launches, verify these LDA toggling capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ LDA Toggling screen accessible from drawer navigation
3. ✅ `getDeviceAuthenticationDetails()` API retrieves available LDA types
4. ✅ Interactive toggle switches for enabling/disabling authentication methods
5. ✅ `manageDeviceAuthenticationModes()` API integration with proper error handling
6. ✅ Password verification flow (challenge modes 5, 15) for authentication changes
7. ✅ LDA consent flow (challenge mode 16) for enabling biometric authentication
8. ✅ Password creation flow (challenge mode 14) for disabling LDA
9. ✅ Real-time status updates via `onDeviceAuthManagementStatus` event

## 🎓 Learning Checkpoints

### Checkpoint 1: Device Authentication Detection
- [ ] I understand how to retrieve device authentication capabilities using `getDeviceAuthenticationDetails()`
- [ ] I can parse authentication capability data (authenticationType and isConfigured)
- [ ] I know the different authentication type mappings (1=Touch ID, 2=Face ID, 4=Biometric, 9=LDA)
- [ ] I can handle devices with no LDA capabilities available
- [ ] I understand when to display LDA toggling UI based on available capabilities

### Checkpoint 2: Authentication Mode Management
- [ ] I can implement `manageDeviceAuthenticationModes()` API with proper parameters (isEnabled, authType)
- [ ] I understand the sync callback and async event pattern for this API
- [ ] I know how to handle loading states during authentication mode switching
- [ ] I can implement toggle switches with proper enabled/disabled state management
- [ ] I understand error handling for authentication mode management failures

### Checkpoint 3: Challenge Mode Routing for LDA Toggling
- [ ] I understand password verification challenge modes (0, 5, 15) for LDA toggling
- [ ] I can handle password creation challenge mode (14) when disabling LDA
- [ ] I understand LDA consent challenge mode (16) when enabling biometric authentication
- [ ] I know how to route users to appropriate screens based on challenge mode
- [ ] I can implement auto-closing screens after successful revalidation

### Checkpoint 4: Event-Driven Status Updates
- [ ] I can implement `onDeviceAuthManagementStatus` event handler
- [ ] I understand the status data structure (userID, OpMode, ldaType, status, error)
- [ ] I know how to differentiate between enable (OpMode=1) and disable (OpMode=0) operations
- [ ] I can display appropriate success/error messages based on status updates
- [ ] I understand when to refresh authentication details after status updates

### Checkpoint 5: Complete LDA Toggling Flow
- [ ] I can implement the complete Password to LDA flow:
  - Toggle ON → Password Verification (mode 5) → User Consent (mode 16) → Status Update → Biometric Enabled
- [ ] I can implement the complete LDA to Password flow:
  - Toggle OFF → Password Verification (mode 15) → Set Password (mode 14) → Status Update → Password Enabled
- [ ] I understand edge cases (network failures, user cancellation, device capability changes)
- [ ] I can implement comprehensive error handling for all toggling scenarios
- [ ] I can test LDA toggling with various device configurations

### Checkpoint 6: Production LDA Toggling Management
- [ ] I understand security best practices for authentication mode switching
- [ ] I can implement user-friendly UI with clear status indicators and feedback
- [ ] I know how to optimize performance with minimal API calls and efficient state management
- [ ] I can handle production deployment considerations for LDA toggling features
- [ ] I understand accessibility requirements for toggle interfaces

## 🔄 LDA Toggling User Flow

### Scenario 1: Enable Biometric Authentication (Password → LDA)
1. **User opens LDA Toggling screen** → `getDeviceAuthenticationDetails()` API called
2. **Available LDA types displayed** → List shows authentication capabilities (e.g., Biometric Authentication)
3. **User toggles authentication ON** → `manageDeviceAuthenticationModes(true, authType)` API called
4. **Password verification initiated** → SDK triggers `getPassword` event with `challengeMode = 5`
5. **User enters current password** → Navigation to VerifyPasswordScreen
6. **Password verified successfully** → Screen auto-closes, returns to LDA Toggling screen
7. **LDA consent required** → SDK triggers `getUserConsentForLDA` event with `challengeMode = 16`
8. **User approves biometric setup** → Navigation to UserLDAConsentScreen
9. **Biometric enrollment completed** → `setUserConsentForLDA()` API called
10. **Status update received** → SDK triggers `onDeviceAuthManagementStatus` event with `OpMode = 1`
11. **Success message displayed** → "Biometric Authentication has been enabled successfully"
12. **Authentication details refreshed** → Toggle switch shows enabled state
13. **User can now login with biometric** → LDA toggling completed successfully

### Scenario 2: Disable Biometric Authentication (LDA → Password)
1. **User opens LDA Toggling screen** → `getDeviceAuthenticationDetails()` API called
2. **Enabled LDA types displayed** → List shows configured authentication (toggle in ON state)
3. **User toggles authentication OFF** → `manageDeviceAuthenticationModes(false, authType)` API called
4. **Password verification initiated** → SDK triggers `getPassword` event with `challengeMode = 15`
5. **User enters current password** → Navigation to VerifyPasswordScreen
6. **Password verified successfully** → Screen auto-closes, returns to LDA Toggling screen
7. **Password creation required** → SDK triggers `getPassword` event with `challengeMode = 14`
8. **User creates new password** → Navigation to SetPasswordScreen
9. **Password policy validation** → User enters password meeting requirements
10. **New password set** → `setPassword()` API called
11. **Status update received** → SDK triggers `onDeviceAuthManagementStatus` event with `OpMode = 0`
12. **Success message displayed** → "Biometric Authentication has been disabled successfully"
13. **Authentication details refreshed** → Toggle switch shows disabled state
14. **User can now login with password** → LDA toggling completed successfully

### Scenario 3: No LDA Available
1. **User opens LDA Toggling screen** → `getDeviceAuthenticationDetails()` API called
2. **No authentication capabilities returned** → Empty list or no LDA enrolled on device
3. **Empty state displayed** → "No Local Device Authentication (LDA) capabilities are available"
4. **Refresh option available** → User can retry checking device capabilities
5. **Guidance provided** → Message suggests enrolling biometrics in device settings

### Scenario 4: LDA Toggling Error Handling
1. **User toggles authentication** → `manageDeviceAuthenticationModes()` API called
2. **Network error or server issue** → API call fails or returns error code
3. **Error displayed to user** → "Failed to update authentication mode. Please try again."
4. **Loading state cleared** → Toggle switch returns to previous state
5. **Retry option available** → User can attempt toggling again
6. **Status not updated** → Authentication mode remains unchanged

### Scenario 5: Direct Status Update (No Additional Challenge)
1. **User toggles authentication** → `manageDeviceAuthenticationModes()` API called
2. **No additional verification needed** → SDK returns status directly in sync callback
3. **Status update triggered** → Event handler processes management status data
4. **Success confirmation displayed** → User sees immediate feedback
5. **Authentication details refreshed** → Toggle state updated automatically

## 📚 Advanced Resources

- **REL-ID LDA Toggling Documentation**: [LDA Toggling Guide](https://developer.uniken.com/docs/lda-toggling)
- **REL-ID getDeviceAuthenticationDetails API**: [Device Authentication Details](https://developer.uniken.com/docs/getdeviceauthenticationdetails)
- **REL-ID manageDeviceAuthenticationModes API**: [Manage Authentication Modes](https://developer.uniken.com/docs/managedeviceauthenticationmodes)
- **REL-ID onDeviceAuthManagementStatus Event**: [Auth Management Status](https://developer.uniken.com/docs/ondeviceauthmanagementstatus)
- **REL-ID Password to LDA Flow**: [Enable Biometric](https://developer.uniken.com/docs/password-to-lda)
- **REL-ID LDA to Password Flow**: [Disable Biometric](https://developer.uniken.com/docs/lda-to-password)
- **React Native Switch Component**: [Toggle Implementation](https://reactnative.dev/docs/switch)

## 💡 Pro Tips

### LDA Toggling Implementation Best Practices
1. **Check device capabilities first** - Always call `getDeviceAuthenticationDetails()` before showing toggle interface
2. **Handle authentication type mappings** - Map numeric auth types to user-friendly names (4=Biometric, 9=LDA, etc.)
3. **Provide clear user feedback** - Display loading states and success/error messages during toggling
4. **Implement proper error handling** - Handle Error Code 404 (no LDA found) and network failures gracefully
5. **Test challenge mode routing** - Ensure all challenge modes (5, 14, 15, 16) route correctly
6. **Optimize toggle interactions** - Prevent multiple simultaneous toggle operations
7. **Preserve existing authentication** - Ensure toggling doesn't disrupt current user sessions
8. **Design intuitive UI** - Use clear toggle switches with visible enabled/disabled states
9. **Handle edge cases** - Device capability changes, biometric removal, network interruptions
10. **Test on real devices** - Verify with actual biometric hardware, not just simulators

### Integration & Development
11. **Preserve existing MFA flows** - LDA toggling should enhance, not disrupt existing functionality
12. **Use proper TypeScript types** - Leverage `RDNADeviceAuthenticationDetailsData` and event types for type safety
13. **Implement comprehensive logging** - Log toggling progress for debugging without exposing sensitive data
14. **Test with various device configurations** - Ensure toggling works across different devices and OS versions
15. **Monitor user experience metrics** - Track toggling success rates and identify friction points
16. **Auto-close revalidation screens** - Return users to LDA Toggling screen after challenge completion
17. **Refresh authentication details** - Always reload capabilities after successful status updates
18. **Handle manual event triggering** - Properly invoke event handlers when sync callback contains status data
19. **Parse nested response structures** - Handle `{ error, response: "{...json...}" }` format correctly
20. **Implement empty state handling** - Provide guidance when no LDA capabilities are available

### Security & Compliance
21. **Validate authentication state** - Always verify authentication changes on server side
22. **Implement secure revalidation** - Require password verification or consent for mode changes
23. **Audit authentication changes** - Log LDA toggling events for security monitoring
24. **Handle challenge modes securely** - Ensure proper routing for verification flows (modes 5, 14, 15, 16)
25. **Test security scenarios** - Verify toggling behavior under attack scenarios and unauthorized access attempts
26. **Follow platform guidelines** - Adhere to iOS and Android biometric authentication best practices
27. **Respect user privacy** - Never store or log biometric data, only authentication preferences
28. **Implement timeout handling** - Handle cases where users abandon revalidation flows
29. **Validate device integrity** - Ensure authentication mode changes occur on trusted devices
30. **Support graceful degradation** - Allow users to continue with alternate authentication if toggling fails

## 🔗 Key Implementation Files

### Core LDA Toggling Implementation
```typescript
// rdnaService.ts - Device Authentication Details API
async getDeviceAuthenticationDetails(): Promise<RDNADeviceAuthenticationDetailsData> {
  return new Promise((resolve, reject) => {
    RdnaClient.getDeviceAuthenticationDetails(response => {
      const rawResponse = response as any;

      // Parse nested response
      let parsedData: any;
      try {
        if (rawResponse.response && typeof rawResponse.response === 'string') {
          parsedData = JSON.parse(rawResponse.response);
        } else {
          parsedData = response;
        }
      } catch (error) {
        parsedData = rawResponse;
      }

      if (rawResponse.error && rawResponse.error.longErrorCode === 0) {
        resolve({
          authenticationCapabilities: parsedData.authenticationCapabilities || [],
          error: rawResponse.error
        });
      } else {
        reject({
          authenticationCapabilities: [],
          error: rawResponse.error
        });
      }
    });
  });
}

// rdnaService.ts - Manage Authentication Modes API
async manageDeviceAuthenticationModes(
  isEnabled: boolean,
  authType: number
): Promise<RDNASyncResponse | RDNADeviceAuthManagementStatusData> {
  return new Promise((resolve, reject) => {
    RdnaClient.manageDeviceAuthenticationModes(isEnabled, authType, response => {
      const rawResponse = response as any;

      // Parse nested response
      let parsedData: any;
      try {
        if (rawResponse.response && typeof rawResponse.response === 'string') {
          parsedData = JSON.parse(rawResponse.response);
        } else {
          parsedData = response;
        }
      } catch (error) {
        parsedData = rawResponse;
      }

      if (rawResponse.error && rawResponse.error.longErrorCode === 0) {
        // Check if sync callback contains management status
        if (parsedData.userID || parsedData.OpMode !== undefined) {
          const result: RDNADeviceAuthManagementStatusData = {
            userID: parsedData.userID || '',
            OpMode: parsedData.OpMode,
            ldaType: parsedData.ldaType,
            status: parsedData.status,
            error: rawResponse.error
          };

          // Manually trigger event handler
          const eventManager = this.eventManager;
          const handler = (eventManager as any).deviceAuthManagementStatusHandler;
          if (handler) {
            handler(result);
          }

          resolve(result);
        } else {
          resolve(rawResponse);
        }
      } else {
        reject(rawResponse);
      }
    });
  });
}
```

```typescript
// rdnaEventManager.ts - Device Auth Management Status Event Handler
private onDeviceAuthManagementStatus(response: RDNAJsonResponse) {
  console.log("RdnaEventManager - Device auth management status event received");

  try {
    const authManagementStatusData: RDNADeviceAuthManagementStatusData =
      JSON.parse(response.response);

    console.log("RdnaEventManager - Device auth management status data:", {
      userID: authManagementStatusData.userID,
      OpMode: authManagementStatusData.OpMode,
      ldaType: authManagementStatusData.ldaType,
      statusCode: authManagementStatusData.status?.statusCode,
      errorCode: authManagementStatusData.error?.longErrorCode
    });

    if (this.deviceAuthManagementStatusHandler) {
      this.deviceAuthManagementStatusHandler(authManagementStatusData);
    }
  } catch (error) {
    console.error("RdnaEventManager - Failed to parse device auth management status:", error);
  }
}

public setDeviceAuthManagementStatusHandler(
  callback?: RDNADeviceAuthManagementStatusCallback
): void {
  this.deviceAuthManagementStatusHandler = callback;
}
```

```tsx
// LDATogglingScreen.tsx - Authentication Type Mapping
const AUTH_TYPE_NAMES: Record<number, string> = {
  0: 'None',
  1: 'Biometric Authentication',  // RDNA_LDA_FINGERPRINT (iOS Touch ID)
  2: 'Face ID',                    // RDNA_LDA_FACE (iOS Face ID)
  3: 'Pattern Authentication',     // RDNA_LDA_PATTERN (Android)
  4: 'Biometric Authentication',  // RDNA_LDA_SSKB_PASSWORD (Android)
  9: 'Biometric Authentication',  // RDNA_DEVICE_LDA (iOS/Android)
};

// LDATogglingScreen.tsx - Load Authentication Details
const loadAuthenticationDetails = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const data = await rdnaService.getDeviceAuthenticationDetails();

    if (data.error.longErrorCode !== 0) {
      const errorMessage = data.error.errorString || 'Failed to load authentication details';
      setError(errorMessage);
      setIsLoading(false);
      return;
    }

    const capabilities = data.authenticationCapabilities || [];
    setAuthCapabilities(capabilities);
    setIsLoading(false);
  } catch (error: any) {
    const errorMessage = error?.error?.errorString || 'Failed to load authentication details';
    setError(errorMessage);
    setIsLoading(false);
  }
};

// LDATogglingScreen.tsx - Handle Toggle Change
const handleToggleChange = async (
  capability: RDNAAuthenticationCapability,
  newValue: boolean
) => {
  const authTypeName = AUTH_TYPE_NAMES[capability.authenticationType] ||
    `Authentication Type ${capability.authenticationType}`;

  if (processingAuthType !== null) {
    return; // Prevent multiple operations
  }

  setProcessingAuthType(capability.authenticationType);

  try {
    await rdnaService.manageDeviceAuthenticationModes(newValue, capability.authenticationType);
    // Response will be handled by handleAuthManagementStatusReceived
  } catch (error) {
    setProcessingAuthType(null);
    Alert.alert(
      'Update Failed',
      'Failed to update authentication mode. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

// LDATogglingScreen.tsx - Handle Status Update Event
const handleAuthManagementStatusReceived = (data: RDNADeviceAuthManagementStatusData) => {
  setProcessingAuthType(null);

  if (data.error.longErrorCode !== 0) {
    const errorMessage = data.error.errorString || 'Failed to update authentication mode';
    Alert.alert('Update Failed', errorMessage, [{ text: 'OK' }]);
    return;
  }

  if (data.status.statusCode === 100) {
    const opMode = data.OpMode === 1 ? 'enabled' : 'disabled';
    const authTypeName = AUTH_TYPE_NAMES[data.ldaType] || `Authentication Type ${data.ldaType}`;

    Alert.alert(
      'Success',
      `${authTypeName} has been ${opMode} successfully.`,
      [
        {
          text: 'OK',
          onPress: () => {
            loadAuthenticationDetails(); // Refresh after success
          }
        }
      ]
    );
  } else {
    const statusMessage = data.status.statusMessage || 'Unknown error occurred';
    Alert.alert('Update Failed', statusMessage, [{ text: 'OK' }]);
  }
};
```

### Challenge Mode Routing for LDA Toggling
```typescript
// SDKEventProvider.tsx - Password Verification for LDA Toggling
const handleGetPassword = useCallback((data: RDNAGetPasswordData) => {
  if (data.challengeMode === 0 || data.challengeMode === 5 || data.challengeMode === 15) {
    // challengeMode = 0: Standard password verification
    // challengeMode = 5: Verify password for enabling LDA
    // challengeMode = 15: Verify password for disabling LDA
    NavigationService.navigateOrUpdate('VerifyPasswordScreen', {
      eventData: data,
      title: 'Verify Password',
      subtitle: data.challengeMode === 0
        ? 'Enter your password to continue'
        : 'Enter your password to change authentication method',
      responseData: data,
    });
  } else if (data.challengeMode === 1 || data.challengeMode === 14) {
    // challengeMode = 1: Standard password creation
    // challengeMode = 14: Set password when disabling LDA
    NavigationService.navigateOrUpdate('SetPasswordScreen', {
      eventData: data,
      title: data.challengeMode === 14 ? 'Set Password' : 'Create New Password',
      subtitle: data.challengeMode === 14
        ? 'Set a password for password-based authentication'
        : 'Create a secure password for your account',
      responseData: data,
    });
  }
}, []);

// SDKEventProvider.tsx - LDA Consent for LDA Toggling
const handleGetUserConsentForLDA = useCallback((data: RDNAGetUserConsentForLDAData) => {
  // challengeMode = 16: LDA consent for enabling biometric authentication
  NavigationService.navigateOrUpdate('UserLDAConsentScreen', {
    eventData: data,
    title: 'Enable Biometric Authentication',
    subtitle: 'Grant permission for biometric authentication on this device',
    responseData: data,
  });
}, []);
```

```tsx
// VerifyPasswordScreen.tsx - Auto-close for LDA Toggling
// Close the screen after successful password submission if challengeMode is not 0
if (challengeMode !== 0) {
  console.log('VerifyPasswordScreen - ChallengeMode is not 0, closing screen');
  navigation.goBack();
}

// SetPasswordScreen.tsx - Auto-close for LDA Toggling
// Close the screen after successful password submission if challengeMode is not 1
if (challengeMode !== 1) {
  console.log('SetPasswordScreen - ChallengeMode is not 1, closing screen');
  navigation.goBack();
}

// UserLDAConsentScreen.tsx - Auto-close for LDA Toggling
// Close the screen after successful consent submission if challengeMode is 16
if (responseData.challengeMode === 16) {
  console.log('UserLDAConsentScreen - ChallengeMode is 16 (LDA toggling), closing screen');
  navigation.goBack();
}
```

---

**🔐 Congratulations! You've mastered LDA Toggling Management with REL-ID SDK!**

*You're now equipped to implement secure, user-friendly authentication mode switching workflows. Use this knowledge to create flexible authentication experiences that allow users to seamlessly toggle between password and biometric authentication based on their preferences and device capabilities.*

# REL-ID React Native Codelab: Password Update Management

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![Password Update](https://img.shields.io/badge/Password%20Update-Enabled-blue.svg)]()
[![Challenge Mode 2](https://img.shields.io/badge/Challenge%20Mode-2-purple.svg)]()

> **Codelab Advanced:** Master user-initiated Password Update workflows with REL-ID SDK

This folder contains the source code for the solution demonstrating [REL-ID Password Update Management](https://developer.uniken.com/docs/update-credentials) using secure user-initiated password update flows with credential availability checking, policy validation, and screen-level event handling.

## 🔐 What You'll Learn

In this advanced password update codelab, you'll master production-ready user-initiated password update patterns:

- ✅ **User-Initiated Updates**: Handle `challengeMode = 2` for dashboard password updates
- ✅ **Credential Availability Check**: `getAllChallenges()` and `initiateUpdateFlowForCredential()` APIs
- ✅ **Drawer Navigation Integration**: Conditional menu item based on credential availability
- ✅ **Screen-Level Event Handling**: `onUpdateCredentialResponse` with proper cleanup
- ✅ **SDK Event Chain**: `onUpdateCredentialResponse` status codes 100/110/153 trigger `onUserLoggedOff` → `getUser` events
- ✅ **Three-Field Password Input**: Current password, new password, and confirm password validation
- ✅ **Password Policy Validation**: Extract and enforce `RELID_PASSWORD_POLICY` requirements
- ✅ **Auto-Field Clearing**: Clear password fields on screen focus for security
- ✅ **Error Handling**: Uses `RDNAEventUtils.hasApiError()` and `hasStatusError()` methods
- ✅ **Critical Error Management**: Handle statusCode 110, 153, 190 with logout flows

## 🎯 Learning Objectives

By completing this Password Update codelab, you'll be able to:

1. **Implement credential availability checking** with `getAllChallenges()` API after login
2. **Initiate update flows** using `initiateUpdateFlowForCredential('Password')` API
3. **Handle screen-level events** with `onUpdateCredentialResponse` and proper cleanup
4. **Build user-initiated update UI** with drawer navigation and conditional menu items
5. **Manage session persistence** without automatic login after password update
6. **Implement security best practices** with auto-field clearing on screen focus
7. **Extract password policies** from `RELID_PASSWORD_POLICY` challenge data
8. **Create three-field password forms** with comprehensive validation rules
9. **Handle critical errors** with statusCode 110, 153, 190 logout scenarios
10. **Debug password update flows** and troubleshoot credential availability issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/rn-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of React Native drawer navigation and conditional rendering
- Experience with React Native form handling and multi-field validation
- Knowledge of REL-ID SDK event-driven architecture patterns
- Familiarity with password policy parsing and validation
- Basic understanding of authentication state management and error handling
- Understanding of React hooks (`useEffect`, `useFocusEffect`, `useCallback`)

## 📁 Password Update Project Structure

```
relid-MFA-update-password/
├── 📱 Enhanced React Native MFA + Password Update App
│   ├── android/                 # Android-specific configuration
│   ├── ios/                     # iOS-specific configuration
│   └── react-native-rdna-client/ # REL-ID Native Bridge
│
├── 📦 Password Update Source Architecture
│   └── src/
│       ├── tutorial/            # Enhanced MFA + Password Update flows
│       │   ├── navigation/      # Enhanced navigation with password update
│       │   │   ├── AppNavigator.tsx        # Stack navigation
│       │   │   ├── DrawerNavigator.tsx     # Drawer with UpdatePassword screen
│       │   │   └── NavigationService.ts    # Navigation utilities
│       │   └── screens/         # Enhanced screens with password update
│       │       ├── components/  # Enhanced UI components
│       │       │   ├── Button.tsx                # Loading and disabled states
│       │       │   ├── Input.tsx                 # Password input with masking
│       │       │   ├── StatusBanner.tsx          # Error and warning displays
│       │       │   ├── DrawerContent.tsx         # Drawer with conditional menu
│       │       │   └── ...                       # Other reusable components
│       │       ├── updatePassword/ # 🆕 Password Update Management
│       │       │   ├── UpdatePasswordScreen.tsx  # 🆕 User-initiated update (challengeMode 2)
│       │       │   └── index.ts                   # Password update exports
│       │       ├── mfa/         # 🔐 MFA screens
│       │       │   ├── DashboardScreen.tsx       # Dashboard
│       │       │   ├── CheckUserScreen.tsx       # User validation
│       │       │   └── ...                       # Other MFA screens
│       │       └── tutorial/    # Base tutorial screens
│       └── uniken/              # 🛡️ Enhanced REL-ID Integration
│           ├── providers/       # Enhanced providers
│           │   └── SDKEventProvider.tsx          # Complete event handling
│           │                                    # - onCredentialsAvailableForUpdate
│           │                                    # - onUpdateCredentialResponse (fallback)
│           ├── services/        # 🆕 Enhanced SDK service layer
│           │   ├── rdnaService.ts                # Enhanced password update APIs
│           │   │                                # - updatePassword(current, new, 2)
│           │   │                                # - getAllChallenges(username)
│           │   │                                # - initiateUpdateFlowForCredential(type)
│           │   └── rdnaEventManager.ts           # Complete event management
│           │                                    # - getPassword handler (challengeMode 2)
│           │                                    # - onUpdateCredentialResponse handler
│           │                                    # - onCredentialsAvailableForUpdate handler
│           ├── types/           # 📝 Enhanced TypeScript definitions
│           │   ├── rdnaEvents.ts                # Complete event type definitions
│           │   │                                # - RDNAGetPasswordData
│           │   │                                # - RDNAUpdateCredentialResponseData
│           │   │                                # - RDNACredentialsAvailableForUpdateData
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
cd relid-MFA-password-expiry

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

### Verify Password Update Features

Once the app launches, verify these password update capabilities:

1. ✅ Complete MFA flow and successful login to dashboard
2. ✅ `getAllChallenges()` called automatically after login
3. ✅ "🔑 Update Password" menu item appears in drawer navigation
4. ✅ Tapping menu item calls `initiateUpdateFlowForCredential('Password')`
5. ✅ UpdatePasswordScreen displays with three password fields (current, new, confirm)
6. ✅ Password policy extracted from `PASSWORD_POLICY_BKP` and displayed
7. ✅ Attempts counter displays remaining attempts
8. ✅ `updatePassword(current, new, 2)` API integration with validation
9. ✅ `onUpdateCredentialResponse` event handled within screen
10. ✅ Success navigates to dashboard (no automatic login)
11. ✅ Password fields auto-clear when screen comes into focus
12. ✅ Error handling uses `RDNAEventUtils.hasApiError()` and `hasStatusError()`

## 🎓 Learning Checkpoints

### Checkpoint 1: Password Update - Credential Availability
- [ ] I understand how `getAllChallenges()` checks for available credential updates after login
- [ ] I can implement `initiateUpdateFlowForCredential('Password')` to trigger update flow
- [ ] I know how to handle `onCredentialsAvailableForUpdate` event with options array
- [ ] I can create conditional menu items based on credential availability
- [ ] I understand the difference between credential update (mode 2) and password expiry (mode 4)

### Checkpoint 2: Password Update - Screen-Level Event Handling
- [ ] I can implement screen-level `onUpdateCredentialResponse` event handler
- [ ] I understand proper cleanup with `useEffect` return function
- [ ] I know how to handle success (statusCode 0/100) vs error responses
- [ ] I can implement critical error handling (statusCode 110, 153, 190)
- [ ] I understand why screen-level handlers are used instead of global handlers

### Checkpoint 3: Password Update - User Experience
- [ ] I can implement drawer navigation integration for password update
- [ ] I know how to use `useFocusEffect` for auto-clearing password fields
- [ ] I understand the security benefits of clearing fields on screen focus
- [ ] I can display attempts counter and password policy requirements
- [ ] I know how to maintain user session (no automatic login) after update

### Checkpoint 4: UpdatePassword API Implementation
- [ ] I can implement `updatePassword(current, new, 2)` API for challengeMode 2
- [ ] I understand three-field validation (current, new, confirm passwords)
- [ ] I can extract password policy from challenge data (`PASSWORD_POLICY_BKP`)
- [ ] I know how to validate new password differs from current password
- [ ] I can handle loading states during password update operations

### Checkpoint 5: Password Policy Validation
- [ ] I can parse password policy JSON from challenge data
- [ ] I understand password policy fields (minL, maxL, minDg, minUc, minLc, minSc, etc.)
- [ ] I can display user-friendly policy requirements to users
- [ ] I know how to handle UserIDcheck as boolean or string "true"
- [ ] I can debug policy validation issues and policy parsing errors

### Checkpoint 6: Production Password Update
- [ ] I understand security best practices for password update implementations
- [ ] I can implement comprehensive error handling for password update failures
- [ ] I know how to optimize user experience with clear policy messaging
- [ ] I understand user stays logged in after successful password update (no automatic login)
- [ ] I understand compliance and audit requirements for password update workflows

## 🔄 Password Update User Flows

### Scenario 1: Standard Password Update Flow
1. **User logs in successfully** → Reaches dashboard after MFA completion
2. **getAllChallenges() called** → Automatic check for available credential updates
3. **onCredentialsAvailableForUpdate triggered** → Options array includes "Password"
4. **Drawer menu shows "🔑 Update Password"** → Conditional menu item appears
5. **User taps Update Password** → `initiateUpdateFlowForCredential('Password')` called
6. **SDK triggers getPassword** → `challengeMode = 2` (RDNA_OP_UPDATE_CREDENTIALS)
7. **Navigation to UpdatePasswordScreen** → Drawer navigation with three password fields
8. **Password policy displayed** → Extracted from `RELID_PASSWORD_POLICY` challenge data
9. **User enters passwords** → Current, new, and confirm password inputs
10. **Validation checks** → New password differs from current, passwords match, policy compliance
11. **Password updated** → `updatePassword(current, new, 2)` API called
12. **onUpdateCredentialResponse** → Screen-level handler processes success response (statusCode 100)
13. **SDK event chain triggered** → `onUpdateCredentialResponse` with statusCode 100 causes SDK to trigger `onUserLoggedOff` → `getUser` events
14. **User navigates to dashboard** → Navigate back to dashboard after success alert
15. **Fields auto-cleared** → Password fields cleared when screen regains focus

### Scenario 2: Password Update with Critical Error
1. **User in UpdatePasswordScreen** → Three password fields displayed
2. **User enters passwords** → Attempts to update password
3. **Password update attempted** → `updatePassword(current, new, 2)` API called
4. **Critical error occurs** → `onUpdateCredentialResponse` receives statusCode 153 (Attempts exhausted)
5. **onUpdateCredentialResponse handler** → Detects critical error (110, 153, 190)
6. **Error displayed with field clearing** → All password fields reset automatically
7. **SDK event chain triggered** → `onUpdateCredentialResponse` with statusCode 153 causes SDK to trigger `onUserLoggedOff` → `getUser` events
8. **onUserLoggedOff event** → Handled by SDKEventProvider
9. **getUser event** → Handled by SDKEventProvider
10. **Navigation to home** → User returns to login screen

**Important Note - SDK Event Chain & Status Codes**:

The `onUpdateCredentialResponse` event returns specific status codes that trigger automatic SDK event chains. When this event receives status codes 100, 110, or 153, the SDK automatically triggers `onUserLoggedOff` → `getUser` event chain:

- **statusCode 100**: Password updated successfully - SDK triggers event chain after success
- **statusCode 110**: Password has expired while updating password - SDK triggers event chain leading to logout
- **statusCode 153**: Attempts exhausted - SDK triggers event chain leading to logout

**Important**: These status codes (100, 110, 153) are specific to `onUpdateCredentialResponse` event only and do not apply to other SDK events. This automatic event chain is part of the REL-ID SDK's credential update flow and ensures proper session management after password update operations.

## 📚 Advanced Resources

- **REL-ID Password Update Documentation**: [Update Credentials API Guide](https://developer.uniken.com/docs/update-credentials)
- **REL-ID Challenge Modes**: [Understanding Challenge Modes](https://developer.uniken.com/docs/challenge-modes)
- **React Native Drawer Navigation**: [Drawer Navigator](https://reactnavigation.org/docs/drawer-navigator)
- **React Native Form Handling**: [Secure Form Implementation](https://reactnative.dev/docs/textinput)

## 💡 Pro Tips

### Password Update Implementation Best Practices
1. **Check credential availability** - Call `getAllChallenges()` after login to check available updates
2. **Conditional menu display** - Show "Update Password" only when `onCredentialsAvailableForUpdate` includes "Password"
3. **Screen-level event handlers** - Use screen-level `onUpdateCredentialResponse` with cleanup
4. **Auto-clear on focus** - Implement `useFocusEffect` to clear password fields for security
5. **No automatic login** - User stays logged in after update
6. **Handle critical errors** - Detect statusCode 110, 153, 190 for logout scenarios
7. **Drawer integration** - Place UpdatePasswordScreen in drawer navigation, not stack
8. **Loading state management** - Handle loading state for `initiateUpdateFlowForCredential`
9. **Error utility methods** - Use `RDNAEventUtils.hasApiError()` and `hasStatusError()`
10. **Test drawer navigation** - Ensure proper parameter passing and navigation flow

### Integration & Development
11. **Preserve existing MFA flows** - Password update should enhance, not disrupt existing authentication
12. **Use proper TypeScript types** - Leverage `RDNASyncResponse`, `RDNAGetPasswordData`, `RDNAUpdateCredentialResponseData`
13. **Implement comprehensive logging** - Log flow progress for debugging without exposing passwords
14. **Test with various policies** - Ensure password update works with different password policy configurations
15. **Monitor user experience metrics** - Track password update success rates and policy compliance
16. **Extract password policy** - Always extract `RELID_PASSWORD_POLICY` from challenge data
17. **Clear fields on errors** - Implement automatic field clearing for both API and status errors
18. **Validate password differences** - Ensure new password differs from current password
19. **Display policy requirements** - Show parsed policy requirements to users before input
20. **Three-field validation** - Validate current, new, and confirm passwords with proper error messages

### Security & Compliance
21. **Enforce password policies** - Always validate passwords against server-provided policy requirements
22. **Handle password history** - Respect server-configured password history limits
23. **Audit password changes** - Log password update events for security monitoring
24. **Ensure secure transmission** - All password communications should use secure channels
25. **Test security scenarios** - Verify password update security under various attack scenarios
26. **Clear sensitive data** - Implement auto-clearing of password fields on screen focus
27. **Secure sensitive operations** - Never log or expose passwords in console or error messages
28. **Handle loading states** - Show clear loading indicators during password update operations

## 🔗 Key Implementation Files

```typescript
// rdnaService.ts - Credential Update APIs
async getAllChallenges(username: string): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    RdnaClient.getAllChallenges(username, response => {
      const result: RDNASyncResponse = response;
      if (result.error && result.error.longErrorCode === 0) {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });
}

async initiateUpdateFlowForCredential(credentialType: string): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    RdnaClient.initiateUpdateFlowForCredential(credentialType, response => {
      const result: RDNASyncResponse = response;
      if (result.error && result.error.longErrorCode === 0) {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });
}
```

```tsx
// SDKEventProvider.tsx - Automatic getAllChallenges after login
const handleUserLoggedIn = useCallback(async (data: RDNAUserLoggedInData) => {
  // Navigate to dashboard
  NavigationService.navigate('DrawerNavigator', {
    screen: 'Dashboard',
    params: navigationParams
  });

  // Call getAllChallenges after login
  try {
    await rdnaService.getAllChallenges(data.userID);
  } catch (error) {
    console.error('SDKEventProvider - getAllChallenges failed:', error);
  }
}, []);

// Handle challengeMode 2 for password update
const handleGetPassword = useCallback((data: RDNAGetPasswordData) => {
  if (data.challengeMode === 2) {
    NavigationService.navigate('DrawerNavigator', {
      screen: 'UpdatePassword',
      params: {
        eventName: 'getPassword',
        eventData: data,
        responseData: data,
      }
    });
  }
}, []);
```

```tsx
// DrawerContent.tsx - Conditional menu item
const { availableCredentials } = useSDKEvent();
const isPasswordUpdateAvailable = availableCredentials.includes('Password');

const handleUpdatePassword = async () => {
  setIsInitiatingUpdate(true);
  try {
    await rdnaService.initiateUpdateFlowForCredential('Password');
  } catch (error) {
    Alert.alert('Update Password Error', RDNASyncUtils.getErrorMessage(error));
  } finally {
    setIsInitiatingUpdate(false);
  }
};

{isPasswordUpdateAvailable && (
  <TouchableOpacity onPress={handleUpdatePassword}>
    <Text>🔑 Update Password</Text>
  </TouchableOpacity>
)}
```

```tsx
// UpdatePasswordScreen.tsx - Screen-level event handler
useEffect(() => {
  const eventManager = rdnaService.getEventManager();

  const handleUpdateCredentialResponse = (data: RDNAUpdateCredentialResponseData) => {
    setIsSubmitting(false);
    const statusCode = data.status.statusCode;

    // IMPORTANT: onUpdateCredentialResponse event with statusCode 100, 110, or 153
    // causes the SDK to automatically trigger onUserLoggedOff → getUser event chain
    // These status codes are specific to onUpdateCredentialResponse event only:
    // - 100: Password updated successfully
    // - 110: Password has expired while updating password
    // - 153: Attempts exhausted

    if (statusCode === 100 || statusCode === 0) {
      // statusCode 100 in onUpdateCredentialResponse = Password updated successfully
      Alert.alert('Success', statusMessage, [{
        text: 'OK',
        onPress: () => navigation.navigate('DrawerNavigator', { screen: 'Dashboard' })
      }]);
      // SDK will trigger onUserLoggedOff → getUser after this
    } else if (statusCode === 110 || statusCode === 153) {
      // statusCode 110/153 in onUpdateCredentialResponse = Password expired/Attempts exhausted
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError(statusMessage);
      // SDK will trigger onUserLoggedOff → getUser, leading to logout
    } else {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError(statusMessage);
    }
  };

  eventManager.setUpdateCredentialResponseHandler(handleUpdateCredentialResponse);

  return () => {
    eventManager.setUpdateCredentialResponseHandler(undefined);
  };
}, [navigation]);

// Auto-clear fields on screen focus
useFocusEffect(
  React.useCallback(() => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  }, [])
);
```

---

**🔐 Congratulations! You've mastered Password Update Management with REL-ID SDK!**

*You're now equipped to implement user-initiated password update flows with:*

- **Credential Availability Checking**: Automatic checking after login with `getAllChallenges()`
- **Conditional Menu Display**: Show update option only when available
- **Screen-Level Event Handling**: Proper `onUpdateCredentialResponse` handling with cleanup
- **Security Best Practices**: Auto-clearing password fields on screen focus
- **Seamless User Experience**: User stays logged in after successful password update

*Use this knowledge to create secure, user-friendly password update experiences that empower users to proactively manage their account security!*

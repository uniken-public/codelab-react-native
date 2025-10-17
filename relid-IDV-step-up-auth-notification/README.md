# REL-ID React Native Codelab: Step-Up Authentication with Notifications

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![Step-Up Auth](https://img.shields.io/badge/Step--Up%20Auth-Enabled-blue.svg)]()
[![Challenge Mode 3](https://img.shields.io/badge/Challenge%20Mode-3-purple.svg)]()

> **Codelab Advanced:** Master Step-Up Authentication for notification actions with REL-ID SDK

This folder contains the source code for the solution demonstrating [REL-ID Step-Up Authentication](https://developer.uniken.com/docs/stepup-authentication-for-actions) using secure re-authentication flows for sensitive notification actions with password and LDA verification.

## 🔐 What You'll Learn

In this advanced step-up authentication codelab, you'll master production-ready notification action authentication patterns and IDV selfie verification:

**Step-Up Authentication Features:**
- ✅ **Step-Up Authentication Flow**: `updateNotification()` → SDK checks if action requires authentication → User authenticates via password or LDA
- ✅ **Password Authentication**: SDK triggers `getPassword` event with `challengeMode = 3` (RDNA_OP_AUTHORIZE_NOTIFICATION)
- ✅ **LDA Authentication**: SDK handles biometric authentication internally, no `getPassword` event
- ✅ **Notification Actions**: `getNotifications()` and `updateNotification()` APIs
- ✅ **Password Dialog UI**: Modal dialog with attempts counter and error handling
- ✅ **Event-Driven Flow**: `updateNotification()` → `getPassword` (if password required) → `onUpdateNotification` event
- ✅ **Error Handling**: Critical status codes (110, 153) and error code (131) with alerts before logout
- ✅ **Auto-Field Clearing**: Clear password field when authentication fails and retry triggers
- ✅ **Keyboard Management**: ScrollView with proper keyboard handling for dialog buttons
- ✅ **Callback Preservation**: Chain event handlers for different challenge modes
- ✅ **Success Flow**: Alert confirmation with navigation to dashboard

**IDV Selfie Process Features:**
- ✅ **IDV Workflow Support**: 16 different IDV workflow types (0-15) with specific guidelines
- ✅ **Selfie Capture Flow**: `getIDVSelfieProcessStartConfirmation` event → User confirmation → `setIDVSelfieProcessStartConfirmation` API
- ✅ **Camera Selection**: Front/back camera toggle with user preference storage
- ✅ **Dynamic Guidelines**: Workflow-specific instructions for different IDV scenarios
- ✅ **Process Control**: User can confirm or cancel selfie capture process
- ✅ **Event-Driven Navigation**: Automatic screen navigation when SDK triggers IDV events
- ✅ **Type Safety**: Complete TypeScript interfaces for IDV events and APIs

## 🎯 Learning Objectives

By completing this Step-Up Authentication and IDV Selfie codelab, you'll be able to:

**Step-Up Authentication Objectives:**
1. **Implement notification retrieval** with `getNotifications()` API and auto-loading
2. **Handle notification actions** using `updateNotification()` API with action parameters
3. **Manage step-up authentication** for password (challengeMode 3) and LDA verification
4. **Build password dialog UI** with modal, attempts counter, and error display
5. **Handle keyboard overlap** with ScrollView and KeyboardAvoidingView
6. **Clear password fields** automatically when authentication fails and retry triggers
7. **Preserve event callbacks** to chain handlers for different challenge modes
8. **Handle critical status codes** with statusCode 110, 153 alerts before SDK logout
9. **Handle LDA cancellation** with error code 131 and allow user retry
10. **Debug step-up auth flows** and troubleshoot callback preservation issues

**IDV Selfie Process Objectives:**
11. **Implement IDV selfie callbacks** with `getIDVSelfieProcessStartConfirmation` event handling
12. **Create IDV selfie confirmation screen** with workflow-specific guidelines and camera selection
13. **Handle IDV workflow types** and display appropriate instructions for each scenario
14. **Implement camera toggle** for front/back camera selection with state management
15. **Process IDV confirmation API** with `setIDVSelfieProcessStartConfirmation` method
16. **Integrate IDV navigation** with automatic screen navigation when events are triggered
17. **Add IDV type safety** with complete TypeScript interfaces and event definitions
18. **Handle IDV process control** allowing users to confirm or cancel selfie capture
19. **Test IDV workflows** across different verification scenarios and use cases
20. **Debug IDV integration** and troubleshoot event handling and API calls

## 🔑 Step-Up Authentication Logic

**Important**: Step-up authentication requires the user to be logged in. The authentication method used for step-up depends on how the user logged in and what authentication methods are enrolled for the app.

### Authentication Enrollment During Activation

During initial activation, users can enroll using:
- **Password only**
- **LDA (Local Device Authentication)** only - Biometric authentication (Face ID, Touch ID, Fingerprint, etc.)
- **Both Password and LDA**

Once enrolled, users can log in using either LDA or password, depending on what has been set up.

### Step-Up Authentication Flow Logic

The SDK automatically determines which authentication method to use for step-up authentication based on:
1. **How the user logged in** (Password or LDA)
2. **What authentication methods are enrolled** for the app

| Login Method | Enrolled Methods | Step-Up Authentication Method | Notes |
|--------------|------------------|-------------------------------|-------|
| Password | Password only | **Password** | SDK triggers `getPassword` with challengeMode 3 |
| LDA | LDA only | **LDA** | SDK handles biometric internally, no `getPassword` event |
| Password | Both Password & LDA | **Password** | SDK triggers `getPassword` with challengeMode 3 |
| LDA | Both Password & LDA | **LDA** (with Password fallback) | SDK attempts LDA first. If user cancels LDA, SDK directly triggers `getPassword` (no error) |

**Key Behaviors**:

- When user logs in with **Password** → Step-up uses **Password** (even if LDA is enrolled)
- When user logs in with **LDA** → Step-up uses **LDA** (with automatic Password fallback on cancellation)
- **LDA Cancellation Fallback**:
  - If **Password is enrolled**: SDK directly triggers `getPassword` event (no error, seamless fallback)
  - If **Password is NOT enrolled**: Error code 131 returned in `onUpdateNotification` event (user can retry LDA)

## 🆔 IDV Selfie Process Logic

The IDV (Identity Document Verification) selfie process provides biometric verification capabilities for various authentication scenarios. The implementation supports 16 different workflow types with tailored user experiences.

### IDV Workflow Types and Use Cases

| IDV Workflow | Scenario | Description | When Used |
|--------------|----------|-------------|-----------|
| **0** | IDV activation process | Initial identity verification during enrollment | New user registration |
| **1** | IDV activation with template verification | Activation with existing biometric template matching | User with existing biometric data |
| **2** | Additional device activation | Adding new device to existing identity | Multi-device enrollment |
| **3** | Additional device without template | Device enrollment without existing template | New device, fresh enrollment |
| **4** | Account recovery with template | Recovering access with existing biometric data | Password reset with biometrics |
| **5** | Account recovery without template | Recovery requiring new biometric enrollment | Complete account recovery |
| **6** | Post-login KYC process | Know Your Customer verification after login | Compliance verification |
| **8** | Post-login selfie biometric | Biometric authentication after login | Enhanced security check |
| **9** | Step-up authentication | Additional verification for sensitive operations | Transaction authorization |
| **10** | Biometric opt-in process | User enrolling in biometric authentication | Enabling biometric features |
| **13** | Agent KYC process | Agent-assisted customer verification | Customer service scenarios |
| **15** | Login selfie biometric | Biometric verification during login | Login-time verification |

### IDV Selfie Event Flow

The IDV selfie process follows this event-driven pattern:

```
SDK Triggers IDV Flow → getIDVSelfieProcessStartConfirmation Event →
IDVSelfieProcessStartConfirmationScreen Navigation → User Reviews Guidelines →
User Selects Camera Preference → User Confirms/Cancels →
setIDVSelfieProcessStartConfirmation(confirmation, useBackCamera, idvWorkflow) API →
SDK Processes Decision → Selfie Capture or Cancellation
```

### Key IDV Features

- **🎯 Workflow-Specific Guidelines**: Each workflow displays tailored instructions for the user context
- **📷 Camera Selection**: Toggle between front and back camera based on user preference
- **📝 Dynamic Content**: Guidelines change based on the IDV workflow type (0-15)
- **🔄 Process Control**: User can confirm to proceed or cancel the selfie capture
- **⚡ Event-Driven**: Automatic navigation triggered by SDK events
- **🛡️ Type Safety**: Complete TypeScript integration with proper interfaces

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/rn-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- **[REL-ID Additional Device Activation Flow With Notifications Codelab](https://codelab.uniken.com/codelabs/rn-mfa-additional-device-activation-flow/index.html?index=..%2F..index#0)** - Notification retrieval and display
- Understanding of React Native modal components and keyboard handling
- Experience with event-driven architectures and callback preservation patterns
- Knowledge of REL-ID SDK authentication challenge modes
- Familiarity with biometric authentication and LDA concepts
- Basic understanding of security best practices for re-authentication flows
- Understanding of React hooks (`useState`, `useEffect`, `useCallback`, `useRef`)

## 📁 Step-Up Authentication Project Structure

```
relid-step-up-auth-notification/
├── 📱 Enhanced React Native Notification + Step-Up Auth App
│   ├── android/                 # Android-specific configuration
│   ├── ios/                     # iOS-specific configuration
│   └── react-native-rdna-client/ # REL-ID Native Bridge
│
├── 📦 Step-Up Authentication Source Architecture
│   └── src/
│       ├── tutorial/            # Enhanced Notification + Step-Up Auth flows
│       │   ├── navigation/      # Enhanced navigation
│       │   │   ├── AppNavigator.tsx        # Stack navigation
│       │   │   ├── DrawerNavigator.tsx     # Drawer with GetNotifications screen
│       │   │   └── NavigationService.ts    # Navigation utilities
│       │   └── screens/         # Enhanced screens with step-up auth and IDV
│       │       ├── components/  # Enhanced UI components
│       │       │   ├── Button.tsx                # Loading and disabled states
│       │       │   ├── Input.tsx                 # Password input with masking
│       │       │   ├── StatusBanner.tsx          # Error and warning displays
│       │       │   ├── DrawerContent.tsx         # Drawer with notifications menu
│       │       │   └── ...                       # Other reusable components
│       │       ├── notification/ # 🆕 Notification + Step-Up Auth Management
│       │       │   ├── GetNotificationsScreen.tsx # 🆕 Notification actions with step-up auth
│       │       │   └── index.ts                   # Notification exports
│       │       ├── idv/         # 🆕 IDV Selfie Process Management
│       │       │   ├── IDVSelfieProcessStartConfirmationScreen.tsx # 🆕 IDV selfie confirmation with guidelines
│       │       │   └── index.ts                   # IDV exports
│       │       ├── mfa/         # 🔐 MFA screens
│       │       │   ├── DashboardScreen.tsx       # Dashboard
│       │       │   ├── CheckUserScreen.tsx       # User validation
│       │       │   └── ...                       # Other MFA screens
│       │       └── tutorial/    # Base tutorial screens
│       └── uniken/              # 🛡️ Enhanced REL-ID Integration
│           ├── components/      # 🆕 Enhanced UI components
│           │   └── modals/      # 🆕 Modal components
│           │       ├── StepUpPasswordDialog.tsx   # 🆕 Password dialog for step-up auth
│           │       └── index.ts                   # Modal exports
│           ├── providers/       # Enhanced providers
│           │   └── SDKEventProvider.tsx          # Complete event handling
│           │                                    # - onGetNotifications
│           │                                    # - onUpdateNotification
│           ├── services/        # 🆕 Enhanced SDK service layer
│           │   ├── rdnaService.ts                # Enhanced notification + IDV APIs
│           │   │                                # - getNotifications(params)
│           │   │                                # - updateNotification(uuid, action)
│           │   │                                # - setPassword(password, 3)
│           │   │                                # - setIDVSelfieProcessStartConfirmation(confirmation, camera, workflow)
│           │   └── rdnaEventManager.ts           # Complete event management
│           │                                    # - getPassword handler (challengeMode 3)
│           │                                    # - onGetNotifications handler
│           │                                    # - onUpdateNotification handler
│           │                                    # - getIDVSelfieProcessStartConfirmation handler
│           ├── types/           # 📝 Enhanced TypeScript definitions
│           │   ├── rdnaEvents.ts                # Complete event type definitions
│           │   │                                # - RDNAGetPasswordData
│           │   │                                # - RDNAGetNotificationsData
│           │   │                                # - RDNAUpdateNotificationData
│           │   │                                # - RDNAGetIDVSelfieProcessStartConfirmationData
│           │   │                                # - RDNAGetIDVSelfieProcessStartConfirmationCallback
│           │   └── index.ts                     # Type exports
│           └── utils/           # Helper utilities
│               └── connectionProfileParser.ts  # Profile configuration
│
└── 📚 Production Configuration
    ├── package.json             # Dependencies
    ├── tsconfig.json
    └── STEP_UP_AUTH_IMPLEMENTATION.md  # Comprehensive implementation guide
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-step-up-auth-notification

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

### Verify Step-Up Authentication Features

Once the app launches, verify these step-up authentication capabilities:

**Basic Step-Up Authentication Flow (Password Login)**:

1. ✅ Complete MFA flow with password and successful login to dashboard
2. ✅ Navigate to "🔔 Get Notifications" from drawer menu
3. ✅ `getNotifications()` called automatically on screen load
4. ✅ Notifications displayed with action buttons
5. ✅ Tap action button to trigger `updateNotification()` API
6. ✅ SDK triggers `getPassword` event with `challengeMode = 3` (step-up auth)
7. ✅ StepUpPasswordDialog displays with notification title, attempts counter
8. ✅ Enter incorrect password → error displays, password field clears, attempts decrease
9. ✅ Enter correct password → `onUpdateNotification` event with success
10. ✅ Success alert displayed → Navigate to dashboard

**Step-Up Authentication Flow (LDA Login)**:

11. ✅ Login with LDA (biometric) → Navigate to notifications screen
12. ✅ Tap action button → SDK triggers LDA prompt (no `getPassword` event)
13. ✅ Complete LDA → `onUpdateNotification` with success
14. ✅ Cancel LDA (if both Password & LDA enrolled) → SDK falls back to password dialog

**Error Handling**:

15. ✅ Critical status codes (110, 153) show alert before SDK logout
16. ✅ LDA cancellation triggers password fallback when both methods enrolled
17. ✅ Keyboard appears → dialog buttons remain visible (ScrollView)
18. ✅ Password field clears when `getPassword` triggers again after error

**IDV Selfie Process Flow**:

19. ✅ SDK triggers `getIDVSelfieProcessStartConfirmation` event → automatic navigation
20. ✅ IDVSelfieProcessStartConfirmationScreen displays with workflow-specific guidelines
21. ✅ User selects camera preference (front/back) → toggle state updates
22. ✅ User taps "Capture Selfie" → `setIDVSelfieProcessStartConfirmation(true, camera, workflow)`
23. ✅ User taps cancel/close → `setIDVSelfieProcessStartConfirmation(false, false, workflow)`
24. ✅ Guidelines change based on IDV workflow type (0-15) → dynamic content
25. ✅ Event handler parses workflow and camera data correctly
26. ✅ Navigation parameters include all event data → proper screen initialization

## 🎓 Learning Checkpoints

### Checkpoint 1: Step-Up Authentication - Notification Actions
- [ ] I understand how `getNotifications()` retrieves notifications from REL-ID server
- [ ] I can implement `updateNotification(uuid, action)` to process user actions
- [ ] I know when SDK triggers `getPassword` with `challengeMode = 3` for step-up auth
- [ ] I can differentiate between LDA (biometric) and password step-up auth
- [ ] I understand the difference between initial authentication and step-up re-authentication
- [ ] I understand how login method (Password vs LDA) determines step-up authentication method
- [ ] I know the LDA cancellation fallback behavior (Password via `getPassword`)

### Checkpoint 2: Step-Up Authentication - Password Dialog UI
- [ ] I can implement modal dialog with password input and visibility toggle
- [ ] I understand how to display attempts counter with color-coding
- [ ] I know how to show notification title/context in the dialog
- [ ] I can implement loading states during password verification
- [ ] I understand how to disable dialog dismissal during submission

### Checkpoint 3: Step-Up Authentication - Event Callback Preservation
- [ ] I can preserve existing event callbacks when setting screen-level handlers
- [ ] I understand how to chain handlers for different challenge modes
- [ ] I know how to handle `challengeMode = 3` in screen vs other modes globally
- [ ] I can implement `useCallback` to prevent closure issues
- [ ] I understand proper cleanup with `useEffect` return function
- [ ] I understand why screen-level handler is better than global handler for challengeMode 3

### Checkpoint 4: Step-Up Authentication - Error Handling
- [ ] I can handle critical status codes (statusCode 110, 153) with alerts before logout
- [ ] I understand LDA cancellation (error code 131) and retry flow
- [ ] I know how to automatically clear password fields on retry
- [ ] I can display user-friendly error messages from SDK responses
- [ ] I understand when to show error vs when to trigger logout

### Checkpoint 5: Step-Up Authentication - Keyboard Management
- [ ] I can implement ScrollView to prevent keyboard from hiding buttons
- [ ] I understand `keyboardShouldPersistTaps="handled"` for touch handling
- [ ] I know how to use KeyboardAvoidingView with platform-specific behavior
- [ ] I can set appropriate `keyboardVerticalOffset` for iOS and Android
- [ ] I understand how to limit modal height to accommodate keyboard

### Checkpoint 6: Production Step-Up Authentication
- [ ] I understand security best practices for step-up authentication
- [ ] I can implement comprehensive error handling for authentication failures
- [ ] I know how to optimize user experience with clear messaging
- [ ] I understand compliance and audit requirements for re-authentication flows
- [ ] I can debug step-up auth issues with event callback preservation

### Checkpoint 7: IDV Selfie Process - Event Handling
- [ ] I understand how `getIDVSelfieProcessStartConfirmation` event is triggered by the SDK
- [ ] I can implement the event handler in RdnaEventManager with proper parsing
- [ ] I know how to register the IDV callback in SDKEventProvider with automatic navigation
- [ ] I understand the structure of `RDNAGetIDVSelfieProcessStartConfirmationData`
- [ ] I can extract `idvWorkflow` and `useDeviceBackCamera` from event data
- [ ] I understand when different IDV workflow types are triggered

### Checkpoint 8: IDV Selfie Process - API Implementation
- [ ] I can implement `setIDVSelfieProcessStartConfirmation` API method in RdnaService
- [ ] I understand the three required parameters: confirmation, useBackCamera, idvWorkflow
- [ ] I know how to handle API success/error responses with proper error handling
- [ ] I can call the API from IDVSelfieProcessStartConfirmationScreen with correct parameters
- [ ] I understand the difference between confirming (true) and cancelling (false) the process
- [ ] I can implement async/await pattern with Promise-based API calls

### Checkpoint 9: IDV Selfie Process - Screen Implementation
- [ ] I can create IDVSelfieProcessStartConfirmationScreen with proper navigation integration
- [ ] I understand how to display workflow-specific guidelines based on idvWorkflow value
- [ ] I can implement camera toggle (front/back) with state management
- [ ] I know how to handle "Capture Selfie" and "Cancel" button actions
- [ ] I can pass navigation parameters including eventData and responseData
- [ ] I understand how to use React hooks (useState, useEffect) for IDV screen state

### Checkpoint 10: IDV Selfie Process - Workflow Types
- [ ] I understand the 16 different IDV workflow types (0-15) and their use cases
- [ ] I can implement workflow-specific guidelines for each IDV scenario
- [ ] I know when IDV workflow 9 (step-up authentication) is used vs other workflows
- [ ] I understand the difference between activation (0,1), recovery (4,5), and KYC (6,13) workflows
- [ ] I can customize the user experience based on the workflow context
- [ ] I understand how biometric enrollment (10) differs from login verification (15)

### Checkpoint 11: IDV Selfie Process - Integration and Testing
- [ ] I can test IDV selfie flow across different workflow scenarios
- [ ] I understand how to verify event handler registration and callback execution
- [ ] I know how to debug IDV navigation issues and parameter passing
- [ ] I can validate TypeScript types and interfaces for IDV functionality
- [ ] I understand how to test camera toggle functionality and state persistence
- [ ] I can verify API calls are made with correct parameters and handle responses properly

## 🔄 Step-Up Authentication User Flows

### Scenario 1: Standard Step-Up Authentication Flow (Password)
1. **User in GetNotificationsScreen** → Notifications loaded from server
2. **User selects notification action** → Tap "View Actions" button
3. **Action modal displayed** → Radio button selection for action options
4. **User selects action and submits** → `updateNotification(uuid, action)` called
5. **SDK requires step-up auth** → `getPassword` event triggered with `challengeMode = 3`
6. **Action modal closes** → `setShowActionModal(false)` called
7. **StepUpPasswordDialog displays** → Password input with notification title, attempts counter
8. **User enters password** → `setPassword(password, 3)` called
9. **SDK verifies password** → `onUpdateNotification` event triggered with success
10. **Success alert displayed** → User sees confirmation message
11. **Navigation to dashboard** → Alert "OK" button navigates to dashboard
12. **Notifications refreshed** → `loadNotifications()` called to refresh list

### Scenario 2: Step-Up Authentication with Wrong Password
1. **StepUpPasswordDialog displayed** → User sees password input with attempts counter
2. **User enters wrong password** → `setPassword(wrongPassword, 3)` called
3. **SDK verification fails** → `getPassword` event triggered again with error
4. **Error message displayed** → Error shown in dialog (red background)
5. **Password field cleared** → `useEffect` clears password automatically
6. **Attempts decremented** → Attempts counter updates (e.g., "2 attempts remaining")
7. **User retries** → Repeat steps 2-6 until correct password or attempts exhausted

### Scenario 3: Step-Up Authentication - Attempts Exhausted (Critical Error)
1. **User in StepUpPasswordDialog** → Final attempt remaining
2. **User enters wrong password** → Last attempt used
3. **SDK returns critical error** → `onUpdateNotification` with statusCode 153 (attempts exhausted)
4. **Alert displayed BEFORE logout** → "Authentication Failed" alert with status message
5. **User acknowledges alert** → Tap "OK" button
6. **SDK triggers logout** → `onUserLoggedOff` event handled by SDKEventProvider
7. **Navigation to home** → User returns to login screen

### Scenario 4: Step-Up Authentication with LDA (Biometric)
1. **User logged in with LDA** → User previously authenticated using biometric
2. **User selects notification action** → `updateNotification(uuid, action)` called
3. **SDK triggers LDA prompt** → Biometric authentication prompt (e.g., Face ID, Fingerprint)
4. **User authenticates with biometric** → SDK verifies internally
5. **Success** → `onUpdateNotification` event with success, navigate to dashboard

### Scenario 4a: Step-Up Authentication - LDA Cancelled with Password Fallback (Both Enrolled)
1. **User logged in with LDA** → User previously authenticated using biometric (both Password & LDA enrolled)
2. **User selects notification action** → `updateNotification(uuid, action)` called
3. **SDK triggers LDA prompt** → Biometric authentication prompt displayed
4. **User cancels LDA** → User dismisses biometric prompt
5. **SDK falls back to password** → SDK directly triggers `getPassword` event with `challengeMode = 3` (no error, no `onUpdateNotification`)
6. **StepUpPasswordDialog displays** → Password input shown as fallback
7. **User enters password** → `setPassword(password, 3)` called
8. **Success** → `onUpdateNotification` event with success, navigate to dashboard

### Scenario 4b: Step-Up Authentication - LDA Cancelled without Password Fallback (LDA Only)
1. **User logged in with LDA** → User previously authenticated using biometric (LDA only enrolled, no Password)
2. **User selects notification action** → `updateNotification(uuid, action)` called
3. **SDK triggers LDA prompt** → Biometric authentication prompt displayed
4. **User cancels LDA** → User dismisses biometric prompt
5. **SDK returns error** → `onUpdateNotification` event with error code 131
6. **Error alert displayed** → "Authentication Cancelled" alert shown
7. **User can retry** → Action modal remains open, user can tap action again to retry LDA

### Scenario 5: Step-Up Authentication - Password Expired During Action
1. **User in StepUpPasswordDialog** → Password input displayed
2. **User enters password** → `setPassword(password, 3)` called
3. **SDK detects expired password** → `onUpdateNotification` with statusCode 110
4. **Alert displayed BEFORE logout** → "Authentication Failed - Password Expired" alert
5. **User acknowledges alert** → Tap "OK" button
6. **SDK triggers logout** → `onUserLoggedOff` event, navigation to home

**Important Notes - Step-Up Authentication Event Chain**:

- **challengeMode = 3**: Indicates `RDNA_OP_AUTHORIZE_NOTIFICATION` - password required for notification action
- **Authentication Method Selection**: SDK automatically chooses password or LDA based on login method and enrolled credentials
- **LDA Fallback**: When user logs in with LDA and cancels biometric, SDK automatically falls back to password via `getPassword`
- **Callback Preservation**: Screen-level handler for mode 3, global handler for other modes
- **Error Codes**:
  - `statusCode 100`: Success - action completed
  - `statusCode 110`: Password expired - show alert BEFORE SDK logout
  - `statusCode 153`: Attempts exhausted - show alert BEFORE SDK logout
  - `error code 131`: LDA cancelled and Password NOT enrolled - Allow user to retry LDA
- **Auto-Clear Password**: When `getPassword` triggers again after error, password field clears via `useEffect`
- **Keyboard Handling**: ScrollView ensures buttons remain visible when keyboard appears

## 🏗️ Architecture Deep Dive: Why Screen-Level Handler for ChallengeMode 3?

### Design Decision: Screen-Level vs Global Handler

The implementation handles `getPassword` with `challengeMode = 3` at the **screen level** (GetNotificationsScreen) rather than globally. This is a deliberate architectural choice with significant benefits:

#### ✅ Screen-Level Handler Approach (Current Implementation)

```typescript
// GetNotificationsScreen.tsx
const handleGetPasswordStepUp = useCallback((
  data: RDNAGetPasswordData,
  originalHandler?: (data: RDNAGetPasswordData) => void
) => {
  // Only handle challengeMode 3 (step-up auth)
  if (data.challengeMode !== 3) {
    if (originalHandler) originalHandler(data);
    return;
  }

  // Screen has direct access to notification context
  setShowStepUpAuth(true);
}, []);
```

**Advantages**:
1. **Context Access**: Direct access to notification data (title, message, action) already loaded in screen
2. **Modal Management**: Easy to manage modal stack (close action modal → open password dialog)
3. **State Locality**: All step-up auth state lives where it's used, no prop drilling
4. **UI Flow**: Modal overlay maintains screen context, better UX
5. **Lifecycle Management**: Handler active only when screen mounted, automatic cleanup
6. **Callback Preservation**: Chains with global handler, doesn't break other challenge modes

#### ❌ Global Handler Approach (Alternative - Not Recommended)

```typescript
// SDKEventProvider.tsx
const handleGetPassword = useCallback((data: RDNAGetPasswordData) => {
  if (data.challengeMode === 3) {
    // Problems:
    // - Notification context not available here
    // - Need complex state management to pass data
    // - Navigation to new screen breaks UX
    NavigationService.navigate('StepUpAuthScreen', { ??? });
  }
}, []);
```

**Disadvantages**:
1. **No Context Access**: Notification data not available in global provider
2. **Complex State Management**: Need Redux/Context to pass notification data
3. **Navigation Overhead**: Navigate to new screen instead of modal overlay
4. **Poor UX**: User loses context of which notification they're acting on
5. **Tight Coupling**: Hard to reuse pattern for other step-up auth scenarios
6. **Maintenance Burden**: Flow scattered across multiple files

### Architecture Comparison Table

| Aspect | Screen-Level Handler (✅ Current) | Global Handler (❌ Alternative) |
|--------|-----------------------------------|--------------------------------|
| **Context Access** | Direct access to notification data | Need state management layer |
| **UI Pattern** | Modal overlay on same screen | Navigate to new screen |
| **Modal Management** | Simple (close one, open another) | Complex (cross-screen modals) |
| **Code Locality** | All related code in one place | Scattered across multiple files |
| **Maintenance** | Easy to understand and modify | Hard to trace flow |
| **Cleanup** | Automatic on unmount | Manual cleanup needed |
| **Reusability** | Pattern reusable for other screens | Tightly coupled to specific flow |
| **State Management** | Local useState, no props | Need global state (Redux/Context) |

### Key Takeaway

**Screen-level handlers are the recommended pattern when:**
- Handler needs access to screen-specific context/data
- UI pattern uses modal overlays rather than navigation
- State is specific to the screen and doesn't need global access
- Handler should only be active when screen is mounted

**Global handlers are appropriate when:**
- Handler needs to work across all screens
- Navigation to dedicated screen is the desired UX
- State needs to be shared globally
- Handler should always be active regardless of current screen

For step-up authentication with notifications, the screen-level approach is superior because it maintains context, simplifies state management, and provides better UX.

## 📚 Advanced Resources

- **REL-ID Step-Up Authentication Documentation**: [Step-Up Authentication Guide](https://developer.uniken.com/docs/stepup-authentication-for-actions)
- **REL-ID Notifications API**: [Notifications API Guide](https://developer.uniken.com/docs/notification-management)
- **REL-ID Challenge Modes**: [Understanding Challenge Modes](https://developer.uniken.com/docs/challenge-modes)
- **React Native Modal**: [Modal Component](https://reactnative.dev/docs/modal)
- **React Native KeyboardAvoidingView**: [Keyboard Handling](https://reactnative.dev/docs/keyboardavoidingview)

## 💡 Pro Tips

### Step-Up Authentication Implementation Best Practices
1. **Preserve event callbacks** - Chain handlers using callback preservation pattern
2. **Close action modal first** - Hide action modal before showing password dialog
3. **Clear password on error** - Use `useEffect` to clear password when error changes
4. **Handle keyboard overlap** - Use ScrollView with `keyboardShouldPersistTaps="handled"`
5. **Show critical alerts** - Display alert BEFORE SDK triggers logout (110, 153)
6. **Handle LDA cancellation** - Allow retry when user cancels biometric (131)
7. **Use useCallback** - Prevent closure issues with event handlers
8. **Display notification context** - Show notification title in password dialog
9. **Color-code attempts** - Visual feedback for remaining attempts (green→orange→red)
10. **Disable during submission** - Prevent double-submit with loading states

### Integration & Development
11. **Auto-load notifications** - Call `getNotifications()` on screen mount
12. **Proper TypeScript types** - Leverage `RDNAGetPasswordData`, `RDNAUpdateNotificationData`
13. **Implement comprehensive logging** - Log flow progress without exposing passwords
14. **Test with various actions** - Ensure step-up auth works with different notification actions
15. **Monitor authentication metrics** - Track step-up auth success rates
16. **Handle modal dismiss** - Prevent hardware back button dismiss during submission
17. **Auto-focus password field** - Focus password input when dialog appears
18. **Test LDA and password** - Verify both authentication methods work
19. **Validate action selection** - Ensure action is selected before submission
20. **Refresh notifications** - Reload notifications after successful action

### Security & Compliance
21. **Enforce step-up auth** - Never bypass step-up authentication requirements
22. **Secure password handling** - Never log or expose passwords
23. **Audit notification actions** - Log notification actions for security monitoring
24. **Handle session timeouts** - Ensure step-up auth respects session timeouts
25. **Test security scenarios** - Verify step-up auth under various attack scenarios
26. **Clear sensitive data** - Clear password field on unmount and error
27. **Respect attempts limits** - Honor server-configured attempt limits
28. **Handle LDA fallback** - Implement password fallback when user cancels biometric (both enrolled)
29. **Test all enrollment scenarios** - Verify password-only, LDA-only, and both enrolled scenarios
30. **Respect user login method** - Step-up auth should match how user logged in (password or LDA)

## 🔗 Key Implementation Files

```typescript
// rdnaService.ts - Notification + IDV APIs
async getNotifications(params: any): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    RdnaClient.getNotifications(params, response => {
      const result: RDNASyncResponse = response;
      if (result.error && result.error.longErrorCode === 0) {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });
}

async updateNotification(uuid: string, action: string): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    RdnaClient.updateNotification(uuid, action, response => {
      const result: RDNASyncResponse = response;
      if (result.error && result.error.longErrorCode === 0) {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });
}

// IDV Selfie Process API
async setIDVSelfieProcessStartConfirmation(
  confirmation: boolean, 
  useBackCamera: boolean, 
  idvWorkflow: number
): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    RdnaClient.setIDVSelfieProcessStartConfirmation(confirmation, useBackCamera, idvWorkflow, response => {
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
// GetNotificationsScreen.tsx - Callback Preservation Pattern
const handleGetPasswordStepUp = useCallback((
  data: RDNAGetPasswordData,
  originalHandler?: (data: RDNAGetPasswordData) => void
) => {
  // Only handle challengeMode 3 (step-up auth)
  if (data.challengeMode !== 3) {
    if (originalHandler) {
      originalHandler(data);
    }
    return;
  }

  // Hide action modal to show step-up modal on top
  setShowActionModal(false);

  // Update state
  setStepUpAttemptsLeft(data.attemptsLeft);
  setStepUpSubmitting(false);

  // Check for errors
  const statusCode = data.challengeResponse.status.statusCode;
  const statusMessage = data.challengeResponse.status.statusMessage;

  if (statusCode !== 100) {
    setStepUpErrorMessage(statusMessage || 'Authentication failed. Please try again.');
  } else {
    setStepUpErrorMessage('');
  }

  setShowStepUpAuth(true);
}, []);

// Set handler with preservation
useEffect(() => {
  const eventManager = rdnaService.getEventManager();
  const originalHandler = eventManager.onGetPasswordCallback;

  eventManager.onGetPasswordCallback = (data: RDNAGetPasswordData) => {
    handleGetPasswordStepUp(data, originalHandler);
  };

  return () => {
    eventManager.onGetPasswordCallback = originalHandler;
  };
}, [handleGetPasswordStepUp]);
```

```tsx
// SDKEventProvider.tsx - IDV Selfie Event Handler
const handleGetIDVSelfieProcessStartConfirmation = useCallback((
  data: RDNAGetIDVSelfieProcessStartConfirmationData
) => {
  console.log('SDKEventProvider - Get IDV selfie process start confirmation event received');
  console.log('SDKEventProvider - IDV Workflow:', data.idvWorkflow);
  console.log('SDKEventProvider - Use back camera:', data.useDeviceBackCamera);
  console.log('SDKEventProvider - Challenge status:', data.challengeResponse.status.statusCode);

  // Use navigateOrUpdate to prevent duplicate screens and update existing screen with new event data
  NavigationService.navigateOrUpdate('IDVSelfieProcessStartConfirmationScreen', {
    eventName: 'getIDVSelfieProcessStartConfirmation',
    eventData: data,
    title: 'IDV Selfie Capture',
    subtitle: 'Prepare to capture your selfie for identity verification',
    // Pass response data directly
    responseData: data,
  });
}, []);

// Register IDV handler
useEffect(() => {
  const eventManager = rdnaService.getEventManager();
  
  // ... existing handler registrations
  eventManager.setGetIDVSelfieProcessStartConfirmationHandler(handleGetIDVSelfieProcessStartConfirmation);

  return () => {
    eventManager.cleanup();
  };
}, []);
```

```tsx
// IDVSelfieProcessStartConfirmationScreen.tsx - Screen Implementation
const handleCaptureSelfieAction = async () => {
  try {
    setIsProcessing(true);
    setError('');
    console.log('IDVSelfieProcessStartConfirmationScreen - Starting IDV selfie capture process...');
    
    // Use the idvWorkflow from the event data
    const idvWorkflow = selfieData?.idvWorkflow || 0;
    
    // Call the API to confirm starting the selfie capture process
    const response = await RdnaService.setIDVSelfieProcessStartConfirmation(true, useBackCamera, idvWorkflow);
    
    console.log('IDVSelfieProcessStartConfirmationScreen - API response:', response);
    
  } catch (error) {
    console.error('IDVSelfieProcessStartConfirmationScreen - Failed to start selfie capture:', error);
    setError('Failed to start selfie capture process');
    Alert.alert('Error', 'Failed to start selfie capture process');
  } finally {
    setIsProcessing(false);
  }
};

// Get workflow-specific guidelines
const getGuidelineTexts = (): { text1: string; text2: string; text3: string } => {
  const idvWorkflow = selfieData?.idvWorkflow || 0;
  
  switch (idvWorkflow) {
    case 9:
      return {
        text1: 'Step-up authentication requires clear selfie capture for verification.',
        text2: 'Position your face clearly for enhanced security verification.',
        text3: 'Face will be verified against your existing biometric profile.'
      };
    case 6:
      return {
        text1: 'Post-login KYC process - capture selfie for identity verification.',
        text2: 'Ensure your face is clearly visible and well-lit for verification.',
        text3: 'Face will be compared with document photo for identity confirmation.'
      };
    // ... other workflow cases
    default:
      return {
        text1: 'Ensure good lighting and position your face clearly in the frame.',
        text2: 'Remove any sunglasses, hats, or face coverings for clear recognition.',
        text3: 'Look directly at the camera and follow any on-screen prompts.'
      };
  }
};
```

```tsx
// GetNotificationsScreen.tsx - Error Handling
const handleUpdateNotificationReceived = useCallback((data: RDNAUpdateNotificationData) => {
  setActionLoading(false);
  setStepUpSubmitting(false);

  // Check for LDA cancelled (error code 131)
  // This only occurs when LDA is cancelled AND Password is NOT enrolled
  // If Password IS enrolled, SDK directly triggers getPassword (no error)
  if (data.error.longErrorCode === 131) {
    setShowStepUpAuth(false);
    Alert.alert(
      'Authentication Cancelled',
      'Local device authentication was cancelled. Please try again.',
      [{ text: 'OK', onPress: () => {
        // Keep action modal open to allow user to retry
        // Action modal is still visible for retry
      }}]
    );
    return;
  }

  const responseData = data.responseData;
  const statusCode = responseData?.StatusCode;
  const statusMessage = responseData?.StatusMessage || 'Action completed successfully';

  if (statusCode === 100) {
    // Success
    setShowStepUpAuth(false);
    setShowActionModal(false);
    Alert.alert('Success', statusMessage, [
      { text: 'OK', onPress: () => navigation.navigate('DrawerNavigator', { screen: 'Dashboard' }) }
    ]);
    loadNotifications();
  } else if (statusCode === 110 || statusCode === 153) {
    // Critical errors - show alert BEFORE SDK logout
    setShowStepUpAuth(false);
    setShowActionModal(false);
    Alert.alert('Authentication Failed', statusMessage, [
      { text: 'OK', onPress: () => console.log('Waiting for SDK to trigger logout flow') }
    ]);
  }
}, [navigation, loadNotifications]);
```

```tsx
// StepUpPasswordDialog.tsx - Auto-Clear Password on Error
useEffect(() => {
  if (errorMessage) {
    setPassword('');
  }
}, [errorMessage]);

// Keyboard Handling
<ScrollView
  style={styles.scrollContainer}
  contentContainerStyle={styles.contentContainer}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>
  {/* Password input and other content */}
</ScrollView>

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 0,
  },
  modalContainer: {
    maxHeight: '80%',
  },
});
```

---

**🔐 Congratulations! You've mastered Step-Up Authentication with REL-ID SDK!**

*You're now equipped to implement secure step-up authentication flows with:*

- **Notification Action Security**: Re-authentication for sensitive notification actions
- **Password and LDA Support**: Both password and biometric authentication methods
- **Callback Preservation**: Proper event handler chaining for different challenge modes
- **Error Handling**: Critical error alerts before SDK logout
- **User Experience**: Auto-clear password fields, keyboard management, attempts counter

*Use this knowledge to create secure, user-friendly step-up authentication experiences that protect sensitive operations while maintaining excellent usability!*

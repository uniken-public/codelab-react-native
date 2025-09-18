# REL-ID React Native Codelab: Forgot Password Management

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![Forgot Password](https://img.shields.io/badge/Forgot%20Password-Enabled-orange.svg)]()
[![Verification Challenge](https://img.shields.io/badge/Verification%20Challenge-OTP%2FEmail-purple.svg)]()

> **Codelab Advanced:** Master Forgot Password workflows with REL-ID SDK verification challenges

This folder contains the source code for the solution demonstrating [REL-ID Forgot Password Management](https://developer.uniken.com/docs/forgot-password) using secure verification challenge-based password reset flows.

## 🔐 What You'll Learn

In this advanced forgot password codelab, you'll master production-ready password reset patterns:

- ✅ **Forgot Password API Integration**: `forgotPassword()` API implementation with verification challenges
- ✅ **Conditional UI Display**: Show "Forgot Password?" link only when `challengeMode = 0` and `ENABLE_FORGOT_PASSWORD = true`
- ✅ **Verification Challenge Flow**: Handle `getActivationCode` events for OTP/email verification
- ✅ **Dynamic Password Reset**: Navigate through `getUserConsentForLDA` or `getPassword` events post-verification
- ✅ **Automatic Login**: Seamless `onUserLoggedIn` event handling after successful password reset
- ✅ **Configuration-Driven**: Respect server-side forgot password feature enablement
- ✅ **Event-Driven Architecture**: Handle complete forgot password event chain

## 🎯 Learning Objectives

By completing this Forgot Password Management codelab, you'll be able to:

1. **Implement forgot password workflows** with secure verification challenge integration
2. **Handle conditional forgot password display** based on challenge mode and server configuration
3. **Build complete password reset flows** from verification to automatic login
4. **Create seamless user experiences** with loading states and error handling
5. **Design event-driven password reset** with proper SDK event chain management
6. **Integrate forgot password functionality** with existing MFA authentication workflows
7. **Debug forgot password flows** and troubleshoot verification-related issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/rn-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of password verification flows and challenge modes
- Experience with React Native form handling and conditional UI rendering
- Knowledge of REL-ID SDK event-driven architecture patterns
- Familiarity with activation code and OTP verification workflows
- Basic understanding of authentication state management

## 📁 Forgot Password Management Project Structure

```
relid-MFA-forgot-password/
├── 📱 Enhanced React Native MFA + Forgot Password App
│   ├── android/                 # Android-specific configuration
│   ├── ios/                     # iOS-specific configuration  
│   └── react-native-rdna-client/ # REL-ID Native Bridge
│
├── 📦 Forgot Password Source Architecture
│   └── src/
│       ├── tutorial/            # Enhanced MFA + Forgot Password flow
│       │   ├── navigation/      # Enhanced navigation with forgot password support
│       │   │   ├── AppNavigator.tsx        # Stack navigation + VerifyPasswordScreen
│       │   │   ├── DrawerNavigator.tsx     # Drawer navigation
│       │   │   └── NavigationService.ts    # Navigation utilities
│       │   └── screens/         # Enhanced screens with forgot password
│       │       ├── components/  # Enhanced UI components
│       │       │   ├── Button.tsx                # Loading and disabled states
│       │       │   ├── Input.tsx                 # Password input with masking
│       │       │   ├── StatusBanner.tsx          # Error and warning displays
│       │       │   └── ...                       # Other reusable components
│       │       ├── mfa/         # 🔐 MFA screens + Forgot Password
│       │       │   ├── VerifyPasswordScreen.tsx  # 🆕 Password verification with forgot password link
│       │       │   ├── SetPasswordScreen.tsx     # Password creation for reset flow
│       │       │   ├── ActivationCodeScreen.tsx  # OTP verification for forgot password
│       │       │   ├── UserLDAConsentScreen.tsx  # LDA consent post password reset
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
│           │   ├── rdnaService.ts                # Added forgot password API
│           │   │                                # - forgotPassword(userId?)
│           │   │                                # - setPassword() for reset
│           │   │                                # - setActivationCode() for verification
│           │   │                                # - setUserConsentForLDA() for post-reset
│           │   └── rdnaEventManager.ts           # Complete event management
│           │                                    # - getActivationCode handler
│           │                                    # - getPassword handler
│           │                                    # - getUserConsentForLDA handler
│           │                                    # - onUserLoggedIn handler
│           ├── types/           # 📝 Enhanced TypeScript definitions
│           │   ├── rdnaEvents.ts                # Complete event type definitions
│           │   │                                # - RDNAGetPasswordData
│           │   │                                # - RDNAGetActivationCodeData
│           │   │                                # - RDNAGetUserConsentForLDAData
│           │   │                                # - RDNAUserLoggedInData
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
cd relid-MFA-forgot-password

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

### Verify Forgot Password Features

Once the app launches, verify these forgot password capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ VerifyPasswordScreen displays "Forgot Password?" link when `challengeMode = 0`
3. ✅ `forgotPassword()` API integration with proper error handling
4. ✅ Verification challenge flow with `getActivationCode` event handling
5. ✅ Dynamic post-verification flow (`getUserConsentForLDA` or `getPassword`)
6. ✅ Automatic login via `onUserLoggedIn` event after successful password reset

## 🎓 Learning Checkpoints

### Checkpoint 1: Forgot Password API Integration
- [ ] I understand when "Forgot Password?" link should be displayed (`challengeMode = 0` + `ENABLE_FORGOT_PASSWORD = true`)
- [ ] I can implement `forgotPassword()` API with proper sync response handling
- [ ] I know how to check `ENABLE_FORGOT_PASSWORD` configuration from challenge info
- [ ] I can handle loading states and error scenarios during forgot password initiation
- [ ] I understand the security implications of forgot password workflows

### Checkpoint 2: Verification Challenge Flow
- [ ] I can handle `getActivationCode` events triggered after `forgotPassword()` call
- [ ] I understand OTP/email verification challenge implementation
- [ ] I can implement ActivationCodeScreen for forgot password verification
- [ ] I know how to handle verification attempts and retry logic
- [ ] I can debug verification challenge flow issues

### Checkpoint 3: Dynamic Post-Verification Flow
- [ ] I understand the dual path after verification: `getUserConsentForLDA` OR `getPassword`
- [ ] I can handle LDA consent flow when biometric setup is required
- [ ] I can implement password reset flow when direct password change is needed
- [ ] I know how to preserve existing event handlers while adding forgot password flow
- [ ] I can manage state transitions between different post-verification scenarios

### Checkpoint 4: Complete Event Chain Management
- [ ] I can implement the complete forgot password event chain:
  - `forgotPassword()` → `getActivationCode` → verification → `getUserConsentForLDA`/`getPassword` → `onUserLoggedIn`
- [ ] I understand event callback preservation patterns for multiple flow support
- [ ] I can debug complex event chain issues and identify failure points
- [ ] I know how to handle edge cases and error recovery in multi-step flows
- [ ] I can test forgot password flow with various server configurations

### Checkpoint 5: Production Forgot Password Management
- [ ] I understand security best practices for forgot password implementations
- [ ] I can implement comprehensive error handling for verification and reset failures
- [ ] I know how to optimize user experience with clear status messaging and guidance
- [ ] I can handle production deployment considerations for forgot password features
- [ ] I understand compliance and audit requirements for password reset workflows

## 🔄 Forgot Password User Flow

### Scenario 1: Standard Forgot Password Flow with LDA Setup
1. **User enters VerifyPasswordScreen** → `challengeMode = 0` (password verification)
2. **"Forgot Password?" link displayed** → `ENABLE_FORGOT_PASSWORD = true` configuration active
3. **User taps "Forgot Password?"** → `forgotPassword(userId)` API called
4. **Verification challenge initiated** → SDK triggers `getActivationCode` event
5. **User receives OTP/Email** → Navigation to ActivationCodeScreen
6. **User enters verification code** → `setActivationCode()` API called
7. **LDA consent required** → SDK triggers `getUserConsentForLDA` event
8. **User approves biometric setup** → Navigation to UserLDAConsentScreen
9. **LDA setup completed** → `setUserConsentForLDA()` API called
10. **Automatic login** → SDK triggers `onUserLoggedIn` event
11. **User reaches dashboard** → Forgot password flow completed successfully

### Scenario 2: Direct Password Reset Flow
1. **User enters VerifyPasswordScreen** → `challengeMode = 0` (password verification)
2. **"Forgot Password?" link displayed** → `ENABLE_FORGOT_PASSWORD = true` configuration active
3. **User taps "Forgot Password?"** → `forgotPassword(userId)` API called
4. **Verification challenge initiated** → SDK triggers `getActivationCode` event
5. **User receives OTP/Email** → Navigation to ActivationCodeScreen
6. **User enters verification code** → `setActivationCode()` API called
7. **Password reset required** → SDK triggers `getPassword` event with `challengeMode = 1`
8. **User creates new password** → Navigation to SetPasswordScreen
9. **Password policy validation** → User enters password meeting policy requirements
10. **New password set** → `setPassword()` API called
11. **Automatic login** → SDK triggers `onUserLoggedIn` event
12. **User reaches dashboard** → Forgot password flow completed successfully

### Scenario 3: Forgot Password Feature Disabled
1. **User enters VerifyPasswordScreen** → `challengeMode = 0` (password verification)
2. **"Forgot Password?" link NOT displayed** → `ENABLE_FORGOT_PASSWORD = false` or not configured
3. **User must use regular password** → Standard password verification flow
4. **Alternative support channels** → User contacts support for password reset assistance

### Scenario 4: Forgot Password Error Handling
1. **User taps "Forgot Password?"** → `forgotPassword(userId)` API called
2. **Feature not supported error** → Error code 170 returned from server
3. **Error displayed to user** → "Forgot password feature is not available"
4. **Fallback to standard flow** → User must use regular password verification
5. **Support guidance provided** → Clear messaging about alternative options

## 📚 Advanced Resources

- **REL-ID Forgot Password Documentation**: [Forgot Password API Guide](https://developer.uniken.com/docs/forgot-password)
- **REL-ID Challenge Modes**: [Understanding Challenge Modes](https://developer.uniken.com/docs/challenge-modes)
- **React Native Form Handling**: [Secure Form Implementation](https://reactnative.dev/docs/textinput)

## 💡 Pro Tips

### Forgot Password Implementation Best Practices
1. **Check configuration dynamically** - Always verify `ENABLE_FORGOT_PASSWORD` from server configuration
2. **Handle challengeMode correctly** - Only show forgot password when `challengeMode = 0` (manual password entry)
3. **Provide clear user feedback** - Display loading states and error messages during verification
4. **Implement proper error handling** - Handle Error Code 170 (feature not supported) gracefully
5. **Test verification challenges thoroughly** - Ensure OTP/email delivery and validation works correctly
6. **Design for both flow paths** - Support both LDA consent and direct password reset scenarios
7. **Preserve existing event handlers** - Use callback preservation patterns for multiple flow support
8. **Optimize user experience** - Minimize steps and provide clear guidance throughout the flow
9. **Secure sensitive operations** - Never log or expose user credentials or verification codes
10. **Test edge cases** - Network failures, invalid codes, expired sessions, server errors

### Integration & Development
11. **Preserve existing MFA flows** - Forgot password should enhance, not disrupt existing functionality
12. **Use proper TypeScript types** - Leverage `RDNASyncResponse` and event types for type safety
13. **Implement comprehensive logging** - Log flow progress for debugging without exposing sensitive data
14. **Test with various server configurations** - Ensure forgot password works across different server setups
15. **Monitor user experience metrics** - Track forgot password success rates and identify pain points

### Security & Compliance
16. **Follow password policy guidelines** - Enforce strong password requirements during reset
17. **Implement rate limiting awareness** - Handle verification attempt limits gracefully
18. **Audit forgot password usage** - Log forgot password attempts for security monitoring
19. **Ensure secure transmission** - All forgot password communications should use secure channels
20. **Test breach scenarios** - Verify forgot password security under various attack scenarios

## 🔗 Key Implementation Files

### Core Forgot Password Implementation
```typescript
// rdnaService.ts - Forgot Password API
async forgotPassword(userId?: string): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    RdnaClient.forgotPassword(userId, response => {
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
// VerifyPasswordScreen.tsx - Conditional Forgot Password Link
const isForgotPasswordEnabled = (): boolean => {
  if (challengeMode !== 0) return false;
  
  if (responseData && RDNAEventUtils.getChallengeValue) {
    const enableForgotPassword = RDNAEventUtils.getChallengeValue(responseData, 'ENABLE_FORGOT_PASSWORD');
    return enableForgotPassword === 'true';
  }
  
  return true; // Default for challengeMode 0
};

{isForgotPasswordEnabled() && (
  <TouchableOpacity onPress={handleForgotPassword}>
    <Text>Forgot Password?</Text>
  </TouchableOpacity>
)}
```

### Event Chain Flow Implementation
```typescript
// Event flow: forgotPassword() → getActivationCode → getUserConsentForLDA/getPassword → onUserLoggedIn

// 1. Initial forgot password call
const handleForgotPassword = async () => {
  await rdnaService.forgotPassword(userID);
  // SDK will trigger getActivationCode event
};

// 2. Handle verification code
const handleActivationCode = async (code: string) => {
  await rdnaService.setActivationCode(code);
  // SDK will trigger getUserConsentForLDA OR getPassword event
};

// 3a. Handle LDA consent (if required)
const handleLDAConsent = async (consent: boolean) => {
  await rdnaService.setUserConsentForLDA(consent, challengeMode, authenticationType);
  // SDK will trigger onUserLoggedIn event
};

// 3b. Handle password reset (if direct reset)
const handlePasswordReset = async (newPassword: string) => {
  await rdnaService.setPassword(newPassword, 1);
  // SDK will trigger onUserLoggedIn event
};
```

---

**🔐 Congratulations! You've mastered Forgot Password Management with REL-ID SDK!**

*You're now equipped to implement secure, user-friendly password reset workflows with verification challenges. Use this knowledge to create seamless forgot password experiences that enhance security while providing excellent user convenience during password recovery scenarios.*

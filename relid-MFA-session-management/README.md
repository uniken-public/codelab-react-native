# REL-ID React Native Codelab: Multi-Factor Authentication & Session Management

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![MFA](https://img.shields.io/badge/MFA-Enabled-orange.svg)]()
[![Session Management](https://img.shields.io/badge/Session-Management-blue.svg)]()

> **Codelab Step 3:** Master Multi-Factor Authentication and Session Management with REL-ID SDK

This folder contains the source code for the complete solution demonstrating [REL-ID MFA and Session Management](https://codelab.uniken.com/codelabs/rn-session-management-flow/index.html?index=..%2F..index#0)

## 🔐 What You'll Learn

In this comprehensive codelab, you'll master production-ready authentication and session management patterns:

### Multi-Factor Authentication (MFA)
- ✅ **User Enrollment Flow**: Complete user registration with cyclical validation
- ✅ **Password Management**: Policy-based password creation and verification
- ✅ **Activation Codes**: Handle activation code generation and validation
- ✅ **Local Device Authentication (LDA)**: Biometric and device consent management

### Session Management
- ✅ **Session Timeout Handling**: Hard timeouts and idle timeout warnings with modal UI
- ✅ **Session Extension**: User-initiated session extension capabilities with API integration
- ✅ **Background/Foreground Tracking**: Accurate timer management across app states
- ✅ **Modal UI Components**: Session timeout modals with countdown timers and user controls
- ✅ **Session State Management**: Global session context with React Context patterns
- ✅ **Automatic Navigation**: Seamless navigation to home screen on session expiration

### Architecture Patterns
- ✅ **Event-Driven Architecture**: SDK callback management with TypeScript safety
- ✅ **Context-Based State Management**: Global session state providers
- ✅ **Promise + Event Callback Patterns**: Hybrid async/sync SDK integration
- ✅ **Reusable Components**: Consistent UI patterns and navigation flows

## 🎯 Learning Objectives

By completing this comprehensive authentication and session management codelab, you'll be able to:

### Multi-Factor Authentication
1. **Implement cyclical user validation** with getUser/setUser event patterns
2. **Build password management systems** with dynamic policy validation
3. **Handle activation code workflows** with retry logic and verification
4. **Create LDA consent flows** with platform-specific biometric detection

### Session Management
5. **Implement session timeout systems** with hard and idle timeout handling
6. **Build session extension capabilities** with user-friendly modal interfaces and API integration
7. **Handle background/foreground transitions** with accurate timer management
8. **Create session timeout modals** with countdown timers and extension controls
9. **Manage session state globally** using React Context patterns
10. **Implement automatic navigation** on session expiration with proper cleanup

### Architecture & Best Practices
11. **Design event-driven architectures** with centralized callback management
12. **Create context-based state management** for global session features
13. **Debug sync flows** with Promise + Event callback patterns
14. **Build production-ready applications** with comprehensive session handling and error management

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Integration Codelab](https://codelab.uniken.com/codelabs/introduction-mfa-codelab/index.html?index=..%2F..index#0)** - Foundation concepts required
- Understanding of React Native navigation and context providers
- Experience with multi-screen application flows and modal components
- Knowledge of authentication and session management principles
- Familiarity with event-driven programming patterns
- Understanding of TypeScript interfaces and callback patterns
- Experience with React Context for state management

## 📁 MFA & Session Management Application Structure

```
relid-MFA-session-management/
├── 📱 Complete React Native MFA & Session App
│   ├── android/                 # Android-specific configuration
│   ├── ios/                     # iOS-specific configuration  
│   └── react-native-rdna-client/ # REL-ID Native Bridge
│
├── 📦 MFA & Session Architecture
│   └── src/
│       ├── tutorial/            # Complete tutorial flow
│       │   ├── navigation/      # Stack navigation
│       │   │   ├── AppNavigator.tsx    # Main navigation stack
│       │   │   └── NavigationService.ts # Centralized navigation
│       │   └── screens/         # All application screens
│       │       ├── components/  # Reusable UI components
│       │       │   ├── Button.tsx
│       │       │   ├── Input.tsx
│       │       │   └── StatusBanner.tsx
│       │       ├── mfa/         # 🔐 MFA-specific screens
│       │       │   ├── CheckUserScreen.tsx      # Cyclical user validation
│       │       │   ├── SetPasswordScreen.tsx    # Password with policy validation
│       │       │   └── UserLDAConsentScreen.tsx # Biometric consent management
│       │       └── tutorial/    # Base tutorial screens
│       │
│       └── uniken/              # 🛡️ REL-ID Integration
│           ├── SessionContext/  # ⏱️ Session Management (KEY FEATURE)
│           │   └── SessionContext.tsx   # Global session timeout handling
│           │                        # - Hard timeout management
│           │                        # - Idle timeout warnings
│           │                        # - Session extension API
│           │                        # - Background/foreground tracking
│           ├── components/      # Session UI components
│           │   └── modals/
│           │       └── SessionModal.tsx # Session timeout modal with countdown
│           │                        # - Countdown timer display
│           │                        # - Session extension controls
│           │                        # - Auto-navigation on expiry
│           ├── providers/       # Global providers
│           │   └── SDKEventProvider.tsx # Event coordination
│           ├── services/        # 🔧 Core SDK services
│           │   ├── rdnaService.ts       # REL-ID SDK API integration
│           │   │                    # - extendSessionIdleTimeout() API
│           │   └── rdnaEventManager.ts  # Centralized event management
│           │                        # - onSessionTimeout events
│           │                        # - onSessionTimeOutNotification
│           │                        # - onSessionExtensionResponse
│           ├── types/           # 📝 TypeScript definitions
│           │   └── rdnaEvents.ts        # Session event types
│           └── utils/           # Helper utilities
│               ├── connectionProfileParser.ts
│               └── passwordPolicyUtils.ts
│
├── 📚 Configuration & Setup
│   ├── App.tsx                  # Root with SessionProvider
│   ├── package.json            # Dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── CLAUDE.md               # Complete architecture documentation
│   └── src/uniken/cp/
│       └── agent_info.json     # Connection profile configuration
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-MFA-session-management

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

## 🎓 Learning Checkpoints

### Checkpoint 1: Multi-Factor Authentication Mastery
- [ ] I understand cyclical user validation with getUser/setUser event flow
- [ ] I can implement password creation with dynamic policy parsing and validation
- [ ] I can handle activation code workflows with retry logic
- [ ] I can create LDA consent flows with platform-specific biometric detection
- [ ] I understand the Promise + Event callback pattern for SDK integration

### Checkpoint 2: Session Management Implementation (KEY FOCUS)
- [ ] I can implement hard session timeout handling with mandatory navigation to home for sdk re-initialization
- [ ] I can create idle session timeout warnings with extension capabilities
- [ ] I can build SessionContext for global session state management
- [ ] I can implement SessionModal with countdown timers and extension controls
- [ ] I understand background/foreground timer accuracy with app state transitions
- [ ] I can integrate `extendSessionIdleTimeout()` API with proper error handling
- [ ] I can handle session extension responses with success/failure feedback
- [ ] I can prevent modal dismissal with hardware back button handling on Android
- [ ] I can implement automatic navigation cleanup on session expiration

### Checkpoint 3: Event-Driven Architecture
- [ ] I can design centralized event management with rdnaEventManager
- [ ] I can implement callback preservation patterns for multiple consumers
- [ ] I can handle session-specific events: onSessionTimeout, onSessionTimeOutNotification, onSessionExtensionResponse
- [ ] I can create context-based state management for session features
- [ ] I can debug async session flows with comprehensive error handling

### Checkpoint 4: Production MFA & Session Applications
- [ ] I can integrate MFA and Session Management features cohesively
- [ ] I can implement TypeScript safety for all session events and responses
- [ ] I can create reusable session UI components and patterns
- [ ] I can build production-ready applications with comprehensive session handling

## Event-Driven Architecture with Session Management Focus

This application demonstrates advanced REL-ID SDK integration with emphasis on Session Management:

### Core Architecture Components

#### 🛠️ Service Layer
- **`rdnaService.ts`**: Singleton service managing REL-ID SDK APIs
  - MFA APIs: `setUser()`, `setPassword()`, `setUserConsentForLDA()`, `resetAuthState()`
  - **Session APIs**: `extendSessionIdleTimeout()` for session extension with API response handling

- **`rdnaEventManager.ts`**: Centralized event management with TypeScript safety
  - Handles all SDK callbacks with proper type definitions
  - **Session Event Handlers**: `onSessionTimeout`, `onSessionTimeOutNotification`, `onSessionExtensionResponse`
  - Implements callback preservation patterns for multiple consumers
  - Provides centralized error handling and event coordination

#### 🗺️ Context-Based Session Management
- **`SessionContext`**: Global session timeout management (KEY COMPONENT)
  - **Hard session timeouts** with mandatory navigation to home screen
  - **Idle timeout warnings** with user-friendly modal interfaces
  - **Session extension capabilities** with API integration and success/failure handling
  - **Background/foreground timer accuracy** with proper app state tracking
  - **Modal state management** with countdown timers and user controls
  - **Automatic cleanup** on session expiration with navigation coordination

#### 🔄 Key Session Management Patterns

**Session Extension API Integration**
```typescript
// Session extension with proper error handling
const extendSession = async () => {
  try {
    setProcessing(true);
    await rdnaService.extendSessionIdleTimeout();
    // Success handled via onSessionExtensionResponse event
  } catch (error) {
    setError('Failed to extend session');
  } finally {
    setProcessing(false);
  }
};
```

**Session Event Management**
```typescript
// Handle session timeout events
eventManager.onSessionTimeoutCallback = () => {
  // Hard timeout - navigate to home immediately
  showHardTimeoutModal();
};

eventManager.onSessionTimeOutNotificationCallback = (data) => {
  // Idle timeout warning - show extension option
  showIdleTimeoutModal(data.remainingTime);
};

eventManager.onSessionExtensionResponseCallback = (response) => {
  // Handle extension success/failure
  if (response.success) {
    dismissModal();
  } else {
    showExtensionError();
  }
};
```

## 📚 Advanced Resources

- **REL-ID MFA Documentation**: [Multi-Factor Authentication Guide](https://developer.uniken.com/docs/challenges)
- **REL-ID Session Management**: [Session Timeout Implementation Guide](https://developer.uniken.com/docs/creating-a-new-session)
- **React Navigation**: [Stack Navigation Patterns](https://reactnavigation.org/docs/stack-navigator/)
- **React Context Patterns**: [Advanced State Management](https://react.dev/reference/react/createContext)
- **Modal Implementation**: [React Native Modal Best Practices](https://reactnative.dev/docs/modal)
- **Background/Foreground Handling**: [App State Management](https://reactnative.dev/docs/appstate)

## 💡 Pro Tips

### Multi-Factor Authentication
1. **Test cyclical validation flows** - Users may need multiple attempts for username/password validation
2. **Parse password policies dynamically** - Extract `RELID_PASSWORD_POLICY` from SDK challenge data
3. **Handle platform-specific biometrics** - Map authentication types correctly (Touch ID, Face ID, Fingerprint)
4. **Provide real-time validation feedback** - Show password policy compliance and form validation errors

### Session Management (KEY FOCUS)
5. **Distinguish session timeout types** - Hard timeouts vs idle timeout warnings require different UI patterns and user actions
6. **Implement accurate background timers** - Track time correctly when app goes to background/foreground using AppState
7. **Handle session extension gracefully** - Provide clear feedback for `extendSessionIdleTimeout()` success/failure with user-friendly messages
8. **Prevent modal dismissal** - Configure modals properly to prevent hardware back button dismissal on Android
9. **Manage session state globally** - Use SessionContext to coordinate session state across the entire app
10. **Implement countdown timers accurately** - Show remaining time with proper formatting and real-time updates
11. **Handle session extension API properly** - Include loading states, error handling, and retry mechanisms
12. **Navigate automatically on timeout** - Ensure clean navigation to home screen when session expires
13. **Test session scenarios thoroughly** - Test hard timeouts, idle warnings, extensions, and background/foreground transitions

### Architecture & Development
14. **Preserve existing callbacks** - Use callback preservation patterns when adding new session event handlers
15. **Leverage TypeScript safety** - Use comprehensive type definitions for all session events and responses
16. **Test on real devices** - Session timing and app state transitions behave differently on physical devices
17. **Debug session flows systematically** - Use centralized event management for easier session debugging
18. **Consider accessibility** - Ensure session timeout modals work with screen readers and provide adequate time for users with disabilities
19. **Implement proper error boundaries** - Handle session-related errors gracefully without crashing the app
20. **Test edge cases** - Handle scenarios like network failures during session extension, rapid background/foreground switches

---

**🔐 Congratulations! You've mastered Multi-Factor Authentication and Session Management with REL-ID SDK!**

*You're now equipped to build production-ready applications with comprehensive MFA flows and sophisticated session management. Use this knowledge to create secure, user-friendly applications that provide excellent authentication experiences while maintaining user sessions intelligently.*

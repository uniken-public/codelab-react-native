# REL-ID React Native Codelab: Multi-Factor Authentication

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![MFA](https://img.shields.io/badge/MFA-Enabled-orange.svg)]()

> **Codelab Step 3:** Master Multi-Factor Authentication implementation with REL-ID SDK

This folder contains the source code for the solution of the [REL-ID MFA](https://codelab.uniken.com/codelabs/rn-mfa-activation-login-flow/index.html?index=..%2F..index#0)

## 🔐 What You'll Learn

In this advanced codelab, you'll master production-ready Multi-Factor Authentication patterns:

- ✅ **User Enrollment Flow**: Complete user registration and setup process
- ✅ **Password Management**: Secure password creation and verification
- ✅ **Activation Codes**: Handle activation code generation and validation
- ✅ **User Consent Management**: Implement privacy and consent workflows  
- ✅ **Dashboard Navigation**: Multi-screen navigation with drawer patterns
- ✅ **Authentication Flows**: End-to-end MFA verification processes
- ✅ **Reusable Components**: Extract common UI patterns for maintainable code

## 🎯 Learning Objectives

By completing this MFA codelab, you'll be able to:

1. **Implement complete user enrollment** with secure registration flows
2. **Build password management systems** with verification patterns
3. **Handle activation code workflows** for user verification
4. **Create consent management flows** for privacy compliance
5. **Implement drawer navigation** for multi-screen MFA applications
6. **Create reusable UI components** for consistent styling and behavior
7. **Debug and troubleshoot MFA flows** effectively

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID Basic Integration Codelab](https://codelab.uniken.com/codelabs/rn-relid-initialization-flow/index.html?index=..%2F..index#0)** - Foundation concepts required
- Understanding of React Native navigation and form handling
- Experience with multi-screen application flows
- Knowledge of authentication and security principles

## 📁 MFA Project Structure

```
relid-MFA/
├── 📱 Complete React Native MFA App
│   ├── android/                 # Android-specific configuration
│   ├── ios/                     # iOS-specific configuration  
│   └── react-native-rdna-client/ # REL-ID Native Bridge
│
├── 📦 MFA Source Architecture
│   └── src/
│       ├── tutorial/            # MFA tutorial flow
│       │   ├── navigation/      # Drawer & Stack navigation
│       │   │   ├── AppNavigator.tsx
│       │   │   └── DrawerNavigator.tsx
│       │   └── screens/         # MFA screens
│       │       ├── components/  # Shared UI components (Button, Input, StatusBanner)
│       │       ├── mfa/         # 🆕 MFA-specific screens
│       │       │   ├── ActivationCodeScreen.tsx
│       │       │   ├── CheckUserScreen.tsx      # User input & setUser API
│       │       │   ├── DashboardScreen.tsx
│       │       │   ├── SetPasswordScreen.tsx
│       │       │   ├── UserLDAConsentScreen.tsx
│       │       │   └── VerifyPasswordScreen.tsx
│       │       └── tutorial/    # Base tutorial screens
│       └── uniken/              # REL-ID Integration + MTD
│           ├── MTDContext/      # Threat management
│           ├── services/        # SDK service layer
│           └── utils/           # Helper utilities
│               ├── connectionProfileParser.ts
│               └── passwordPolicyUtils.ts    # Password validation helpers
│
└── 📚 Production Configuration
    ├── package.json             # Dependencies
    └── tsconfig.json           # TypeScript config
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-initialize

# Place the react-native-rdna-client plugin 
# at root folder of this project (refer to Project Structure above for more info)

# Install dependencies
npm install

# iOS additional setup
cd ios && pod install && cd ..

# Run the application
npx react-native run-android
# or
npx react-native run-ios
```

## 🎓 Learning Checkpoints

### Checkpoint 1: MFA Flow Mastery
- [ ] I understand the complete user enrollment process
- [ ] I can implement password creation and verification with policy validation
- [ ] I know how to handle activation codes
- [ ] I can create user consent workflows
- [ ] I understand the CheckUserScreen for user input and setUser API integration

### Checkpoint 2: Navigation & UX
- [ ] I can implement drawer navigation patterns
- [ ] I understand multi-screen MFA flows
- [ ] I can create intuitive user experiences
- [ ] I can handle form validation and errors

### Checkpoint 3: Security & Production
- [ ] I know MFA security best practices
- [ ] I can implement secure password handling with policy validation
- [ ] I understand privacy and consent management
- [ ] I can debug complex MFA workflows
- [ ] I can utilize password policy utilities for enhanced security

## 📚 Advanced Resources

- **REL-ID MFA Documentation**: [Multi-Factor Authentication Guide](https://developer.uniken.com/docs/mfa)
- **React Navigation Drawer**: [Drawer Navigation Patterns](https://reactnavigation.org/docs/drawer-navigator/)

## 💡 Pro Tips

1. **Test complete user flows** - Verify the entire enrollment to verification process
2. **Implement progressive disclosure** - Don't overwhelm users with too many steps at once
3. **Handle network failures gracefully** - MFA flows often depend on server communication
4. **Provide clear feedback** - Users need to understand each step of the MFA process
5. **Test on real devices** - Touch ID, Face ID, and biometric features require physical devices
6. **Consider accessibility** - Ensure MFA flows work with screen readers and assistive technologies

---

**🔐 Congratulations! You've mastered Multi-Factor Authentication with REL-ID SDK!**

*You're now equipped to integrate REL-ID MFA module into applications with comprehensive authentication flows. Use this knowledge to build secure, user-friendly authentication experiences.*

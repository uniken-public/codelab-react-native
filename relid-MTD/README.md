# REL-ID React Native Codelab: Mobile Threat Defense

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![Security](https://img.shields.io/badge/Security-MTD%20Enabled-red.svg)](https://developer.uniken.com/docs/mobile-threat-defense)

> **Codelab Step 2:** Master advanced Mobile Threat Defense implementation with REL-ID SDK

This folder contains the source code for the solution of the [REL-ID MTD](https://codelab.uniken.com/codelabs/mtd-flow-codelab/index.html?index=..%2F..index#0)

## 🛡️ What You'll Learn

In this advanced codelab, you'll master production-ready Mobile Threat Defense patterns:

- ✅ **Mobile Threat Defense (MTD)**: Real-time threat detection and response
- ✅ **User Consent Flows**: Handle non-critical threats with user interaction
- ✅ **Terminating Threats**: Manage critical security threats automatically
- ✅ **Platform-Specific Exits**: iOS HIG-compliant and Android native exit patterns
- ✅ **Advanced State Management**: Context-based threat handling
- ✅ **Production Security Patterns**: Enterprise-grade threat response

## 🎯 Learning Objectives

By completing this advanced codelab, you'll be able to:

1. **Implement comprehensive MTD** with user consent and terminating threat flows
2. **Create platform-specific security exits** following platform guidelines
3. **Build sophisticated threat modals** with proper UX patterns
4. **Handle complex threat state management** using React Context
5. **Implement production-ready security policies** for enterprise applications
6. **Debug and troubleshoot MTD issues** effectively

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID Basic Integration Codelab](https://codelab.uniken.com/codelabs/relid-initialization-flow/index.html?index=..%2F..index#0)** - Foundation concepts required
- Understanding of React Context API and advanced React patterns
- Experience with React Native navigation and modal components
- Knowledge of mobile security principles

## 📁 Advanced Project Structure

```
relid-MTD/
├── 📱 Complete React Native App
│   ├── android/                 # Android-specific configuration
│   ├── ios/                     # iOS-specific configuration  
│   └── react-native-rdna-client/ # Enhanced REL-ID Native Bridge
│
├── 📦 Advanced Source Architecture
│   └── src/
│       ├── tutorial/            # Enhanced tutorial flow
│       │   ├── navigation/      # Advanced navigation patterns
│       │   └── screens/         # Home, Success, Error, SecurityExit
│       └── uniken/              # Production REL-ID Integration
│           ├── MTDContext/      # 🆕 Global threat management
│           ├── components/      # 🆕 Reusable threat UI components
│           │   └── modals/      # 🆕 ThreatDetectionModal
│           ├── providers/       # Enhanced SDK event provider
│           ├── services/        # Production SDK service layer
│           ├── types/           # Complete TypeScript definitions
│           └── utils/           # Advanced helper utilities
│
└── 📚 Production Configuration
    ├── package.json             # Production dependencies
    ├── tsconfig.json           # Strict TypeScript config
    └── lefthook.yml            # Git hooks for code quality
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

### Checkpoint 1: MTD Architecture Mastery
- [ ] I understand the MTD threat detection lifecycle
- [ ] I can implement user consent vs terminating threat flows
- [ ] I know how to prevent duplicate threat dialogs
- [ ] I can create platform-specific security exits

### Checkpoint 2: Production Implementation
- [ ] I can implement enterprise-grade threat policies
- [ ] I understand proper threat state management
- [ ] I can optimize threat detection performance
- [ ] I can handle edge cases and error scenarios

### Checkpoint 3: Security Expertise
- [ ] I know mobile security best practices
- [ ] I can implement secure error handling
- [ ] I understand threat severity classification
- [ ] I can debug complex MTD issues

## 📚 Advanced Resources

- **REL-ID MTD Documentation**: [Mobile Threat Defense Guide](https://developer.uniken.com/docs/mobile-threat-defense)
- **React Context Patterns**: [Advanced React Patterns](https://reactpatterns.com/)

## 💡Pro Tips

1. **Always test MTD on real devices** - Simulators may not trigger actual threats
2. **Implement graceful degradation** - Handle MTD failures without breaking app
3. **Use threat whitelisting carefully** - Balance security with user experience
4. **Monitor threat patterns** - Look for unusual threat frequency or types
5. **Keep threat policies updated** - Security landscape evolves rapidly
6. **Test on real devices** - SDK behavior can differ between simulator and device

---

**🛡️ Congratulations! You've mastered advanced Mobile Threat Defense with REL-ID SDK!**

*You're now equipped to integrate REL-ID MTD module into applications with comprehensive threat protection. Use this knowledge to protect your users and their data in production environments.*


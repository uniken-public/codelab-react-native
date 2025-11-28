# REL-ID React Native Codelab: Basic SDK Integration

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)

> **Codelab Step 1:** Learn the fundamentals of REL-ID SDK integration in React Native applications

This folder contains the source code for the solution of the [REL-ID Initialize](https://codelab.uniken.com/codelabs/rn-relid-initialization-flow/index.html?index=..%2F..index#0)

## 📚 What You'll Learn

In this foundational codelab, you'll master the essential concepts of REL-ID SDK integration:

- ✅ **Core SDK Initialization**: Understand the REL-ID SDK lifecycle
- ✅ **Event-Driven Architecture**: Handle SDK callbacks and responses
- ✅ **Connection Profile Management**: Configure SDK with proper credentials
- ✅ **Error Handling Patterns**: Implement robust error management
- ✅ **TypeScript Integration**: Type-safe SDK interactions
- ✅ **React Native Bridge**: Native module communication patterns

## 🎯 Learning Objectives

By the end of this codelab, you'll be able to:

1. **Initialize REL-ID SDK** in a React Native application
2. **Handle SDK events** using event-driven architecture
3. **Parse connection profiles** for SDK configuration
4. **Implement navigation flows** based on SDK responses
5. **Debug common initialization issues** effectively

## 📁 Project Structure

```
relid-initialize/
├── 📱 React Native App Configuration
│   ├── android/                 # Android-specific configuration
│   ├── ios/                     # iOS-specific configuration
│   └── react-native-rdna-client/ # REL-ID Native Bridge Module
│
├── 📦 Source Code
│   └── src/
│       ├── tutorial/            # Tutorial screens and navigation
│       │   ├── navigation/      # Stack navigator setup
│       │   └── screens/         # Home, Success, Error screens
│       └── uniken/              # REL-ID SDK integration
│           ├── providers/       # SDK event provider
│           ├── services/        # Core SDK service layer
│           ├── types/           # TypeScript definitions
│           └── utils/           # Helper utilities
│
└── 📚 Configuration Files
    ├── package.json             # Dependencies and scripts
    ├── tsconfig.json           # TypeScript configuration
    └── app.json                # React Native app config
```

## 🚀 Quick Start

### Prerequisites

Before starting this codelab, ensure you have:

- **Node.js 18+** installed
- **React Native development environment** set up
- **Android Studio** or **Xcode** for device testing
- **react-native-rdna-client** plugin and **REL-ID connection profile** from your Uniken administrator


### Installation

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

### Checkpoint 1: Basic Understanding
- [ ] I understand REL-ID SDK initialization flow
- [ ] I can explain the event-driven architecture
- [ ] I know how to handle SDK callbacks

### Checkpoint 2: Implementation Skills
- [ ] I can integrate REL-ID SDK in a new React Native app
- [ ] I can implement proper error handling
- [ ] I can create type-safe SDK interactions

### Checkpoint 3: Advanced Concepts
- [ ] I understand connection profile management
- [ ] I can debug common SDK issues
- [ ] I can implement custom progress tracking

## 📚 Additional Resources

- **REL-ID Developer Documentation**: [https://developer.uniken.com/](https://developer.uniken.com/)
- **React Native Guide**: [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)
- **TypeScript Handbook**: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)

## 💡 Pro Tips

1. **Always handle both success and error callbacks** - REL-ID SDK is asynchronous
2. **Use TypeScript** for better developer experience and error prevention
3. **Test on real devices** - SDK behavior can differ between simulator and device
4. **Keep connection profiles secure** - Never commit credentials to version control
5. **Enable debug logging during development** - Helps troubleshoot initialization issues

---

**Ready to build secure React Native apps with REL-ID? Let's start coding! 🚀**

*This codelab provides hands-on experience with REL-ID SDK fundamentals. Master these concepts before advancing to Mobile Threat Defense features.*

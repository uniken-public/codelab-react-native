# REL-ID React Native Codelab: IDV Pre-Login KYC

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![IDV](https://img.shields.io/badge/IDV-Identity%20Verification-blue.svg)]()
[![KYC](https://img.shields.io/badge/KYC-Pre--Login-green.svg)]()
[![Document Capture](https://img.shields.io/badge/Document%20Capture-Enabled-orange.svg)]()
[![Biometric](https://img.shields.io/badge/Biometric-Selfie%20Capture-purple.svg)]()

> **Codelab Advanced:** Master IDV (Identity Verification) Pre-Login KYC workflows with REL-ID SDK

This folder contains the source code for the solution demonstrating [REL-ID IDV Pre-Login KYC](https://codelab.uniken.com/codelabs/relid-initialization-flow/index.html?index=..%2F..index#0) using comprehensive identity verification flows including document capture, selfie verification, and biometric consent management.

## 🔐 What You'll Learn

In this advanced IDV Pre-Login KYC codelab, you'll master production-ready identity verification patterns:

- ✅ **IDV Document Capture Integration**: `setIDVDocumentScanProcessStartConfirmation()` API with document scanning workflows
- ✅ **Selfie Capture Management**: `setIDVSelfieProcessStartConfirmation()` API with biometric selfie verification
- ✅ **Document Verification Flow**: Handle `getIDVConfirmDocumentDetails` events for document validation
- ✅ **Biometric Consent Management**: Navigate through `getIDVBiometricOptInConsent` events for template storage
- ✅ **IDV Configuration Control**: `getIDVConfig()` and `setIDVConfig()` APIs for dynamic workflow configuration
- ✅ **Event-Driven IDV Architecture**: Handle complete IDV event chains from document scan to biometric enrollment
- ✅ **Native Camera Integration**: React Native IDV document and selfie capture plugins
- ✅ **Pre-Login KYC Workflows**: Complete identity verification before user authentication

## 🎯 Learning Objectives

By completing this IDV Pre-Login KYC codelab, you'll be able to:

1. **Implement IDV document capture workflows** with native camera integration and server validation
2. **Handle IDV selfie capture processes** with biometric verification and liveness detection
3. **Build complete identity verification flows** from document scan to biometric enrollment
4. **Create seamless KYC user experiences** with real-time feedback and error handling
5. **Design event-driven IDV architecture** with proper SDK event chain management
6. **Integrate IDV functionality** with MFA authentication and pre-login verification flows
7. **Configure dynamic IDV workflows** using server-driven configuration management
8. **Debug IDV flows** and troubleshoot document capture and biometric verification issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/rn-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of identity verification workflows and document validation
- Experience with React Native camera integration and native modules
- Knowledge of REL-ID SDK event-driven architecture patterns
- Experience with TypeScript interfaces and complex data structures

## 📁 IDV Pre-Login KYC Project Structure

```
relid-IDV-PreLogin-KYC/
├── 📱 Enhanced React Native MFA + IDV KYC App
│   ├── android/                 # Android-specific configuration
│   │   ├── build.gradle                  # 🆕 IDV plugin flatDir configuration
│   │   └── app/src/main/
│   │       ├── assets/Regula/            # 🆕 IDV assets directory
│   │       │   ├── db.dat                # Regula document recognition database (108MB)
│   │       │   └── certificates/         # ICAO PKD certificates
│   │       │       └── icaopkd-002-complete-000319.ldif
│   │       └── res/raw/                  # 🆕 Android resources directory
│   │           └── regula.license        # Regula document reader license for Android
│   ├── ios/                     # iOS-specific configuration + Regula certificates
│   │   ├── Certificates.bundle/          # 🆕 Document verification certificates
│   │   │   └── icaopkd-002-complete-000319.ldif
│   │   ├── db.dat                       # 🆕 Document recognition database (108MB)
│   │   └── regula.license               # 🆕 Regula document reader license
│   ├── react-native-rdna-client/        # REL-ID Native Bridge
│   ├── react-native-relid-idv-document-capture/ # 🆕 IDV Document capture plugin
│   └── react-native-relid-idv-selfie-capture/   # 🆕 IDV Selfie capture plugin

├── 📦 IDV KYC Source Architecture
│   └── src/
│       ├── tutorial/            # Enhanced MFA + IDV flow
│       │   ├── navigation/      # Enhanced navigation with IDV support
│       │   │   ├── AppNavigator.tsx        # Stack navigation + IDV screens
│       │   │   ├── DrawerNavigator.tsx     # Drawer navigation
│       │   │   └── NavigationService.ts    # Navigation utilities with IDV routing
│       │   └── screens/         # Enhanced screens with IDV
│       │       ├── components/  # Enhanced UI components
│       │       │   ├── Button.tsx                # Loading and disabled states
│       │       │   ├── Input.tsx                 # Enhanced input components
│       │       │   ├── StatusBanner.tsx          # Error and warning displays
│       │       │   └── ...                       # Other reusable components
│       │       ├── mfa/         # 🔐 MFA screens (base authentication)
│       │       │   ├── CheckUserScreen.tsx       # User validation
│       │       │   ├── ActivationCodeScreen.tsx  # OTP verification
│       │       │   ├── SetPasswordScreen.tsx     # Password creation
│       │       │   ├── VerifyPasswordScreen.tsx  # Password verification
│       │       │   ├── UserLDAConsentScreen.tsx  # LDA consent
│       │       │   ├── VerifyAuthScreen.tsx      # Verify authentication
│       │       │   ├── DashboardScreen.tsx       # Main dashboard
│       │       │   └── ...                       # Other MFA screens
│       │       ├── idv/         # 🆕 IDV Pre-Login KYC screens (6 screens)
│       │       │   ├── IDVBiometricOptInConsentScreen.tsx            # Biometric consent management
│       │       │   ├── IDVConfigSettings.tsx                         # 🆕 IDV configuration management
│       │       │   ├── IDVConfirmDocumentDetailsScreen.tsx            # Document validation and confirmation
│       │       │   ├── IDVDocumentProcessStartConfirmationScreen.tsx  # Document scan initiation
│       │       │   ├── IDVSelfieConfirmationScreen.tsx               # Selfie verification and confirmation
│       │       │   └── IDVSelfieProcessStartConfirmationScreen.tsx    # Selfie capture initiation
│       │       ├── notification/ # Notification Management System
│       │       │   ├── GetNotificationsScreen.tsx # Server notification management
│       │       │   └── index.ts                   # Notification exports
│       │       └── tutorial/    # Base tutorial screens
│       └── uniken/              # 🛡️ Enhanced REL-ID Integration
│           ├── providers/       # Enhanced providers
│           │   └── SDKEventProvider.tsx          # Complete event handling + IDV events
│           ├── services/        # 🆕 Enhanced SDK service layer
│           │   ├── rdnaService.ts                # Added IDV APIs
│           │   │                                # - setIDVDocumentScanProcessStartConfirmation()
│           │   │                                # - setIDVSelfieProcessStartConfirmation()
│           │   │                                # - setIDVConfirmDocumentDetails()
│           │   │                                # - setIDVSelfieConfirmation()
│           │   │                                # - setIDVBiometricOptInConsent()
│           │   │                                # - getIDVConfig() / setIDVConfig()
│           │   └── rdnaEventManager.ts           # Complete event management + IDV handlers
│           │                                    # - getIDVDocumentScanProcessStartConfirmation handler
│           │                                    # - getIDVSelfieProcessStartConfirmation handler
│           │                                    # - getIDVConfirmDocumentDetails handler
│           │                                    # - getIDVSelfieConfirmation handler
│           │                                    # - getIDVBiometricOptInConsent handler
│           ├── types/           # 📝 Enhanced TypeScript definitions
│           │   ├── rdnaEvents.ts                # Complete event type definitions + IDV types
│           │   │                                # - RDNAGetIDVDocumentScanProcessStartConfirmationData
│           │   │                                # - RDNAGetIDVSelfieProcessStartConfirmationData
│           │   │                                # - RDNAGetIDVConfirmDocumentDetailsData
│           │   │                                # - RDNAGetIDVSelfieConfirmationData
│           │   │                                # - RDNAGetIDVBiometricOptInConsentData
│           │   └── index.ts                     # Type exports
│           └── utils/           # Helper utilities
│               ├── connectionProfileParser.ts  # Profile configuration
│               ├── passwordPolicyUtils.ts      # Password validation
│               └── progressHelper.ts           # Progress tracking utilities

└── 📚 Production Configuration
    ├── package.json             # Dependencies with IDV plugins
    ├── tsconfig.json           
    └── react-native.config.js   # IDV plugin configuration
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-IDV-PreLogin-KYC

# Place the required native plugins at root folder of this project:
# - react-native-rdna-client
# - react-native-relid-idv-document-capture
# - react-native-relid-idv-selfie-capture

# Install dependencies
npm install

# iOS additional setup (required for CocoaPods and IDV plugins)
cd ios && pod install && cd ..

# Run the application
npx react-native run-android
# or
npx react-native run-ios
```

### IDV Dependencies Configuration

The project includes pre-configured IDV dependencies and assets:

#### Android Configuration:
- **Gradle Dependencies**: IDV plugin paths configured in `android/build.gradle`
  ```gradle
  // IDV document capture plugin
  flatDir { 
      dirs "$rootDir/../node_modules/react-native-relid-idv-document-capture/android/libs" 
  }
  // IDV selfie capture plugin  
  flatDir { 
      dirs "$rootDir/../node_modules/react-native-relid-idv-selfie-capture/android/libs" 
  }
  ```
- **Regula Assets**: Document recognition database and certificates in `android/app/src/main/assets/Regula/`
  - `db.dat` - Regula document recognition database (108MB)
  - `certificates/icaopkd-002-complete-000319.ldif` - ICAO PKD certificates for document validation
- **Regula License**: Document reader license in `android/app/src/main/res/raw/`
  - `regula.license` - Regula document reader license file for Android

#### iOS Configuration:
- **Document Recognition Database**: `ios/db.dat` (108MB)
- **Regula License**: `ios/regula.license` - Document reader license file
- **Certificate Bundle**: `ios/Certificates.bundle/icaopkd-002-complete-000319.ldif` - ICAO PKD certificates

### Verify IDV Features

Once the app launches, verify these IDV capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ **6 IDV screens implemented**: Document scan, selfie capture, confirmations, biometric consent, and configuration management
3. ✅ Native document capture integration with Regula document reader
4. ✅ IDV selfie capture process with biometric verification and liveness detection
5. ✅ Document validation and confirmation workflows with extracted data display
6. ✅ Biometric template opt-in consent management with privacy controls
7. ✅ Dynamic IDV configuration management via `getIDVConfig()` and `setIDVConfig()` APIs
8. ✅ Comprehensive IDV event handling and screen navigation flows

## 🎓 Learning Checkpoints

### Checkpoint 1: IDV Document Capture Integration
- [ ] I understand IDV workflow types and their significance (0=activation, 2=device activation, 4=recovery, 5=post-login, 6=KYC, 13=agent KYC)
- [ ] I can implement `setIDVDocumentScanProcessStartConfirmation()` API with proper workflow parameter handling
- [ ] I know how to handle `getIDVDocumentScanProcessStartConfirmation` events and navigate to document scan screens
- [ ] I can integrate native document capture plugins with React Native
- [ ] I understand Regula document reader configuration and certificate management

### Checkpoint 2: IDV Selfie Capture Process
- [ ] I can handle `getIDVSelfieProcessStartConfirmation` events for selfie capture initiation
- [ ] I understand camera selection parameters (front camera vs back camera) for selfie capture
- [ ] I can implement `setIDVSelfieProcessStartConfirmation()` API with camera configuration
- [ ] I know how to integrate biometric selfie capture plugins
- [ ] I can handle liveness detection and face matching verification processes

### Checkpoint 3: Document and Selfie Verification Flow
- [ ] I understand `getIDVConfirmDocumentDetails` events with extracted document data
- [ ] I can implement document validation screens with extracted information display
- [ ] I can handle `setIDVConfirmDocumentDetails()` API for user confirmation
- [ ] I understand `getIDVSelfieConfirmation` events with biometric matching results
- [ ] I can implement `setIDVSelfieConfirmation()` API for selfie verification

### Checkpoint 4: Biometric Consent and Configuration Management
- [ ] I can handle `getIDVBiometricOptInConsent` events for biometric template storage
- [ ] I understand biometric template management and privacy considerations
- [ ] I can implement `setIDVBiometricOptInConsent()` API with user consent handling
- [ ] I know how to use `getIDVConfig()` and `setIDVConfig()` APIs for dynamic workflow configuration
- [ ] I can manage IDV configuration JSON structures for different document types and capture settings

### Checkpoint 5: Complete IDV Event Chain Management
- [ ] I can implement the complete IDV event chain:
  - MFA Authentication → IDV Document Scan → Document Confirmation → Selfie Capture → Selfie Confirmation → Biometric Consent → Login
- [ ] I understand event callback preservation patterns for complex multi-step IDV flows
- [ ] I can debug IDV event chain issues and identify failure points in document or selfie processes
- [ ] I know how to handle edge cases like camera permissions, document validation failures, and biometric matching errors
- [ ] I can test IDV flows with various document types and biometric scenarios

### Checkpoint 6: Production IDV KYC Implementation
- [ ] I understand KYC compliance requirements and identity verification standards
- [ ] I can implement comprehensive error handling for document capture, validation, and biometric verification failures
- [ ] I know how to optimize user experience with clear guidance, progress indicators, and retry mechanisms
- [ ] I can handle production deployment considerations for IDV features including certificate management
- [ ] I understand security and privacy requirements for biometric data handling and storage

## 🔄 IDV Pre-Login KYC User Flow

### Scenario 1: Complete IDV KYC Flow (New User Registration)
1. **User initiates registration** → MFA flow begins with user validation
2. **MFA authentication completed** → SDK triggers IDV document scan confirmation
3. **Document scan preparation** → `getIDVDocumentScanProcessStartConfirmation` event received
4. **User confirms document scan** → Navigation to IDVDocumentProcessStartConfirmationScreen
5. **Document capture initiated** → `setIDVDocumentScanProcessStartConfirmation(true, idvWorkflow)` called
6. **Native document capture** → User scans identity document using camera
7. **Document validation** → SDK triggers `getIDVConfirmDocumentDetails` event with extracted data
8. **User reviews document details** → Navigation to IDVConfirmDocumentDetailsScreen
9. **Document confirmation** → `setIDVConfirmDocumentDetails(true, challengeMode)` called
10. **Selfie capture preparation** → SDK triggers `getIDVSelfieProcessStartConfirmation` event
11. **User confirms selfie capture** → Navigation to IDVSelfieProcessStartConfirmationScreen  
12. **Selfie capture initiated** → `setIDVSelfieProcessStartConfirmation(true, useBackCamera, idvWorkflow)` called
13. **Native selfie capture** → User captures selfie with liveness detection
14. **Selfie verification** → SDK triggers `getIDVSelfieConfirmation` event with biometric results
15. **User reviews selfie results** → Navigation to IDVSelfieConfirmationScreen
16. **Selfie confirmation** → `setIDVSelfieConfirmation("true", challengeMode)` called
17. **Biometric consent request** → SDK triggers `getIDVBiometricOptInConsent` event
18. **User provides biometric consent** → Navigation to IDVBiometricOptInConsentScreen
19. **Biometric template storage** → `setIDVBiometricOptInConsent(true, challengeMode)` called
20. **IDV process completed** → SDK triggers `onUserLoggedIn` event
21. **User reaches dashboard** → Complete IDV KYC flow successfully completed

### Scenario 2: IDV Document Capture Only (Post-Login Verification)
1. **Authenticated user** → Post-login IDV verification required (`idvWorkflow = 5`)
2. **Document scan initiated** → `getIDVDocumentScanProcessStartConfirmation` event with workflow 5
3. **Document capture process** → User scans document for additional verification
4. **Document validation** → `getIDVConfirmDocumentDetails` event with validation results
5. **Process completion** → User returns to main application flow

### Scenario 3: Agent KYC Workflow (Customer Onboarding)
1. **Agent initiates customer KYC** → Agent-assisted IDV flow (`idvWorkflow = 13`)
2. **Customer document scan** → Agent helps customer scan identity documents
3. **Agent validation** → Agent reviews and confirms document details
4. **Customer selfie capture** → Agent assists with selfie capture process
5. **KYC completion** → Agent completes customer onboarding process

### Scenario 4: IDV Error Handling and Recovery
1. **Document capture failure** → Poor lighting or document not recognized
2. **User guidance provided** → Clear instructions for retaking document photos
3. **Retry mechanism** → User can retry document capture process
4. **Selfie capture failure** → Liveness detection or face matching failure
5. **Recovery flow** → User guided through selfie recapture process
6. **Fallback options** → Alternative verification methods if IDV fails

## 📚 Advanced Resources

- **REL-ID IDV Documentation**: [Identity Verification API Guide](https://developer.uniken.com/docs/idv)
- **Document Capture Integration**: [Native Camera Plugin Setup](https://developer.uniken.com/docs/idv-document-capture)
- **Biometric Verification**: [Selfie Capture and Face Matching](https://developer.uniken.com/docs/idv-selfie-capture)
- **React Native Camera**: [Camera Permissions and Integration](https://reactnative.dev/docs/permissions)

## 💡 Pro Tips

### IDV Implementation Best Practices
1. **Configure IDV workflows dynamically** - Use `getIDVConfig()` to retrieve server-side IDV configuration
2. **Handle camera permissions properly** - Ensure camera permissions are requested before IDV processes
3. **Provide clear user guidance** - Display helpful instructions for document positioning and selfie capture
4. **Implement proper error handling** - Handle document validation failures and biometric verification errors gracefully
5. **Test with various document types** - Ensure IDV works with different identity documents and formats
6. **Optimize user experience** - Minimize steps and provide real-time feedback during capture processes
7. **Secure biometric data handling** - Follow privacy best practices for biometric template storage and processing
8. **Monitor IDV success rates** - Track document capture and verification success rates for optimization
9. **Handle edge cases thoroughly** - Network failures, camera issues, poor lighting conditions
10. **Test across different devices** - Ensure IDV works consistently across various mobile device configurations

### IDV Dependencies & Assets Management
11. **Verify Regula database placement** - Ensure `db.dat` (108MB) is properly placed in both iOS and Android assets
12. **Certificate bundle validation** - Confirm ICAO PKD certificates are correctly configured for document validation
13. **License file management** - Ensure `regula.license` is properly configured for iOS document reader
14. **Gradle flatDir configuration** - Verify IDV plugin paths are correctly set in `android/build.gradle`
15. **Asset size optimization** - Monitor app size impact of large IDV assets (>100MB database files)

### Integration & Development
16. **Preserve existing MFA flows** - IDV should enhance, not disrupt existing authentication functionality
17. **Use proper TypeScript types** - Leverage IDV-specific event types for type safety
18. **Implement comprehensive logging** - Log IDV flow progress for debugging without exposing sensitive data
19. **Test with various IDV workflows** - Ensure proper handling of different workflow types (0, 2, 4, 5, 6, 13)
20. **Monitor performance metrics** - Track IDV completion times and identify bottlenecks

### Security & Compliance
21. **Follow KYC compliance guidelines** - Ensure IDV implementation meets regulatory requirements
22. **Implement secure document handling** - Never log or expose sensitive document data
23. **Audit IDV usage** - Log IDV attempts and completions for compliance monitoring
24. **Ensure secure transmission** - All IDV communications should use secure channels
25. **Test privacy scenarios** - Verify biometric data handling under various privacy configurations

## 🔗 Key Implementation Files

### Core IDV API Implementation
```typescript
// rdnaService.ts - IDV Document Scan API
async setIDVDocumentScanProcessStartConfirmation(isConfirm: boolean, idvWorkflow: number): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    RdnaClient.setIDVDocumentScanProcessStartConfirmation(isConfirm, idvWorkflow, response => {
      const result: RDNASyncResponse = response;
      if (result.error && result.error.longErrorCode === 0) {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });
}

// rdnaService.ts - IDV Configuration Management
async getIDVConfig(): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    RdnaClient.getIDVConfig(response => {
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

### IDV Event Handling Implementation
```tsx
// SDKEventProvider.tsx - IDV Document Scan Event Handler
const handleGetIDVDocumentScanProcessStartConfirmation = useCallback(async (data: RDNAGetIDVDocumentScanProcessStartConfirmationData) => {
  console.log('IDV document scan event received for user:', data.userID);
  console.log('IDV workflow:', data.idvWorkflow);
  
  try {
    // Get IDV configuration before navigation
    const configResponse = await rdnaService.getIDVConfig();
    console.log('IDV config response:', configResponse);
    
    // Navigate to document scan confirmation screen
    NavigationService.navigateOrUpdate('IDVDocumentProcessStartConfirmationScreen', {
      eventName: 'getIDVDocumentScanProcessStartConfirmation',
      eventData: data,
      title: 'Document Scan Information',
      subtitle: `Prepare to scan your identity document for user: ${data.userID}`,
      responseData: data,
    });
  } catch (error) {
    console.error('Failed to get IDV config:', error);
    // Still navigate to screen even if config fails
  }
}, []);
```

### IDV Screen Implementation
```tsx
// IDVDocumentProcessStartConfirmationScreen.tsx - Document Scan Initiation
const handleScanButtonAction = async () => {
  try {
    setIsProcessing(true);
    console.log('Starting IDV document scan process...');
    
    const idvWorkflow = scanData?.idvWorkflow || 0;
    
    // Call the API to confirm starting the document scan process
    const response = await RdnaService.setIDVDocumentScanProcessStartConfirmation(true, idvWorkflow);
    
    console.log('Document scan API response:', response);
    
  } catch (error) {
    console.error('Failed to start document scan:', error);
    setError('Failed to start document scan process');
    Alert.alert('Error', 'Failed to start document scan process');
  } finally {
    setIsProcessing(false);
  }
};
```

---

**🔐 Congratulations! You've mastered IDV Pre-Login KYC with REL-ID SDK!**

*You're now equipped to implement comprehensive identity verification workflows with document capture, biometric verification, and compliance-ready KYC processes. Use this knowledge to create seamless IDV experiences that enhance security while providing excellent user convenience during identity verification scenarios.*
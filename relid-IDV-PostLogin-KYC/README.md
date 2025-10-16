# REL-ID React Native Codelab: IDV Post-Login KYC

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![IDV](https://img.shields.io/badge/IDV-Identity%20Verification-blue.svg)]()
[![KYC](https://img.shields.io/badge/KYC-Post--Login-green.svg)]()
[![Document Capture](https://img.shields.io/badge/Document%20Capture-Enabled-orange.svg)]()
[![Biometric](https://img.shields.io/badge/Biometric-Selfie%20Capture-purple.svg)]()

> **Codelab Advanced:** Master IDV (Identity Verification) Post-Login KYC workflows with REL-ID SDK

This folder contains the source code for the solution demonstrating [REL-ID IDV Post-Login KYC](https://codelab.uniken.com/codelabs/relid-initialization-flow/index.html?index=..%2F..index#0) using comprehensive identity verification flows including document capture, selfie verification, biometric consent management, and activated customer KYC processes.

## 🔐 What You'll Learn

In this advanced IDV Post-Login KYC codelab, you'll master production-ready identity verification patterns:

- ✅ **IDV Document Capture Integration**: `setIDVDocumentScanProcessStartConfirmation()` API with document scanning workflows
- ✅ **Selfie Capture Management**: `setIDVSelfieProcessStartConfirmation()` API with biometric selfie verification
- ✅ **Document Verification Flow**: Handle `getIDVConfirmDocumentDetails` events for document validation
- ✅ **Biometric Consent Management**: Navigate through `getIDVBiometricOptInConsent` events for template storage
- ✅ **IDV Configuration Control**: `getIDVConfig()` and `setIDVConfig()` APIs for dynamic workflow configuration
- ✅ **🆕 Activated Customer KYC**: `initiateActivatedCustomerKYC()` API for post-login identity verification
- ✅ **🆕 KYC Response Handling**: `onIDVActivatedCustomerKYCResponse` callback with automatic dashboard navigation
- ✅ **Event-Driven IDV Architecture**: Handle complete IDV event chains from document scan to biometric enrollment
- ✅ **Native Camera Integration**: React Native IDV document and selfie capture plugins
- ✅ **Post-Login KYC Workflows**: Complete identity verification for authenticated users

## 🎯 Learning Objectives

By completing this IDV Post-Login KYC codelab, you'll be able to:

1. **Implement IDV document capture workflows** with native camera integration and server validation
2. **Handle IDV selfie capture processes** with biometric verification and liveness detection
3. **Build complete identity verification flows** from document scan to biometric enrollment
4. **🆕 Integrate activated customer KYC** for post-login identity verification scenarios
5. **🆕 Handle KYC response callbacks** with automatic navigation and user feedback
6. **Create seamless KYC user experiences** with real-time feedback and error handling
7. **Design event-driven IDV architecture** with proper SDK event chain management
8. **Integrate IDV functionality** with MFA authentication and post-login verification flows
9. **Configure dynamic IDV workflows** using server-driven configuration management
10. **Debug IDV flows** and troubleshoot document capture and biometric verification issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/rn-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of identity verification workflows and document validation
- Experience with React Native camera integration and native modules
- Knowledge of REL-ID SDK event-driven architecture patterns
- Experience with TypeScript interfaces and complex data structures

## 📁 IDV Post-Login KYC Project Structure

```
relid-IDV-PostLogin-KYC/
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
│           │   │                                # - 🆕 initiateActivatedCustomerKYC()
│           │   └── rdnaEventManager.ts           # Complete event management + IDV handlers
│           │                                    # - getIDVDocumentScanProcessStartConfirmation handler
│           │                                    # - getIDVSelfieProcessStartConfirmation handler
│           │                                    # - getIDVConfirmDocumentDetails handler
│           │                                    # - getIDVSelfieConfirmation handler
│           │                                    # - getIDVBiometricOptInConsent handler
│           │                                    # - 🆕 onIDVActivatedCustomerKYCResponse handler
│           ├── types/           # 📝 Enhanced TypeScript definitions
│           │   ├── rdnaEvents.ts                # Complete event type definitions + IDV types
│           │   │                                # - RDNAGetIDVDocumentScanProcessStartConfirmationData
│           │   │                                # - RDNAGetIDVSelfieProcessStartConfirmationData
│           │   │                                # - RDNAGetIDVConfirmDocumentDetailsData
│           │   │                                # - RDNAGetIDVSelfieConfirmationData
│           │   │                                # - RDNAGetIDVBiometricOptInConsentData
│           │   │                                # - 🆕 RDNAIDVActivatedCustomerKYCResponseData
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
cd relid-IDV-PostLogin-KYC

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
9. ✅ **🆕 Activated customer KYC button** integration in drawer navigation with loading states
10. ✅ **🆕 Post-login KYC initiation** with automatic dashboard navigation after completion

## 🆕 New Features Added

### Enhanced IDV Configuration Management
This implementation includes comprehensive **IDV Configuration Management** functionality:

- **⚙️ Settings Access Button**: Added floating settings button in CheckUserScreen for easy IDV config access
- **📱 IDV Settings Navigation**: Added "IDV Settings" menu item in drawer navigation
- **🔧 Advanced Configuration Screen**: Complete IDVDetailedConfigurations implementation with collapsible sections
- **🎛️ Comprehensive Settings**: 40+ configuration options organized in 4 main sections:
  - **Basic Configuration** (7 options): Version, debug logs, NFC settings, database options
  - **Authenticity Checks** (15 options): Hologram, security text, barcode format, geometry checks, etc.
  - **Image Quality Checks** (10 options): Focus, glare, bounds, colorness, occlusion, etc.
  - **Image Quality Thresholds** (6 options): DPI, angle, brightness thresholds with decimal support

### Activated Customer KYC Integration
This implementation includes the newly integrated **Activated Customer KYC** functionality:

- **📋 DrawerContent Integration**: Added "📋 Activated customer KYC" button in the drawer menu
- **⚡ API Integration**: `initiateActivatedCustomerKYC('Post Login KYC')` API call
- **🔄 Event Handling**: `onIDVActivatedCustomerKYCResponse` callback with automatic navigation
- **✅ Dashboard Navigation**: Automatic navigation to Dashboard after KYC process completion
- **🎯 Loading States**: Visual feedback with loading indicators during KYC initiation
- **💬 User Confirmation**: Confirmation dialog before initiating KYC process
- **🛡️ Error Handling**: Comprehensive error handling for both sync and async responses

### Enhanced User Experience Features
- **🎨 Consistent Header Design**: IDV Settings header matches Dashboard screen design
- **📱 Floating Action Button**: Settings icon in CheckUserScreen bottom-right corner
- **🎛️ Collapsible Sections**: Organized configuration sections with expand/collapse functionality
- **✨ Advanced Input Handling**: Decimal input support with proper validation and normalization
- **📋 Modal Dropdowns**: Custom dropdown implementation for version and language selection

### Key Implementation Files:
- `src/tutorial/screens/idv/IDVConfigSettings.tsx` - Complete IDVDetailedConfigurations implementation
- `src/tutorial/screens/mfa/CheckUserScreen.tsx` - Added floating settings button with navigation
- `src/tutorial/navigation/DrawerNavigator.tsx` - IDV Settings navigation integration
- `src/tutorial/screens/components/DrawerContent.tsx` - Enhanced drawer with IDV Settings menu
- `src/uniken/services/rdnaService.ts` - Enhanced IDV configuration APIs
- `src/uniken/services/rdnaEventManager.ts` - KYC response event handling
- `src/uniken/types/rdnaEvents.ts` - Enhanced event type definitions

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

### 🆕 Checkpoint 6: Advanced IDV Configuration Management
- [ ] I understand the complete IDV configuration structure with nested objects (authenticityChecksConfig, imageQualityChecksConfig, imageQualityThresholds)
- [ ] I can implement collapsible section UI with proper state management and user experience
- [ ] I know how to handle different input types: boolean switches, integer inputs, and decimal inputs with validation
- [ ] I can implement custom modal dropdowns for version and language selection
- [ ] I understand the `idv_sdk_app_config` wrapper structure required by setIDVConfig API
- [ ] I can create floating action buttons with proper Material Design principles and navigation
- [ ] I know how to maintain consistent header design across different screens in the application
- [ ] I can implement advanced form validation for decimal inputs with normalization (e.g., maxGlaringPart: 0.1)

### 🆕 Checkpoint 7: Activated Customer KYC Integration
- [ ] I understand the `initiateActivatedCustomerKYC()` API and its purpose for post-login KYC scenarios
- [ ] I can implement the `onIDVActivatedCustomerKYCResponse` callback with proper event handling
- [ ] I know how to integrate activated customer KYC button in the drawer navigation with loading states
- [ ] I can handle automatic dashboard navigation after KYC process completion
- [ ] I understand the difference between pre-login and post-login KYC workflows
- [ ] I can implement confirmation dialogs and user feedback for KYC initiation processes

### Checkpoint 8: Production IDV KYC Implementation
- [ ] I understand KYC compliance requirements and identity verification standards
- [ ] I can implement comprehensive error handling for document capture, validation, and biometric verification failures
- [ ] I know how to optimize user experience with clear guidance, progress indicators, and retry mechanisms
- [ ] I can handle production deployment considerations for IDV features including certificate management
- [ ] I understand security and privacy requirements for biometric data handling and storage

## 🔄 IDV Post-Login KYC User Flow

### 🆕 Scenario 1: IDV Configuration Management Flow
1. **User on CheckUser screen** → User preparing to set username for SDK session
2. **Settings button visible** → Floating action button (⚙️) in bottom-right corner
3. **User clicks settings button** → Navigation to IDV Detailed Configuration screen
4. **Configuration screen loads** → 4 collapsible sections with current IDV settings loaded via getIDVConfig()
   - **Basic Configuration**: Version, debug logs, NFC settings, timeout values
   - **Authenticity Checks**: 15 document verification options (hologram, security text, etc.)
   - **Image Quality Checks**: 10 image validation options (focus, glare, bounds, etc.)
   - **Image Quality Thresholds**: 6 numeric thresholds with decimal support
5. **User modifies settings** → Toggle switches, adjust numeric values, change version/language
6. **User saves configuration** → `setIDVConfig(idv_sdk_app_config)` called with wrapped configuration
7. **Success confirmation** → "Configuration saved successfully!" alert displayed
8. **Automatic navigation** → User returns to previous screen after successful save

### 🆕 Scenario 2: Alternative IDV Settings Access
1. **User in main application** → User logged in and using drawer navigation
2. **User opens drawer menu** → Drawer displays navigation options
3. **User clicks "⚙️ IDV Settings"** → Direct navigation to IDV Configuration screen
4. **Same configuration flow** → User can modify and save IDV settings
5. **Return to dashboard** → User navigates back to main application flow

### 🆕 Scenario 3: Activated Customer KYC Flow (Post-Login)
1. **User logged in** → User successfully authenticated and reaches dashboard
2. **User opens drawer menu** → Drawer navigation displays available options
3. **User clicks "📋 Activated customer KYC"** → Confirmation dialog appears
4. **User confirms KYC initiation** → "Start activated customer KYC process for post-login identity verification?"
5. **Loading indicator shows** → "🔄 Initiating KYC..." with button disabled
6. **API call initiated** → `initiateActivatedCustomerKYC('Post Login KYC')` called
7. **Sync response received** → API call successful, waiting for async event
8. **KYC response callback** → `onIDVActivatedCustomerKYCResponse` event received
9. **Success/Error message displayed** → Alert shows KYC workflow details or error message
10. **Automatic navigation** → User navigates to Dashboard after clicking "OK" on alert
11. **KYC process continues** → Subsequent IDV flows initiated if needed (document scan, selfie, etc.)

### Scenario 4: Complete IDV KYC Flow (New User Registration)
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

### Scenario 5: IDV Document Capture Only (Post-Login Verification)
1. **Authenticated user** → Post-login IDV verification required (`idvWorkflow = 5`)
2. **Document scan initiated** → `getIDVDocumentScanProcessStartConfirmation` event with workflow 5
3. **Document capture process** → User scans document for additional verification
4. **Document validation** → `getIDVConfirmDocumentDetails` event with validation results
5. **Process completion** → User returns to main application flow

### Scenario 6: Agent KYC Workflow (Customer Onboarding)
1. **Agent initiates customer KYC** → Agent-assisted IDV flow (`idvWorkflow = 13`)
2. **Customer document scan** → Agent helps customer scan identity documents
3. **Agent validation** → Agent reviews and confirms document details
4. **Customer selfie capture** → Agent assists with selfie capture process
5. **KYC completion** → Agent completes customer onboarding process

### Scenario 7: IDV Error Handling and Recovery
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

// 🆕 rdnaService.ts - Activated Customer KYC API
async initiateActivatedCustomerKYC(reason: string): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    console.log('RdnaService - Initiating activated customer KYC with reason:', reason);
    
    RdnaClient.initiateActivatedCustomerKYC(reason, response => {
      console.log('RdnaService - InitiateActivatedCustomerKYC sync callback received');
      const result: RDNASyncResponse = response;
      
      if (result.error && result.error.longErrorCode === 0) {
        console.log('RdnaService - InitiateActivatedCustomerKYC sync response success, waiting for onIDVActivatedCustomerKYCResponse event');
        resolve(result);
      } else {
        console.error('RdnaService - InitiateActivatedCustomerKYC sync response error:', result);
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

// 🆕 DrawerContent.tsx - Activated Customer KYC Event Handler
const handleKYCResponse = (data: RDNAIDVActivatedCustomerKYCResponseData) => {
  console.log('DrawerContent - Received KYC response:', data);
  console.log('DrawerContent - KYC Workflow Type:', data.kycWorkflow?.workflowType);
  
  setIsInitiatingKYC(false);
  
  if (data.error && data.error.longErrorCode === 0) {
    // Success case - following reference implementation pattern
    const workflowInfo = data.kycWorkflow?.workflowType 
      ? `Workflow: ${data.kycWorkflow.workflowType}\nCurrent Step: ${data.kycWorkflow.currentStep}`
      : 'KYC workflow information received';
    
    Alert.alert(
      'KYC Process Started',
      `Activated customer KYC has been initiated successfully.\n\n${workflowInfo}\n\nNavigating to Dashboard...`,
      [{ 
        text: 'OK', 
        onPress: () => props.navigation.navigate('Dashboard')
      }]
    );
  } else {
    // Error case - following reference implementation pattern
    Alert.alert(
      'KYC Process Error', 
      `Failed to start KYC process: ${data.error?.errorString}\n\nNavigating to Dashboard...`,
      [{ 
        text: 'OK', 
        onPress: () => props.navigation.navigate('Dashboard')
      }]
    );
  }
};
```

### 🆕 IDV Configuration Management Implementation
```tsx
// IDVConfigSettings.tsx - Advanced Configuration Screen with Collapsible Sections
class IDVConfigSettings extends Component<any, ConfigState> {
  constructor(props: any) {
    super(props);
    this.state = {
      config: {
        version: "3.0",
        saveDebugLogs: true,
        nfcScanEnabled: true,
        nfcScanTimeOut: 45,
        // 40+ configuration options organized in nested objects
        authenticityChecksConfig: {
          hologram: true,
          securityText: true,
          barcodeFormat: true,
          geometryCheck: true,
          // ... 11 more options
        },
        imageQualityChecksConfig: {
          focus: true,
          glare: true,
          bounds: true,
          // ... 7 more options
        },
        imageQualityThresholds: {
          dpiThreshold: 150,
          angleThreshold: 5,
          maxGlaringPart: 0.1,  // Decimal support
          imgMarginPart: 0.07,  // Decimal support
          // ... 2 more thresholds
        }
      },
      collapsedSections: {
        basicConfig: false,
        authenticityChecks: false,
        imageQualityChecks: false,
        imageQualityThresholds: false
      }
    };
  }

  // Advanced getIDVConfig with nested structure parsing
  getConfig() {
    RdnaService.getIDVConfig()
      .then((response: any) => {
        const config = {
          version: response.version || "3.0",
          saveDebugLogs: response.saveDebugLogs !== undefined ? response.saveDebugLogs : true,
          // Merge server response with default nested structure
          authenticityChecksConfig: {
            hologram: response.authenticityChecksConfig?.hologram !== undefined ? 
              response.authenticityChecksConfig.hologram : true,
            securityText: response.authenticityChecksConfig?.securityText !== undefined ? 
              response.authenticityChecksConfig.securityText : true,
            // ... handle all 15 authenticity check options
          },
          // Handle image quality checks and thresholds...
        };
        this.setState({ config, supportedVersionsData: this.buildVersionsData(config.supportedVersions) });
      });
  }

  // Advanced setIDVConfig with idv_sdk_app_config wrapper
  saveConfiguration() {
    const configToSave = {
      idv_sdk_app_config: this.state.config  // Required wrapper structure
    };
    
    RdnaService.setIDVConfig(JSON.stringify(configToSave))
      .then((result: any) => {
        Alert.alert('Success', 'Configuration saved successfully!', [
          { text: 'OK', onPress: () => this.props.navigation.goBack() }
        ]);
      });
  }

  // Collapsible section header rendering
  renderSectionHeader(title: string, sectionKey: keyof ConfigState['collapsedSections']) {
    const isCollapsed = this.state.collapsedSections[sectionKey];
    return (
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => this.toggleSection(sectionKey)}>
        <View style={styles.sectionHeaderContent}>
          <Text style={styles.sectionHeaderText}>{title}</Text>
          <Text style={styles.chevronIcon}>{isCollapsed ? '▼' : '▲'}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Advanced decimal input handling with validation
  renderNumberField(label: string, section: string | null, key: string, subsection: string | null = null, allowDecimal: boolean = false) {
    return (
      <TextInput
        style={styles.numberInput}
        value={this.getDisplayValue(section, key, subsection, allowDecimal)}
        onChangeText={(text) => this.handleNumberInput(text, section, key, subsection, allowDecimal)}
        onBlur={() => this.normalizeDecimalValue(section, key, subsection, allowDecimal)}
        keyboardType={allowDecimal ? "decimal-pad" : "numeric"}
        returnKeyType="done"
      />
    );
  }
}

// CheckUserScreen.tsx - Floating Settings Button Integration
const CheckUserScreen: React.FC = () => {
  const navigation = useNavigation<CheckUserScreenNavigationProp>();

  const handleSettingsPress = () => {
    navigation.navigate('DrawerNavigator', {
      screen: 'IDVConfigSettings'
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Main content */}
      <KeyboardAvoidingView style={styles.container}>
        {/* Form content */}
      </KeyboardAvoidingView>
      
      {/* Floating Settings Button - Bottom Right */}
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={handleSettingsPress}
        activeOpacity={0.7}>
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  settingsButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  settingsIcon: {
    fontSize: 24,
    color: '#fff',
  },
});
```

### 🆕 Activated Customer KYC UI Implementation
```tsx
// DrawerContent.tsx - Activated Customer KYC Button Integration
const handleActivatedCustomerKYC = () => {
  Alert.alert(
    'Initiate KYC',
    'Start activated customer KYC process for post-login identity verification?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Start KYC', style: 'default', onPress: performActivatedCustomerKYC },
    ]
  );
};

const performActivatedCustomerKYC = async () => {
  setIsInitiatingKYC(true);
  try {
    console.log('DrawerContent - Initiating activated customer KYC for user:', userID);
    
    const syncResponse: RDNASyncResponse = await rdnaService.initiateActivatedCustomerKYC('Post Login KYC');
    console.log('DrawerContent - KYC API call successful, waiting for onIDVActivatedCustomerKYCResponse event');
    
  } catch (error) {
    console.error('DrawerContent - InitiateActivatedCustomerKYC sync error:', error);
    const result: RDNASyncResponse = error as RDNASyncResponse;
    const errorMessage = RDNASyncUtils.getErrorMessage(result);
    Alert.alert('KYC Error', `Failed to initiate KYC process: ${errorMessage}`);
    setIsInitiatingKYC(false);
  }
};

// Button UI with loading state
<TouchableOpacity 
  style={styles.menuItem}
  onPress={handleActivatedCustomerKYC}
  disabled={isInitiatingKYC}
>
  {isInitiatingKYC ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color="#3498db" />
      <Text style={[styles.menuText, styles.loadingText]}>🔄 Initiating KYC...</Text>
    </View>
  ) : (
    <Text style={styles.menuText}>📋 Activated customer KYC</Text>
  )}
</TouchableOpacity>
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

### 🆕 TypeScript Event Interface
```typescript
// rdnaEvents.ts - Activated Customer KYC Response Data Interface
export interface RDNAIDVActivatedCustomerKYCResponseData extends RDNAEvent {
  userID: string;
  kycWorkflow: {
    workflowType: string;
    workflowId: string;
    steps: string[];
    currentStep: string;
    nextStep?: string;
  };
  documentRequirements?: {
    supportedDocumentTypes: string[];
    frontScanRequired: boolean;
    backScanRequired: boolean;
    selfieRequired: boolean;
    livenessCheckRequired: boolean;
  };
  reason: string;
  additionalParameters?: {
    [key: string]: any;
  };
}

// Callback type for event handler
export type RDNAIDVActivatedCustomerKYCResponseCallback = (data: RDNAIDVActivatedCustomerKYCResponseData) => void;
```

---

**🔐 Congratulations! You've mastered IDV Post-Login KYC with REL-ID SDK!**

*You're now equipped to implement comprehensive identity verification workflows including document capture, biometric verification, compliance-ready KYC processes, and **post-login activated customer KYC** functionality. Use this knowledge to create seamless IDV experiences that enhance security while providing excellent user convenience during both pre-login and post-login identity verification scenarios.*

### 🚀 Next Steps
- Explore advanced IDV workflows with multi-document scanning
- Implement agent-assisted KYC processes for customer onboarding
- Add biometric template management and privacy controls
- Integrate custom document types and validation rules
- Implement IDV analytics and compliance reporting
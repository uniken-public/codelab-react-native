# REL-ID React Native Codelab: IDV Additional Document Scan

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![IDV](https://img.shields.io/badge/IDV-Identity%20Verification-blue.svg)]()
[![Document Scan](https://img.shields.io/badge/Document%20Scan-Additional-orange.svg)]()
[![Document Capture](https://img.shields.io/badge/Document%20Capture-Enabled-green.svg)]()

> **Codelab Advanced:** Master IDV Additional Document Scan workflows with REL-ID SDK

This folder contains the source code for implementing [REL-ID IDV Additional Document Scan](https://codelab.uniken.com/codelabs/relid-initialization-flow/index.html?index=..%2F..index#0) using streamlined identity verification flows focused on additional document capture, verification, and confirmation processes.

## 🔐 What You'll Learn

In this advanced IDV Additional Document Scan codelab, you'll master production-ready identity verification patterns:

- ✅ **IDV Additional Document Scan**: `initiateIDVAdditionalDocumentScan()` API for post-login document verification
- ✅ **Document Scan Response Handling**: `onIDVAdditionalDocumentScan` callback with automatic navigation to confirmation screen
 
- ✅ **Document Confirmation UI**: Enhanced document review screen with Accept/Recapture/Close options
- ✅ **Recapture Functionality**: Trigger new document scans via recapture button with `initiateIDVAdditionalDocumentScan()` API
- ✅ **Biometric Consent Management**: Navigate through `getIDVBiometricOptInConsent` events for template storage
- ✅ **IDV Configuration Control**: `getIDVConfig()` and `setIDVConfig()` APIs for dynamic workflow configuration
- ✅ **Enhanced Debugging**: Comprehensive logging throughout the complete callback chain (Native → EventManager → Provider → UI)
- ✅ **Event-Driven IDV Architecture**: Streamlined event handling focused on document scan workflows
- ✅ **Native Camera Integration**: React Native IDV document capture plugin
- ✅ **Dashboard Navigation**: Automatic navigation to dashboard after document confirmation

## 🎯 Learning Objectives

By completing this IDV Additional Document Scan codelab, you'll be able to:

1. **Implement IDV additional document scan workflows** with `initiateIDVAdditionalDocumentScan()` API
2. **Handle document scan callbacks** with `onIDVAdditionalDocumentScan` event and automatic navigation
3. **Build comprehensive document confirmation UI** with Accept/Recapture/Close functionality
4. **Implement recapture functionality** for restarting document scan processes
5. **Create seamless document verification experiences** with real-time feedback and error handling
6. **Design event-driven IDV architecture** with streamlined SDK event chain management
7. **Integrate document scan functionality** with MFA authentication and post-login flows
8. **Configure dynamic IDV workflows** using server-driven configuration management
9. **Debug document scan callback chains** with comprehensive logging from native to UI
10. **Handle document verification edge cases** and troubleshoot capture/validation issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/rn-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of identity verification workflows and document validation
- Experience with React Native camera integration and native modules
- Knowledge of REL-ID SDK event-driven architecture patterns
- Experience with TypeScript interfaces and complex data structures

## 📁 IDV Additional Document Scan Project Structure

```
relid-IDV-AdditionalDocumentScan/
├── 📱 Streamlined React Native MFA + IDV Document Scan App
│   ├── android/                 # Android-specific configuration
│   │   ├── build.gradle                  # IDV plugin configuration
│   │   └── app/src/main/
│   │       ├── assets/Regula/            # IDV assets directory
│   │       │   ├── db.dat                # Regula document recognition database (108MB)
│   │       │   └── certificates/         # ICAO PKD certificates
│   │       │       └── icaopkd-002-complete-000319.ldif
│   │       └── res/raw/                  # Android resources directory
│   │           └── regula.license        # Regula document reader license for Android
│   ├── ios/                     # iOS-specific configuration + Regula certificates
│   │   ├── Certificates.bundle/          # Document verification certificates
│   │   │   └── icaopkd-002-complete-000319.ldif
│   │   ├── db.dat                       # Document recognition database (108MB)
│   │   └── regula.license               # Regula document reader license
│   ├── react-native-rdna-client/        # REL-ID Native Bridge (streamlined)
│   ├── react-native-relid-idv-document-capture/ # IDV Document capture plugin

├── 📦 Streamlined IDV Document Scan Architecture
│   └── src/
│       ├── tutorial/            # MFA + IDV document scan flow
│       │   ├── navigation/      # Navigation with IDV support
│       │   │   ├── AppNavigator.tsx        # Stack navigation + IDV screens
│       │   │   ├── DrawerNavigator.tsx     # Drawer navigation with document scan button
│       │   │   └── NavigationService.ts    # Navigation utilities
│       │   └── screens/         # Focused screens for document scan
│       │       ├── components/  # UI components
│       │       │   ├── Button.tsx                # Enhanced buttons with loading states
│       │       │   ├── Input.tsx                 # Input components
│       │       │   ├── StatusBanner.tsx          # Status displays
│       │       │   └── DrawerContent.tsx         # 🔄 Additional document scan button with enhanced logging
│       │       ├── mfa/         # 🔐 MFA screens (base authentication)
│       │       │   ├── CheckUserScreen.tsx       # User validation
│       │       │   ├── ActivationCodeScreen.tsx  # OTP verification
│       │       │   ├── SetPasswordScreen.tsx     # Password creation
│       │       │   ├── VerifyPasswordScreen.tsx  # Password verification
│       │       │   ├── UserLDAConsentScreen.tsx  # LDA consent (fixed navigation)
│       │       │   ├── VerifyAuthScreen.tsx      # Verify authentication
│       │       │   ├── DashboardScreen.tsx       # Main dashboard
│       │       │   └── index.ts                  # MFA exports
│       │       ├── idv/         # 🔄 IDV Document Scan screens (focused on additional document scan)
│       │       │   ├── IDVBiometricOptInConsentScreen.tsx            # Biometric consent
│       │       │   ├── IDVConfigSettings.tsx                         # IDV configuration
│       │       │   ├── IDVConfirmDocumentDetailsScreen.tsx            # 🔄 Enhanced document confirmation with recapture
│       │       │   ├── IDVDocumentProcessStartConfirmationScreen.tsx  # Document scan initiation
│       │       │   └── index.ts                                      # IDV exports
│       │       ├── notification/ # Notification Management (optional)
│       │       │   ├── GetNotificationsScreen.tsx # Server notification management
│       │       │   └── index.ts                   # Notification exports
│       │       └── tutorial/    # Base tutorial screens
│       └── uniken/              # 🛡️ Streamlined REL-ID Integration
│           ├── providers/       # Event providers
│           │   └── SDKEventProvider.tsx          # 🔄 Enhanced IDV additional document scan event handling
│           ├── services/        # 🔄 Streamlined SDK service layer
│           │   ├── rdnaService.ts                # Essential IDV APIs focused on document scan
│           │   │                                # - setIDVDocumentScanProcessStartConfirmation()
│           │   │                                # - setIDVBiometricOptInConsent()
│           │   │                                # - getIDVConfig() / setIDVConfig()
│           │   │                                # - 🔄 initiateIDVAdditionalDocumentScan() (core API)
│           │   └── rdnaEventManager.ts           # 🔄 Focused event management for document scan
│           │                                    # - getIDVDocumentScanProcessStartConfirmation handler
│           │                                    # - getIDVBiometricOptInConsent handler
│           │                                    # - 🔄 onIDVAdditionalDocumentScan handler (enhanced with debugging)
│           ├── types/           # 📝 Streamlined TypeScript definitions
│           │   ├── rdnaEvents.ts                # Essential event type definitions for document scan
│           │   │                                # - RDNAGetIDVDocumentScanProcessStartConfirmationData
│           │   │                                # - RDNAGetIDVBiometricOptInConsentData
│           │   │                                # - 🔄 RDNAIDVAdditionalDocumentScanData (core type)
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
cd relid-IDV-AdditionalDocumentScan

# Place the required native plugins at root folder of this project:
# - react-native-rdna-client (streamlined)
# - react-native-relid-idv-document-capture

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

Once the app launches, verify these IDV Additional Document Scan capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ **Additional Document Scan Button**: Available in drawer navigation with loading states
3. ✅ **IDV Additional Document Scan API**: `initiateIDVAdditionalDocumentScan()` integration
4. ✅ **Enhanced Callback Handling**: `onIDVAdditionalDocumentScan` with comprehensive debugging logs
5. ✅ **Document Confirmation Screen**: Enhanced UI with Accept/Recapture/Close options
6. ✅ **Recapture Functionality**: Button triggers new document scan process
7. ✅ **Automatic Navigation**: Document confirmation → Dashboard navigation
8. ✅ **Native Document Capture**: Integration with Regula document reader
9. ✅ **Document Validation**: Confirmation workflows with extracted data display
10. ✅ **Enhanced Event Chain**: Complete callback chain debugging (Native → EventManager → Provider → UI)
11. ✅ **Biometric Consent**: Optional template storage consent management
12. ✅ **Dynamic IDV Configuration**: via `getIDVConfig()` and `setIDVConfig()` APIs
13. ✅ **UserLDAConsentScreen Navigation**: Fixed parameter handling and navigation

## 🔄 Key Features Implemented

### IDV Additional Document Scan Integration
This implementation focuses on **IDV Additional Document Scan** functionality:

- **📋 DrawerContent Integration**: Added "📋 Additional Document Scan" button in the drawer menu
- **⚡ Core API Integration**: `initiateIDVAdditionalDocumentScan('Additional Document Verification')` API call
- **🔄 Enhanced Callback Handling**: `onIDVAdditionalDocumentScan` callback with comprehensive debugging logs
- **🎯 Enhanced Event Chain Debugging**: Complete logging from Native → EventManager → Provider → UI
- **📱 Automatic Navigation**: `onIDVAdditionalDocumentScan` → `IDVConfirmDocumentDetailsScreen` navigation
- **✅ Document Confirmation UI**: Enhanced screen with Accept/Recapture/Close options
- **🔄 Recapture Functionality**: Recapture button triggers new `initiateIDVAdditionalDocumentScan()` API call
- **🏠 Dashboard Navigation**: Automatic navigation to Dashboard after document confirmation (Accept/Reject)
- **🎯 Loading States**: Visual feedback with loading indicators during document scan processes
- **🛡️ Error Handling**: Comprehensive error handling for both sync and async responses

### Code Cleanup and Optimization
This implementation includes significant **code cleanup and optimization**:

- **⚡ Streamlined Event Management**: Focused event handlers only for document scan workflows
- **🔧 Fixed Navigation Issues**: Resolved UserLDAConsentScreen parameter handling and navigation
- **📝 Enhanced Type Safety**: Improved TypeScript type handling and response parsing
- **🐛 Compilation Fixes**: Resolved TypeScript compilation errors and type mismatches
- **📊 Focused Architecture**: Streamlined codebase focusing specifically on additional document scan

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
- `src/uniken/services/rdnaEventManager.ts` - IDV additional document scan event handling
- `src/uniken/types/rdnaEvents.ts` - Enhanced event type definitions

## 🎓 Learning Checkpoints

### Checkpoint 1: IDV Document Capture Integration
- [ ] I understand IDV workflow types and their significance (0=activation, 2=device activation, 4=recovery, 5=post-login, 6=KYC, 13=agent KYC)
- [ ] I can implement `setIDVDocumentScanProcessStartConfirmation()` API with proper workflow parameter handling
- [ ] I know how to handle `getIDVDocumentScanProcessStartConfirmation` events and navigate to document scan screens
- [ ] I can integrate native document capture plugins with React Native
- [ ] I understand Regula document reader configuration and certificate management


### Checkpoint 3: Document Verification Flow
- [ ] I can implement document validation screens with extracted information display

### Checkpoint 4: Biometric Consent and Configuration Management
- [ ] I can handle `getIDVBiometricOptInConsent` events for biometric template storage
- [ ] I understand biometric template management and privacy considerations
- [ ] I can implement `setIDVBiometricOptInConsent()` API with user consent handling
- [ ] I know how to use `getIDVConfig()` and `setIDVConfig()` APIs for dynamic workflow configuration
- [ ] I can manage IDV configuration JSON structures for different document types and capture settings

### Checkpoint 5: Complete IDV Event Chain Management
- [ ] I can implement the complete IDV event chain:
  - MFA Authentication → IDV Document Scan → Document Confirmation → Biometric Consent → Login
- [ ] I understand event callback preservation patterns for complex multi-step IDV flows
- [ ] I can debug IDV event chain issues and identify failure points in document processes
- [ ] I know how to handle edge cases like camera permissions, document validation failures, and biometric matching errors
- [ ] I can test IDV flows with various document types

### 🆕 Checkpoint 6: Advanced IDV Configuration Management
- [ ] I understand the complete IDV configuration structure with nested objects (authenticityChecksConfig, imageQualityChecksConfig, imageQualityThresholds)
- [ ] I can implement collapsible section UI with proper state management and user experience
- [ ] I know how to handle different input types: boolean switches, integer inputs, and decimal inputs with validation
- [ ] I can implement custom modal dropdowns for version and language selection
- [ ] I understand the `idv_sdk_app_config` wrapper structure required by setIDVConfig API
- [ ] I can create floating action buttons with proper Material Design principles and navigation
- [ ] I know how to maintain consistent header design across different screens in the application
- [ ] I can implement advanced form validation for decimal inputs with normalization (e.g., maxGlaringPart: 0.1)

 
- [ ] I can implement comprehensive error handling for document capture, validation, and biometric verification failures
- [ ] I know how to optimize user experience with clear guidance, progress indicators, and retry mechanisms
- [ ] I can handle production deployment considerations for IDV features including certificate management
- [ ] I understand security and privacy requirements for biometric data handling and storage

## 🔄 IDV Additional Document Scan User Flow

### Core Scenario: Additional Document Scan Flow (Post-Login)
1. **User authenticated** → User successfully completes MFA flow and reaches Dashboard
2. **User opens drawer menu** → Drawer navigation displays available options
3. **User clicks "📋 Additional Document Scan"** → Triggers `initiateIDVAdditionalDocumentScan('Additional Document Verification')` API
4. **Loading state shows** → "🔄 Initiating Document Scan..." with button disabled during API call
5. **Native document capture** → SDK initiates native camera for document scanning
6. **Document scan completed** → SDK processes scanned document and extracts data
7. **Callback received** → `onIDVAdditionalDocumentScan` callback triggered with scan results
8. **Enhanced logging chain** → 📱 Native → 🔥 EventManager → 🚀 SDKEventProvider → 🎯 DrawerContent
9. **Automatic navigation** → Navigates to `IDVConfirmDocumentDetailsScreen` with scan results
10. **Document review** → User reviews extracted document data and scan results
11. **User action options**:
    - **Accept (OK)**: Confirms document → Navigate to Dashboard
    - **Recapture**: Triggers new scan → `initiateIDVAdditionalDocumentScan('Document Recapture')` → Repeat from step 5
    - **Close**: Returns to previous screen without confirmation
12. **Process completion** → User returns to Dashboard with document verification completed

### Scenario 1: IDV Configuration Management Flow
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

 

 

 

### Scenario 7: IDV Error Handling and Recovery
1. **Document capture failure** → Poor lighting or document not recognized
2. **User guidance provided** → Clear instructions for retaking document photos
3. **Retry mechanism** → User can retry document capture process
6. **Fallback options** → Alternative verification methods if IDV fails

## 📚 Advanced Resources

- **REL-ID IDV Documentation**: [Identity Verification API Guide](https://developer.uniken.com/docs/idv)
- **Document Capture Integration**: [Native Camera Plugin Setup](https://developer.uniken.com/docs/idv-document-capture)
- **React Native Camera**: [Camera Permissions and Integration](https://reactnative.dev/docs/permissions)

## 💡 Pro Tips

### IDV Implementation Best Practices
1. **Configure IDV workflows dynamically** - Use `getIDVConfig()` to retrieve server-side IDV configuration
2. **Handle camera permissions properly** - Ensure camera permissions are requested before IDV processes
3. **Provide clear user guidance** - Display helpful instructions for document positioning
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
19. **Test with relevant IDV workflows** - Ensure proper handling of post-login workflow (5)
20. **Monitor performance metrics** - Track IDV completion times and identify bottlenecks

### Security & Compliance
21. **Follow IDV compliance guidelines** - Ensure IDV implementation meets regulatory requirements
22. **Implement secure document handling** - Never log or expose sensitive document data
23. **Audit IDV usage** - Log IDV attempts and completions for compliance monitoring
24. **Ensure secure transmission** - All IDV communications should use secure channels
25. **Test privacy scenarios** - Verify biometric data handling under various privacy configurations

## 🔗 Key Implementation Files

### 5. Setting Up Additional Document Scan Service Integration
To initiate an additional document scan from your UI (e.g., Drawer button or a screen action), call the service API with a meaningful reason string.

```typescript
// Trigger additional document scan (e.g., from DrawerContent.tsx handler)
await rdnaService.initiateIDVAdditionalDocumentScan('Additional Document Verification');
```

### Core IDV Additional Document Scan API Implementation
```typescript
// 🔄 rdnaService.ts - IDV Additional Document Scan API (Core Implementation)
async initiateIDVAdditionalDocumentScan(reason: string): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    console.log('RdnaService - Initiating IDV additional document scan with reason:', reason);
    
    RdnaClient.initiateIDVAdditionalDocumentScan(reason, response => {
      console.log('RdnaService - InitiateIDVAdditionalDocumentScan sync callback received');
      const result: RDNASyncResponse = (response as any)[0] || response;
      
      if (result.error && result.error.longErrorCode === 0) {
        console.log('RdnaService - InitiateIDVAdditionalDocumentScan sync response success, waiting for onIDVAdditionalDocumentScan event');
        resolve(result);
      } else {
        console.error('RdnaService - InitiateIDVAdditionalDocumentScan sync response error:', result);
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

### IDV Additional Document Scan Event Handling Implementation
```tsx
// 🔄 SDKEventProvider.tsx - Enhanced IDV Additional Document Scan Event Handler
const handleIDVAdditionalDocumentScan = useCallback((data: RDNAIDVAdditionalDocumentScanData) => {
  console.log('🚀 SDKEventProvider - IDV additional document scan response event received');
  console.log('🚀 SDKEventProvider - Full data received:', JSON.stringify(data, null, 2));
  console.log('🚀 SDKEventProvider - Challenge mode:', data?.challengeMode);
  console.log('🚀 SDKEventProvider - Error code:', data?.error?.longErrorCode);
  console.log('🚀 SDKEventProvider - Status code:', data?.challengeResponse?.status?.statusCode);
  console.log('🚀 SDKEventProvider - Document version:', data?.idvResponse?.version);
  console.log('🚀 SDKEventProvider - Document type:', data?.idvResponse?.document_type);
  
  // Check if navigation is ready
  if (!NavigationService.isReady()) {
    console.error('🚀 SDKEventProvider - Navigation not ready for IDV additional document scan');
    return;
  }
  
  try {
    console.log('🚀 SDKEventProvider - Attempting to navigate to IDVConfirmDocumentDetailsScreen');
    
    // Navigate to the IDV document confirmation screen with additional document scan flag
    NavigationService.navigateOrUpdate('IDVConfirmDocumentDetailsScreen', {
      title: 'Confirm Additional Document Details',
      documentDetails: data,
      isAdditionalDocScan: true
    });
    
    console.log('🚀 SDKEventProvider - Successfully initiated navigation to IDVConfirmDocumentDetailsScreen');
    
  } catch (error) {
    console.error('🚀 SDKEventProvider - Failed to navigate to IDVConfirmDocumentDetailsScreen:', error);
  }
}, []);

// 🔄 DrawerContent.tsx - Additional Document Scan Button Handler
const performAdditionalDocumentScan = async () => {
  setIsInitiatingAdditionalDocScan(true);
  try {
    console.log('DrawerContent - Initiating IDV additional document scan for user:', userID);
    
    const syncResponse: RDNASyncResponse = await rdnaService.initiateIDVAdditionalDocumentScan('Additional Document Verification');
    console.log('DrawerContent - InitiateIDVAdditionalDocumentScan sync response successful');
    console.log('DrawerContent - Sync response received:', {
      longErrorCode: syncResponse.error?.longErrorCode,
      shortErrorCode: syncResponse.error?.shortErrorCode,
      errorString: syncResponse.error?.errorString
    });
    
  } catch (error) {
    console.error('DrawerContent - InitiateIDVAdditionalDocumentScan sync error:', error);
    const result: RDNASyncResponse = error as RDNASyncResponse;
    const errorMessage = RDNASyncUtils.getErrorMessage(result);
    Alert.alert('Additional Document Scan Error', `Failed to initiate additional document scan process: ${errorMessage}`);
    setIsInitiatingAdditionalDocScan(false); // Reset loading state on sync error
  }
};

// Button UI with loading state
<TouchableOpacity 
  style={styles.menuItem}
  onPress={performAdditionalDocumentScan}
  disabled={isInitiatingAdditionalDocScan}
>
  {isInitiatingAdditionalDocScan ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color="#3498db" />
      <Text style={[styles.menuText, styles.loadingText]}>🔄 Initiating Document Scan...</Text>
    </View>
  ) : (
    <Text style={styles.menuText}>📋 Additional Document Scan</Text>
  )}
</TouchableOpacity>
```

### 🔄 Enhanced Document Confirmation Screen Implementation
```tsx
// IDVConfirmDocumentDetailsScreen.tsx - Enhanced Document Confirmation with Recapture
const IDVConfirmDocumentDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { title, documentDetails, isAdditionalDocScan } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced confirm handler with dashboard navigation
  const handleConfirm = async (isConfirm: boolean) => {
    try {
      setIsLoading(true);
      console.log('IDVConfirmDocumentDetailsScreen - Confirming document details:', isConfirm);
      
      // Extract challengeMode based on data type
      const challengeMode = (documentDetails as any).challengeMode || 
                           (documentDetails as any).response_data?.challengeMode || 0;
      
 
      console.log('IDVConfirmDocumentDetailsScreen - Document details confirmation sent successfully');
      
      // Navigate to Dashboard screen after successful confirmation
      if (isConfirm) {
        console.log('IDVConfirmDocumentDetailsScreen - Document confirmed, navigating to Dashboard');
        navigation.navigate('DrawerNavigator', { screen: 'Dashboard' });
      } else {
        console.log('IDVConfirmDocumentDetailsScreen - Document rejected, navigating to Dashboard');
        navigation.navigate('DrawerNavigator', { screen: 'Dashboard' });
      }
      
    } catch (error) {
      console.error('IDVConfirmDocumentDetailsScreen - Failed to confirm document details:', error);
      Alert.alert('Error', 'Failed to confirm document details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 New recapture handler - triggers new document scan
  const handleRecapture = async () => {
    try {
      setIsLoading(true);
      console.log('IDVConfirmDocumentDetailsScreen - Initiating recapture for additional document scan');
      
      // Call the initiateIDVAdditionalDocumentScan API to restart the document scan process
      await RdnaService.initiateIDVAdditionalDocumentScan('Document Recapture');
      console.log('IDVConfirmDocumentDetailsScreen - Recapture initiated successfully');
      
    } catch (error) {
      console.error('IDVConfirmDocumentDetailsScreen - Failed to initiate recapture:', error);
      Alert.alert('Error', 'Failed to initiate document recapture. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced UI with three action buttons
  return (
    <View style={styles.buttonContainer}>
      {/* Recapture Button - Triggers new document scan */}
      <TouchableOpacity
        style={[styles.actionButton, styles.recaptureButton]}
        onPress={handleRecapture}
        disabled={isLoading}
      >
        <Text style={styles.recaptureButtonText}>
          {isLoading ? 'Initiating Recapture...' : 'Recapture'}
        </Text>
      </TouchableOpacity>

      {/* Accept/OK Button - Confirms document and navigates to dashboard */}
      <TouchableOpacity
        style={[styles.actionButton, styles.confirmButton]}
        onPress={() => handleConfirm(true)}
        disabled={isLoading}
      >
        <Text style={styles.confirmButtonText}>
          {isLoading ? 'Processing...' : 'Accept'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  recaptureButton: {
    backgroundColor: '#FF9800', // Orange color for recapture action
  },
  recaptureButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### IDV Configuration Management Implementation
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

**🔐 Congratulations! You've mastered IDV Additional Document Scan with REL-ID SDK!**

*You're now equipped to implement streamlined identity verification workflows focusing specifically on **additional document scanning**. This includes enhanced callback chain debugging, recapture functionality, automatic navigation flows, and comprehensive error handling. Use this knowledge to create seamless document verification experiences for post-login identity verification scenarios.*

### 🚀 Key Achievements
- ✅ **Implemented core additional document scan API** with `initiateIDVAdditionalDocumentScan()`
- ✅ **Enhanced callback chain debugging** with comprehensive logging from Native to UI
- ✅ **Built recapture functionality** allowing users to retake document scans
- ✅ **Fixed navigation flows** ensuring smooth user experience
- ✅ **Streamlined codebase** by removing unused KYC and activation APIs
- ✅ **Resolved compilation issues** and improved type safety

### 🚀 Next Steps
- Explore advanced document validation rules and custom thresholds
- Implement multi-document scanning workflows for enhanced verification
- Add custom document types and validation rules
- Integrate additional biometric verification methods
- Implement document scan analytics and success rate monitoring
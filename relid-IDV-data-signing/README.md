# REL-ID React Native Codelab: Cryptographic Data Signing

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-Latest-green.svg)](https://developer.uniken.com/)
[![Data Signing](https://img.shields.io/badge/Data%20Signing-Enabled-orange.svg)]()
[![Biometric Auth](https://img.shields.io/badge/Biometric%20Auth-Level%204-purple.svg)]()
[![Step-up Authentication](https://img.shields.io/badge/Step--up%20Auth-Password%20Challenge-red.svg)]()

> **Codelab Advanced:** Master cryptographic data signing with REL-ID SDK authentication levels

This folder contains the source code for the solution demonstrating [REL-ID Data Signing](https://developer.uniken.com/docs/data-signing) using secure cryptographic authentication with multi-level biometric and password verification.

## 🔐 What You'll Learn

In this advanced data signing codelab, you'll master production-ready cryptographic signing patterns:

- ✅ **Data Signing API Integration**: `authenticateUserAndSignData()` API with authentication level handling
- ✅ **Authentication Level Mastery**: Understanding supported levels (0, 1, 4) and their security implications
- ✅ **Authenticator Type Selection**: NONE and IDV Server Biometric type implementations
- ✅ **Step-Up Authentication Flow**: Password challenges for Level 4 biometric verification
- ✅ **State Management**: `resetAuthenticateUserAndSignDataState()` for proper cleanup
- ✅ **Event-Driven Architecture**: Handle `onAuthenticateUserAndSignData` callbacks
- ✅ **IDV Selfie Process Integration**: `getIDVSelfieProcessStartConfirmation` callback and `setIDVSelfieProcessStartConfirmation` API
- ✅ **Cryptographic Result Handling**: Signature verification and display patterns

## 🎯 Learning Objectives

By completing this Data Signing codelab, you'll be able to:

1. **Implement secure data signing workflows** with proper authentication level selection
2. **Handle multi-level authentication** from basic re-auth to step-up biometric verification
3. **Build cryptographic signing interfaces** with real-time validation and user feedback
4. **Create seamless authentication flows** with password challenges and biometric prompts
5. **Design secure state management** with proper cleanup and reset patterns
6. **Integrate IDV selfie processes** for enhanced identity verification during data signing workflows
7. **Integrate data signing functionality** with existing MFA authentication workflows
8. **Debug authentication flows** and troubleshoot signing-related security issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/rn-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of authentication levels and biometric verification
- Experience with React Native form handling and secure input management
- Knowledge of REL-ID SDK event-driven architecture patterns
- Familiarity with cryptographic concepts and digital signatures
- Basic understanding of authentication state management and cleanup

## 📁 Data Signing Project Structure

```
relid-data-signing/
├── 📱 Enhanced React Native MFA + Data Signing App
│   ├── android/                 # Android-specific configuration
│   ├── ios/                     # iOS-specific configuration
│   └── react-native-rdna-client/ # REL-ID Native Bridge
│
├── 📦 Data Signing Source Architecture
│   └── src/
│       ├── tutorial/            # Data Signing Implementation
│       │   ├── navigation/      # Enhanced navigation with data signing support
│       │   │   ├── AppNavigator.tsx        # Stack navigation + Data Signing screens
│       │   │   ├── DrawerNavigator.tsx     # Drawer navigation
│       │   │   └── NavigationService.ts    # Navigation utilities
│       │   ├── screens/         # Data Signing Screens
│       │   │   ├── components/  # Enhanced UI components
│       │   │   │   ├── Button.tsx                # Loading and disabled states
│       │   │   │   ├── Input.tsx                 # Secure input with validation
│       │   │   │   ├── StatusBanner.tsx          # Success and error displays
│       │   │   │   └── ...                       # Other reusable components
│       │   │   ├── idv/         # 🆕 IDV Screens
│       │   │   │   └── IDVSelfieProcessStartConfirmationScreen.tsx # IDV selfie capture confirmation
│       │   │   └── dataSigning/ # 🔐 Data Signing Flow
│       │   │       ├── DataSigningInputScreen.tsx     # 🆕 Main signing interface
│       │   │       ├── DataSigningResultScreen.tsx    # 🆕 Signature results display
│       │   │       └── components/                     # Signing-specific components
│       │   │           ├── AuthLevelDropdown.tsx           # Authentication level selector
│       │   │           ├── AuthenticatorTypeDropdown.tsx   # Authenticator type selector
│       │   │           └── PasswordChallengeModal.tsx       # Step-up auth modal
│       │   ├── services/        # 🆕 Data Signing Service Layer
│       │   │   ├── DataSigningService.ts             # High-level signing operations
│       │   │   │                                    # - signData() wrapper
│       │   │   │                                    # - submitPassword() for step-up
│       │   │   │                                    # - resetState() cleanup
│       │   │   │                                    # - validateSigningInput()
│       │   │   │                                    # - formatSigningResultForDisplay()
│       │   │   └── DropdownDataService.ts           # Dropdown data management
│       │   │                                       # - getAuthLevelOptions()
│       │   │                                       # - getAuthenticatorTypeOptions()
│       │   │                                       # - convertAuthLevelToEnum()
│       │   │                                       # - convertAuthenticatorTypeToEnum()
│       │   └── types/           # 📝 Data Signing TypeScript definitions
│       │       └── DataSigningTypes.ts              # Complete type definitions
│       │                                           # - DataSigningRequest interface
│       │                                           # - DataSigningResponse interface
│       │                                           # - DataSigningFormState interface
│       │                                           # - PasswordModalState interface
│       └── uniken/              # 🛡️ Enhanced REL-ID Integration
│           ├── providers/       # Enhanced providers
│           │   └── SDKEventProvider.tsx          # Complete data signing event handling
│           │                                    # - onAuthenticateUserAndSignData handler
│           │                                    # - getPasswordStepUpAuthentication handler
│           │                                    # - State management integration
│           ├── services/        # 🆕 Enhanced SDK service layer
│           │   ├── rdnaService.ts                # Added data signing APIs
│           │   │                                # - authenticateUserAndSignData()
│           │   │                                # - resetAuthenticateUserAndSignDataState()
│           │   │                                # - setIDVSelfieProcessStartConfirmation()
│           │   │                                # - setPassword() for step-up
│           │   └── rdnaEventManager.ts           # Complete event management
│           │                                    # - onAuthenticateUserAndSignData handler
│           │                                    # - getIDVSelfieProcessStartConfirmation handler
│           │                                    # - getPasswordStepUpAuthentication handler
│           ├── types/           # 📝 Enhanced TypeScript definitions
│           │   ├── rdnaEvents.ts                # Complete event type definitions
│           │   │                                # - RDNADataSigningResponse
│           │   │                                # - RDNAGetIDVSelfieProcessStartConfirmationData
│           │   │                                # - RDNADataSigningPasswordChallengeData
│           │   │                                # - RDNASyncResponse
│           │   └── index.ts                     # Type exports
│           └── utils/           # Helper utilities
│               ├── connectionProfileParser.ts  # Profile configuration
│               └── progressHelper.ts           # State management helpers
│
└── 📚 Production Configuration
    ├── package.json             # Dependencies
    ├── tsconfig.json
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-data-signing

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

### Verify Data Signing Features

Once the app launches, verify these data signing capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ Data Signing input screen with authentication level selection
3. ✅ `authenticateUserAndSignData()` API integration with proper error handling
4. ✅ Step-up authentication flow with password challenge modal
5. ✅ IDV selfie process integration with `getIDVSelfieProcessStartConfirmation` callback
6. ✅ Cryptographic signature generation and result display
7. ✅ State cleanup via `resetAuthenticateUserAndSignDataState()` API

## 🔑 REL-ID Authentication Level & Type Mapping

### Official REL-ID Data Signing Authentication Mapping

> **⚠️ Critical**: Not all authentication level and type combinations are supported for data signing. Only the combinations listed below are valid - all others will cause SDK errors.

| RDNAAuthLevel | RDNAAuthenticatorType | Supported Authentication | Description |
|---------------|----------------------|-------------------------|-------------|
| `NONE` (0) | `NONE` (0) | No Authentication | No authentication required - **NOT RECOMMENDED for production** |
| `RDNA_AUTH_LEVEL_1` (1) | `NONE` (0) | Device biometric, Device passcode, or Password | Priority: Device biometric → Device passcode → Password |
| `RDNA_AUTH_LEVEL_2` (2) | **NOT SUPPORTED** | ❌ **SDK will error out** | Level 2 is not supported for data signing |
| `RDNA_AUTH_LEVEL_3` (3) | **NOT SUPPORTED** | ❌ **SDK will error out** | Level 3 is not supported for data signing |
| `RDNA_AUTH_LEVEL_4` (4) | `RDNA_IDV_SERVER_BIOMETRIC` (1) | IDV Server Biometric | **Maximum security** - Any other authenticator type will cause SDK error |

> **🎯 Production Recommendation**: Use `RDNA_AUTH_LEVEL_4` with `RDNA_IDV_SERVER_BIOMETRIC` for all production data signing operations requiring maximum security.

### How to Use AuthLevel and AuthenticatorType

REL-ID data signing supports three authentication modes:

#### **1. No Authentication (Level 0)** - Testing Only
```typescript
authLevel: RDNAAuthLevel.NONE,
authenticatorType: RDNAAuthenticatorType.NONE
```
- **Use Case**: Testing environments only
- **Security**: No authentication required
- **⚠️ Warning**: Never use in production applications

#### **2. Re-Authentication (Level 1)** - Standard Documents
```typescript
authLevel: RDNAAuthLevel.RDNA_AUTH_LEVEL_1,
authenticatorType: RDNAAuthenticatorType.NONE
```
- **Use Case**: Standard document signing with flexible authentication
- **Security**: User logs in the same way they logged into the app
- **Authenticator Priority**: Device biometric → Device passcode → Password
- **Behavior**: REL-ID automatically selects best available authenticator

#### **3. Step-up Authentication (Level 4)** - High-Value Transactions
```typescript
authLevel: RDNAAuthLevel.RDNA_AUTH_LEVEL_4,
authenticatorType: RDNAAuthenticatorType.RDNA_IDV_SERVER_BIOMETRIC
```
- **Use Case**: High-value transactions, sensitive documents, compliance requirements
- **Security**: Maximum security with server-side biometric verification
- **Requirement**: Must use `RDNA_IDV_SERVER_BIOMETRIC` - other types will cause errors
- **Behavior**: Forces strong biometric authentication regardless of user's enrolled authenticators

## 🔍 IDV Selfie Process Integration

The REL-ID Data Signing implementation includes comprehensive Identity Verification (IDV) selfie process integration for enhanced security workflows.

### IDV Workflow Support

| Workflow ID | Description | Integration Point |
|-------------|-------------|-------------------|
| 0 | IDV activation process | Initial biometric enrollment during signing |
| 6 | Post-login KYC process | Know Your Customer verification |
| 9 | Step-up authentication | Enhanced security for high-value transactions |
| 10 | Biometric opt-in process | User consent for biometric enrollment |

### Key IDV Components

#### **1. Event Callback - `getIDVSelfieProcessStartConfirmation`**
```typescript
// Automatically triggered by REL-ID SDK during data signing workflows
// that require IDV selfie verification

interface RDNAGetIDVSelfieProcessStartConfirmationData {
  idvWorkflow: number;        // IDV workflow type (0, 6, 9, 10, etc.)
  useDeviceBackCamera?: boolean; // Camera preference from server
  error: RDNAError;           // Standard error information
}

// Event handler automatically navigates to IDVSelfieProcessStartConfirmationScreen
const handleIDVSelfieCallback = (data: RDNAGetIDVSelfieProcessStartConfirmationData) => {
  // Screen automatically appears with workflow-specific guidance
  // User sees appropriate instructions based on idvWorkflow value
};
```

#### **2. API Method - `setIDVSelfieProcessStartConfirmation`**
```typescript
// User decision API for confirming or cancelling IDV selfie process
await RdnaService.setIDVSelfieProcessStartConfirmation(
  isConfirm: boolean,        // true = start capture, false = cancel
  useDeviceBackCamera: boolean, // camera selection
  idvWorkflow: number        // workflow identifier from callback
);
```

#### **3. Screen Component - `IDVSelfieProcessStartConfirmationScreen`**
- **Workflow-specific guidance**: Dynamic instructions based on IDV workflow type
- **Camera selection**: Toggle between front and back camera
- **Confirm/Cancel actions**: User can proceed or cancel the IDV process
- **Error handling**: Comprehensive error display and recovery
- **Loading states**: Visual feedback during API calls

### IDV Integration Flow

1. **Data Signing Initiated** → User starts high-security document signing
2. **IDV Required** → SDK determines IDV selfie verification is needed
3. **Callback Triggered** → `getIDVSelfieProcessStartConfirmation` event fired
4. **Screen Navigation** → Automatic navigation to IDV confirmation screen
5. **User Guidance** → Workflow-specific instructions displayed to user
6. **User Decision** → User confirms or cancels IDV selfie process
7. **API Call** → `setIDVSelfieProcessStartConfirmation` called with decision
8. **Process Continuation** → SDK continues with selfie capture or cancellation

### IDV Security Features

- **Workflow Validation**: Screen validates IDV workflow types before proceeding
- **Camera Privacy**: Clear user guidance about camera usage and biometric capture
- **Error Recovery**: Graceful handling of IDV failures with appropriate user messaging
- **State Cleanup**: Proper cleanup of IDV-related sensitive data after completion
- **Audit Trail**: Comprehensive logging of IDV decisions and outcomes

## 🎓 Learning Checkpoints

### Checkpoint 1: Authentication Level & Type Understanding
- [ ] I understand the 3 supported authentication levels for data signing (0, 1, 4)
- [ ] I know why levels 2 and 3 are NOT SUPPORTED and will cause SDK errors
- [ ] I can correctly pair authentication levels with their required authenticator types
- [ ] I understand the security implications of each authentication level
- [ ] I can choose appropriate levels based on document sensitivity and compliance needs

### Checkpoint 2: Data Signing API Integration
- [ ] I can implement `authenticateUserAndSignData()` API with proper parameter handling
- [ ] I understand the sync response pattern and error handling requirements
- [ ] I know how to handle the `onAuthenticateUserAndSignData` callback event
- [ ] I can implement proper input validation for payload, reason, and authentication parameters
- [ ] I understand the cryptographic signature response format and data structure

### Checkpoint 3: Step-Up Authentication Flow
- [ ] I can handle `getPasswordStepUpAuthentication` events triggered during Level 4 signing
- [ ] I understand when and why password challenges are presented to users
- [ ] I can implement password challenge modals with proper security considerations
- [ ] I know how to handle authentication failures and retry logic during step-up flows
- [ ] I can debug step-up authentication issues and identify failure points

### Checkpoint 4: State Management & Reset Patterns
- [ ] I can implement `resetAuthenticateUserAndSignDataState()` API for proper cleanup
- [ ] I understand when to call reset API (cancellation, errors, completion)
- [ ] I know how to manage form state and modal visibility during signing flows
- [ ] I can handle state transitions between input, authentication, and result screens
- [ ] I can implement proper error recovery with state cleanup and user guidance

### Checkpoint 5: IDV Selfie Process Integration
- [ ] I can implement `getIDVSelfieProcessStartConfirmation` callback handling
- [ ] I understand different IDV workflow types and their use cases
- [ ] I can create workflow-specific user guidance and instructions
- [ ] I know how to implement `setIDVSelfieProcessStartConfirmation` API correctly
- [ ] I can handle camera selection and user preferences securely
- [ ] I understand IDV integration with data signing authentication flows

### Checkpoint 6: Production Security & Error Handling
- [ ] I understand security best practices for data signing implementations
- [ ] I can implement comprehensive error handling for authentication and signing failures
- [ ] I know how to handle unsupported authentication combinations gracefully
- [ ] I can optimize user experience with clear status messaging and loading indicators
- [ ] I understand compliance and audit requirements for cryptographic data signing

## 🔄 Data Signing User Flow

### Scenario 1: Standard Data Signing with Level 1 (Re-Authentication)
1. **User enters DataSigningInputScreen** → Selects Level 1 authentication
2. **User fills payload and reason** → Enters document data and signing purpose
3. **User taps "Sign Data"** → `authenticateUserAndSignData()` API called with Level 1
4. **Authentication prompt appears** → Device biometric/passcode/password (automatic selection)
5. **User completes authentication** → SDK processes biometric/credential verification
6. **Signing completed** → SDK triggers `onAuthenticateUserAndSignData` event
7. **Results displayed** → Navigation to DataSigningResultScreen with signature
8. **User reviews signature** → Cryptographic signature, ID, and metadata displayed
9. **User taps "Sign Another Document"** → `resetAuthenticateUserAndSignDataState()` called
10. **Clean state achieved** → Return to input screen for new signing operation

### Scenario 2: High-Security Signing with Level 4 (Step-up Biometric)
1. **User enters DataSigningInputScreen** → Selects Level 4 authentication
2. **User fills high-value payload** → Enters sensitive document data and compliance reason
3. **User taps "Sign Data"** → `authenticateUserAndSignData()` API called with Level 4 + IDV Server Biometric
4. **Step-up authentication initiated** → SDK triggers `getPasswordStepUpAuthentication` event
5. **Password challenge modal appears** → User prompted for password before biometric
6. **User enters password** → `setPassword()` API called for step-up verification
7. **Biometric prompt triggered** → Server-side biometric authentication required
8. **User completes biometric** → Fingerprint/Face ID verification with maximum security
9. **Signing completed** → SDK triggers `onAuthenticateUserAndSignData` event
10. **Secure results displayed** → High-security signature with audit trail information

### Scenario 3: Password Step-up Challenge During Level 4 Signing
1. **User initiates Level 4 signing** → High-security document signing request
2. **Step-up challenge required** → SDK determines additional authentication needed
3. **Password modal displayed** → User sees authentication options and attempts remaining
4. **User enters correct password** → Password verified for step-up authorization
5. **Biometric authentication proceeds** → Server-side biometric verification initiated
6. **Authentication successful** → Maximum security verification completed
7. **Document signed cryptographically** → Secure signature generation with audit trail
8. **Results with security indicators** → Signature display with security level confirmation

### Scenario 4: Error Handling (Unsupported Combinations, Network Issues)
1. **User selects invalid combination** → e.g., Level 2 or Level 4 with wrong authenticator type
2. **Validation error displayed** → Clear message about unsupported authentication combination
3. **User corrects selection** → Guided to valid Level 1 or Level 4 + IDV Server Biometric
4. **Network error during signing** → Connection failure during authentication or signing
5. **Error dialog with retry option** → User informed of failure with option to retry
6. **State cleanup on error** → `resetAuthenticateUserAndSignDataState()` called automatically
7. **User retry or cancel** → Option to retry with same parameters or cancel operation
8. **Graceful recovery** → Return to clean input state for new attempt

### Scenario 5: IDV Selfie Process Integration (Enhanced Security Verification)
1. **High-security data signing initiated** → User starts signing with IDV-required workflow
2. **IDV selfie process required** → SDK determines additional identity verification needed
3. **Callback event triggered** → `getIDVSelfieProcessStartConfirmation` event fired automatically
4. **IDV screen navigation** → Automatic navigation to selfie confirmation screen
5. **Workflow-specific guidance displayed** → User sees instructions based on IDV workflow type (KYC, step-up auth, etc.)
6. **Camera preference selection** → User can toggle between front and back camera
7. **User confirms IDV process** → User taps "Capture Selfie" to proceed with verification
8. **API call to SDK** → `setIDVSelfieProcessStartConfirmation(true, cameraChoice, workflow)` called
9. **SDK continues IDV flow** → Native selfie capture process initiated by SDK
10. **Data signing completion** → After successful IDV verification, original signing process continues
11. **Results with IDV audit trail** → Signature display includes IDV verification information

### Scenario 6: IDV Selfie Process Cancellation
1. **IDV selfie screen appears** → User sees selfie confirmation screen during signing flow
2. **User reviews IDV requirements** → User reads workflow-specific guidance and privacy information
3. **User chooses to cancel** → User taps "✕" close button or decides not to proceed
4. **Cancellation API called** → `setIDVSelfieProcessStartConfirmation(false, false, workflow)` invoked
5. **SDK handles cancellation** → REL-ID SDK processes the IDV cancellation gracefully
6. **Signing flow terminated** → Original data signing process is cancelled due to IDV requirement
7. **User returned to input** → Clean navigation back to data signing input screen
8. **State cleanup completed** → All IDV and signing state properly cleaned up

## 💡 Pro Tips

### Data Signing Implementation Best Practices
1. **Validate authentication combinations** - Always check Level + Authenticator Type compatibility before API calls
2. **Handle step-up authentication gracefully** - Provide clear user guidance during password challenges
3. **Implement proper state cleanup** - Always call `resetAuthenticateUserAndSignDataState()` on errors/cancellation
4. **Secure sensitive data display** - Never log or expose signing payloads or passwords
5. **Optimize for user experience** - Provide loading states and clear progress indicators
6. **Test all authentication paths** - Verify Level 1 flexible auth and Level 4 step-up flows
7. **Handle network failures** - Implement retry logic and graceful degradation
8. **Follow security guidelines** - Use Level 4 for high-value transactions and compliance scenarios

### Security & Compliance
9. **Audit signing operations** - Log signing attempts and results for security monitoring
10. **Enforce document classification** - Match authentication levels to document sensitivity
11. **Validate signature integrity** - Verify cryptographic signatures before displaying results
12. **Implement rate limiting awareness** - Handle authentication attempt limits gracefully

## 🔗 Key Implementation Files

### Core Data Signing API Implementation
```typescript
// rdnaService.ts - Data Signing API
async authenticateUserAndSignData(
  payload: string,
  authLevel: RDNAAuthLevel,
  authenticatorType: RDNAAuthenticatorType,
  reason: string
): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    RdnaClient.authenticateUserAndSignData(
      payload, authLevel, authenticatorType, reason,
      response => {
        const result: RDNASyncResponse = response;
        if (result.error && result.error.longErrorCode === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      }
    );
  });
}

async resetAuthenticateUserAndSignDataState(): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    RdnaClient.resetAuthenticateUserAndSignDataState(response => {
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

### Authentication Level Selection Logic
```tsx
// DataSigningInputScreen.tsx - Authentication Level Validation
const validateAuthenticationCombination = (
  authLevel: string,
  authenticatorType: string
): boolean => {
  // Only supported combinations for data signing
  const validCombinations = [
    { level: "NONE (0)", type: "NONE (0)" },
    { level: "RDNA_AUTH_LEVEL_1 (1)", type: "NONE (0)" },
    { level: "RDNA_AUTH_LEVEL_4 (4)", type: "RDNA_IDV_SERVER_BIOMETRIC (1)" }
  ];

  return validCombinations.some(combo =>
    combo.level === authLevel && combo.type === authenticatorType
  );
};

const handleSubmit = async () => {
  if (!validateAuthenticationCombination(selectedAuthLevel, selectedAuthenticatorType)) {
    Alert.alert('Invalid Combination', 'This authentication level and type combination is not supported for data signing.');
    return;
  }

  await submitDataSigning();
};
```

### Event Chain Flow Implementation
```typescript
// Event flow: authenticateUserAndSignData() → getPasswordStepUpAuthentication → onAuthenticateUserAndSignData

// 1. Initial data signing call
const handleDataSigning = async () => {
  const request = {
    payload: formState.payload,
    authLevel: convertedAuthLevel,
    authenticatorType: convertedAuthenticatorType,
    reason: formState.reason
  };

  await DataSigningService.signData(request);
  // SDK may trigger getPasswordStepUpAuthentication for Level 4
};

// 2. Handle step-up authentication (Level 4 only)
const handlePasswordChallenge = async (challengeData) => {
  setPasswordModalState({
    isVisible: true,
    challengeMode: challengeData.challengeMode,
    attemptsLeft: challengeData.attemptsLeft
  });
  // User enters password, then setPassword() called
};

// 3. Handle final signing result
const handleSigningResult = (response) => {
  if (response.error.shortErrorCode === 0) {
    // Success: display signature results
    const displayData = DataSigningService.formatSigningResultForDisplay(response);
    setResultDisplay(displayData);
    navigation.navigate('DataSigningResult');
  } else {
    // Error: cleanup and show error
    DataSigningService.resetAuthenticateUserAndSignDataState();
    Alert.alert('Signing Failed', response.error.errorString);
  }
};
```

---

**🔐 Congratulations! You've mastered Cryptographic Data Signing with REL-ID SDK!**

*You're now equipped to implement secure, production-ready data signing workflows with multi-level authentication. Use this knowledge to create robust signing experiences that provide maximum security while maintaining excellent user experience during document authorization and high-value transaction scenarios.*
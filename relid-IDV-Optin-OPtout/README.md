# REL-ID React Native Codelab: IDV Opt-In & Opt-Out Flow

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![IDV](https://img.shields.io/badge/IDV-Identity%20Verification-blue.svg)]()
[![Biometric](https://img.shields.io/badge/Biometric-Opt--In%2FOpt--Out-purple.svg)]()
[![User Preferences](https://img.shields.io/badge/User%20Preferences-Management-orange.svg)]()

> **Codelab Intermediate:** Master IDV (Identity Verification) Opt-In & Opt-Out workflows with REL-ID SDK

This folder contains the source code for the solution demonstrating REL-ID IDV Opt-In & Opt-Out Flow using comprehensive biometric consent management, user preference controls, and dynamic opt-in/opt-out workflows.

## 🔐 What You'll Learn

In this IDV Opt-In & Opt-Out codelab, you'll master biometric consent management workflows:

- ✅ **Biometric Opt-In Workflows**: Handle user consent for biometric template enrollment
- ✅ **Biometric Opt-Out Workflows**: Manage user withdrawal of biometric consent
- ✅ **Selfie Capture Integration**: Implement biometric capture using REL-ID Selfie Capture plugin
- ✅ **Consent State Management**: Track and persist user biometric preferences
- ✅ **User Preference Controls**: Dynamic user settings for biometric features
- ✅ **Event-Driven Architecture**: Handle IDV biometric consent events seamlessly
- ✅ **Privacy-First Design**: Transparent consent management with user control

## 🎯 Learning Objectives

By completing this IDV Opt-In & Opt-Out codelab, you'll be able to:

1. **Implement biometric opt-in consent workflows** with clear user guidance
2. **Handle biometric opt-out processes** allowing users to withdraw consent
3. **Integrate selfie capture functionality** for biometric enrollment
4. **Manage biometric consent state** across app sessions
5. **Design privacy-compliant biometric workflows** with transparent controls
6. **Handle IDV biometric events** including consent requests and status updates
7. **Implement user-friendly biometric enrollment** with retry mechanisms
8. **Build consent management screens** with clear opt-in/opt-out options
9. **Test biometric consent scenarios** including enrollment, withdrawal, and re-enrollment
10. **Create production-ready biometric consent flows** following privacy best practices

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/rn-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of biometric consent management and privacy requirements
- Experience with React Native camera permissions and native modules
- Knowledge of REL-ID SDK event-driven architecture patterns
- Basic understanding of user consent workflows and privacy compliance

## 📁 IDV Opt-In & Opt-Out Project Structure

```
relid-IDV-Optin-Optout/
├── 📱 React Native MFA + IDV Biometric Consent App
│   ├── android/                 # Android-specific configuration
│   ├── ios/                     # iOS-specific configuration
│   ├── react-native-rdna-client/        # REL-ID Native Bridge
│   └── react-native-relid-idv-selfie-capture/   # IDV Selfie capture plugin

├── 📦 IDV Biometric Consent Source Architecture
│   └── src/
│       ├── tutorial/            # MFA + IDV Biometric Consent flow
│       │   ├── navigation/      # Navigation with biometric consent screens
│       │   │   ├── AppNavigator.tsx        # Stack navigation + consent screens
│       │   │   ├── DrawerNavigator.tsx     # Drawer navigation
│       │   │   └── NavigationService.ts    # Navigation utilities
│       │   └── screens/         # Application screens
│       │       ├── components/  # Reusable UI components
│       │       │   ├── Button.tsx                # Interactive buttons
│       │       │   ├── Input.tsx                 # Form input components
│       │       │   ├── StatusBanner.tsx          # Status displays
│       │       │   └── DrawerContent.tsx         # Drawer menu content
│       │       ├── mfa/         # 🔐 MFA screens (base authentication)
│       │       │   ├── CheckUserScreen.tsx       # User validation
│       │       │   ├── ActivationCodeScreen.tsx  # OTP verification
│       │       │   ├── SetPasswordScreen.tsx     # Password creation
│       │       │   ├── VerifyPasswordScreen.tsx  # Password verification
│       │       │   ├── UserLDAConsentScreen.tsx  # LDA consent
│       │       │   ├── VerifyAuthScreen.tsx      # Authentication verification
│       │       │   ├── DashboardScreen.tsx       # Main dashboard
│       │       │   └── index.ts                  # MFA exports
│       │       ├── idv/         # 🔐 IDV Biometric Consent screens
│       │       │   ├── BiometricOptInScreen.tsx           # Biometric opt-in interface
│       │       │   ├── IDVBiometricOptInConsentScreen.tsx # Consent management
│       │       │   ├── IDVSelfieProcessStartConfirmationScreen.tsx # Selfie capture initiation
│       │       │   ├── IDVOptInCapturedFrameConfirmationScreen.tsx # Frame confirmation
│       │       │   └── index.ts                           # IDV exports
│       │       ├── notification/ # Notification Management
│       │       │   ├── GetNotificationsScreen.tsx # Notification handling
│       │       │   └── index.ts                   # Notification exports
│       │       └── tutorial/    # Base tutorial screens
│       │           ├── TutorialHomeScreen.tsx    # App home screen
│       │           ├── TutorialSuccessScreen.tsx # Success states
│       │           ├── TutorialErrorScreen.tsx   # Error handling
│       │           ├── SecurityExitScreen.tsx    # Security exit
│       │           └── index.ts                  # Tutorial exports
│       └── uniken/              # 🛡️ REL-ID SDK Integration
│           ├── providers/       # Context providers
│           │   └── SDKEventProvider.tsx          # Event handling + biometric consent events
│           ├── services/        # SDK service layer
│           │   ├── rdnaService.ts                # Core SDK APIs including:
│           │   │                                # - setBiometricOptInStatus()
│           │   │                                # - setBiometricOptOutStatus()
│           │   │                                # - setIDVSelfieProcessStartConfirmation()
│           │   │                                # - setUserPreferences()
│           │   └── rdnaEventManager.ts           # Event management including:
│           │                                    # - getBiometricOptInStatus handler
│           │                                    # - getBiometricOptOutStatus handler
│           │                                    # - getIDVSelfieProcessStartConfirmation handler
│           │                                    # - getBiometricOptInConsent handler
│           ├── types/           # 📝 TypeScript definitions
│           │   ├── rdnaEvents.ts                # Event type definitions including:
│           │   │                                # - RDNAIDVBiometricOptInStatusData
│           │   │                                # - RDNAIDVBiometricOptOutStatusData
│           │   │                                # - RDNAGetIDVSelfieProcessStartConfirmationData
│           │   │                                # - RDNAGetIDVBiometricOptInConsentData
│           │   └── index.ts                     # Type exports
│           ├── contexts/        # React contexts
│           │   ├── MTDThreatContext.tsx         # Mobile threat detection
│           │   └── SessionContext.tsx           # Session management
│           └── utils/           # Helper utilities
│               ├── connectionProfileParser.ts  # Profile configuration
│               ├── passwordPolicyUtils.ts      # Password validation
│               └── progressHelper.ts           # Progress tracking

└── 📚 Configuration Files
    ├── package.json             # Dependencies with selfie capture plugin
    ├── tsconfig.json           # TypeScript configuration
    ├── react-native.config.js   # Plugin configuration
    ├── babel.config.js          # Babel configuration
    └── metro.config.js          # Metro bundler configuration
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-IDV-Optin-OPtout

# Place the required native plugins at root folder of this project:
# - react-native-rdna-client
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

### IDV Biometric Consent Configuration

The project includes pre-configured biometric consent dependencies:

#### Selfie Capture Plugin:
- **Native Integration**: REL-ID Selfie Capture plugin for biometric enrollment
- **Camera Permissions**: Required camera permissions for biometric capture
- **Biometric Processing**: Native biometric verification and liveness detection

#### Required Permissions:

##### Android (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

##### iOS (`ios/relidCodelab/Info.plist`):
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access for biometric enrollment and verification</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for biometric liveness detection</string>
```

### Verify Biometric Consent Features

Once the app launches, verify these biometric consent capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ **Biometric opt-in workflow**: User can enroll for biometric authentication
3. ✅ **Biometric opt-out workflow**: User can withdraw biometric consent
4. ✅ **Selfie capture integration**: Native selfie capture with liveness detection
5. ✅ **Consent state management**: Persistent tracking of user biometric preferences
6. ✅ **Privacy-compliant workflows**: Clear consent mechanisms with user control
7. ✅ **Event-driven architecture**: Seamless handling of biometric consent events
8. ✅ **User preference controls**: Dynamic settings for biometric features
9. ✅ **Retry mechanisms**: User-friendly error handling and retry options
10. ✅ **Production-ready flows**: Comprehensive biometric consent management

## 🆕 Key Features Implemented

### Biometric Opt-In Workflow
This implementation includes comprehensive **Biometric Opt-In** functionality:

- **📱 Opt-In Screen Interface**: User-friendly biometric enrollment screen with clear guidance
- **📸 Selfie Capture Integration**: Native selfie capture with liveness detection
- **✅ Consent Management**: Clear opt-in consent flow with privacy explanations
- **🔄 Event-Driven Flow**: Seamless handling of biometric opt-in events
- **💾 State Persistence**: Persistent tracking of user biometric consent status
- **🔒 Privacy Controls**: Transparent consent mechanisms with user control

### Biometric Opt-Out Workflow
This implementation includes **Biometric Opt-Out** functionality:

- **🚪 Opt-Out Process**: User can withdraw biometric consent at any time
- **⚠️ Clear Warnings**: Informative dialogs explaining opt-out implications
- **🔄 State Management**: Proper handling of biometric consent withdrawal
- **📋 Confirmation Steps**: Multi-step confirmation to prevent accidental opt-out
- **🛡️ Data Protection**: Secure handling of biometric template removal

### Enhanced User Experience Features
- **🎨 Intuitive UI Design**: Clean, modern interface following platform guidelines
- **📱 Responsive Layouts**: Optimized for various screen sizes and orientations
- **🔄 Loading States**: Visual feedback during biometric processing
- **⚡ Error Handling**: Comprehensive error messages with retry options
- **📋 Status Indicators**: Clear visual indicators for consent status

### Key Implementation Files:
- `src/tutorial/screens/idv/BiometricOptInScreen.tsx` - Main biometric opt-in interface
- `src/tutorial/screens/idv/IDVBiometricOptInConsentScreen.tsx` - Consent management screen
- `src/tutorial/screens/idv/IDVSelfieProcessStartConfirmationScreen.tsx` - Selfie capture initiation
- `src/tutorial/screens/idv/IDVOptInCapturedFrameConfirmationScreen.tsx` - Frame confirmation
- `src/uniken/services/rdnaService.ts` - Biometric consent APIs
- `src/uniken/services/rdnaEventManager.ts` - Event handling for consent workflows
- `src/uniken/types/rdnaEvents.ts` - Type definitions for biometric consent events

## 🎓 Learning Checkpoints

### Checkpoint 1: Biometric Opt-In Workflow Implementation
- [ ] I understand biometric consent management and its importance for user privacy
- [ ] I can implement `getBiometricOptInStatus` event handlers for consent initiation
- [ ] I know how to handle `setBiometricOptInStatus()` API for user opt-in responses
- [ ] I can integrate native selfie capture plugins with React Native
- [ ] I understand camera permissions and privacy requirements for biometric capture

### Checkpoint 2: Selfie Capture Integration
- [ ] I understand `getIDVSelfieProcessStartConfirmation` events for selfie capture initiation
- [ ] I can implement `setIDVSelfieProcessStartConfirmation()` API with proper parameters
- [ ] I know how to handle selfie capture success and failure scenarios
- [ ] I can implement biometric liveness detection workflows
- [ ] I understand biometric template creation and storage consent

### Checkpoint 3: Biometric Opt-Out Workflow Management
- [ ] I can handle `getBiometricOptOutStatus` events for consent withdrawal
- [ ] I understand biometric template removal and data protection requirements
- [ ] I can implement `setBiometricOptOutStatus()` API for user opt-out responses
- [ ] I know how to provide clear warnings about opt-out implications
- [ ] I can implement multi-step confirmation processes for consent withdrawal

### Checkpoint 4: Consent State Management and Persistence
- [ ] I can track biometric consent status across app sessions
- [ ] I understand persistent storage of user consent preferences
- [ ] I know how to handle consent state changes and notifications
- [ ] I can implement user preference management for biometric features
- [ ] I understand consent lifecycle management and compliance requirements

### Checkpoint 5: Event-Driven Biometric Consent Architecture
- [ ] I can handle `getIDVBiometricOptInConsent` events for template storage consent
- [ ] I understand event-driven architecture patterns for consent workflows
- [ ] I can implement proper error handling for biometric consent events
- [ ] I know how to navigate between consent screens based on user actions
- [ ] I can manage complex consent workflows with multiple decision points

### Checkpoint 6: Privacy and User Experience
- [ ] I understand privacy-first design principles for biometric consent
- [ ] I can implement transparent consent mechanisms with clear user control
- [ ] I know how to provide informative explanations about biometric processing
- [ ] I can design user-friendly consent interfaces with clear opt-in/opt-out options
- [ ] I understand regulatory compliance requirements for biometric data handling

### Checkpoint 7: Production Biometric Consent Implementation
- [ ] I can implement comprehensive error handling for biometric consent failures
- [ ] I know how to optimize user experience with clear guidance and feedback
- [ ] I can handle production deployment considerations for biometric features
- [ ] I understand security requirements for biometric consent data
- [ ] I can implement retry mechanisms and fallback options for consent workflows

## 🔄 IDV Biometric Opt-In & Opt-Out User Flows

### Scenario 1: Biometric Opt-In Flow (First Time User)
1. **User completes MFA authentication** → User successfully authenticated and reaches dashboard
2. **SDK triggers biometric opt-in event** → `getBiometricOptInStatus` event received
3. **Navigation to opt-in screen** → User navigated to BiometricOptInScreen
4. **User reviews opt-in information** → Clear explanation of biometric enrollment benefits
5. **User chooses to opt-in** → User clicks "Enable Biometric Authentication"
6. **Selfie capture preparation** → SDK triggers `getIDVSelfieProcessStartConfirmation` event
7. **User confirms selfie capture** → Navigation to IDVSelfieProcessStartConfirmationScreen
8. **Selfie capture initiated** → `setIDVSelfieProcessStartConfirmation(true, useBackCamera, idvWorkflow)` called
9. **Native selfie capture** → User captures selfie with liveness detection
10. **Frame confirmation** → Navigation to IDVOptInCapturedFrameConfirmationScreen
11. **User approves captured frame** → User reviews and approves biometric capture
12. **Biometric consent request** → SDK triggers `getIDVBiometricOptInConsent` event
13. **User provides final consent** → Navigation to IDVBiometricOptInConsentScreen
14. **Biometric template storage** → `setIDVBiometricOptInConsent(true, challengeMode)` called
15. **Opt-in successful** → `setBiometricOptInStatus(true)` called, user returned to dashboard
16. **Biometric authentication enabled** → User can now use biometric authentication

### Scenario 2: Biometric Opt-Out Flow (Existing Biometric User)
1. **User accesses settings** → User navigates to biometric settings or preferences
2. **SDK triggers biometric opt-out event** → `getBiometricOptOutStatus` event received
3. **Navigation to opt-out screen** → User presented with opt-out options
4. **User reviews opt-out implications** → Clear warnings about disabling biometric authentication
5. **User confirms opt-out intent** → User clicks "Disable Biometric Authentication"
6. **Confirmation dialog** → "Are you sure you want to disable biometric authentication?"
7. **User confirms withdrawal** → User confirms consent withdrawal
8. **Biometric template removal** → `setBiometricOptOutStatus(true)` called
9. **Opt-out successful** → User biometric templates removed, consent withdrawn
10. **Return to standard authentication** → User must use standard MFA methods
11. **Success notification** → User notified that biometric authentication has been disabled

### Scenario 3: Re-Enrollment Flow (User Wants to Re-Enable Biometrics)
1. **User previously opted out** → User had biometric authentication disabled
2. **User decides to re-enable** → User accesses biometric settings again
3. **SDK triggers opt-in event** → `getBiometricOptInStatus` event received (fresh enrollment)
4. **Fresh enrollment process** → Complete opt-in flow as if first-time user
5. **New template creation** → New biometric templates created and stored
6. **Re-enrollment complete** → User can again use biometric authentication

### Scenario 4: Consent State Management
1. **App launch** → Application checks stored biometric consent status
2. **Consent state loaded** → User preferences and consent history retrieved
3. **UI state updated** → Biometric options enabled/disabled based on consent status
4. **Persistent across sessions** → Consent state maintained across app restarts
5. **Compliance tracking** → Audit trail maintained for consent changes

### Scenario 5: Error Handling and Recovery
1. **Selfie capture failure** → Poor lighting, face not detected, or liveness check failure
2. **User guidance provided** → Clear instructions for improving capture conditions
3. **Retry mechanism** → User can retry selfie capture with improved positioning
4. **Multiple failure recovery** → After multiple failures, user provided alternative options
5. **Fallback to standard authentication** → User can continue without biometric enrollment
6. **Error tracking** → Failed attempts logged for troubleshooting and improvement

## 📚 Advanced Resources

- **REL-ID IDV Documentation**: [Identity Verification API Guide](https://developer.uniken.com/docs/idv)
- **Biometric Consent Management**: [Privacy and Consent Best Practices](https://developer.uniken.com/docs/biometric-consent)
- **Selfie Capture Integration**: [REL-ID Selfie Capture Plugin](https://developer.uniken.com/docs/idv-selfie-capture)
- **React Native Camera**: [Camera Permissions and Integration](https://reactnative.dev/docs/permissions)
- **Privacy Compliance**: [Biometric Data Handling Guidelines](https://developer.uniken.com/docs/privacy-compliance)

## 💡 Pro Tips

### Biometric Consent Implementation Best Practices
1. **Handle camera permissions properly** - Request camera permissions before biometric capture processes
2. **Provide clear consent information** - Display transparent explanations about biometric data usage
3. **Implement proper error handling** - Handle selfie capture failures and liveness detection errors gracefully
4. **Optimize user experience** - Minimize steps and provide real-time feedback during biometric capture
5. **Secure biometric data handling** - Follow privacy best practices for biometric template storage and processing
6. **Monitor consent success rates** - Track biometric enrollment and consent completion rates
7. **Handle edge cases thoroughly** - Network failures, camera issues, poor lighting conditions
8. **Test across different devices** - Ensure biometric capture works consistently across various mobile devices
9. **Implement consent state persistence** - Maintain user consent preferences across app sessions
10. **Design privacy-first workflows** - Always prioritize user privacy and transparent consent mechanisms

### User Experience & Interface Design
11. **Clear opt-in/opt-out options** - Provide obvious and accessible biometric consent controls
12. **Informative consent screens** - Explain benefits and implications of biometric enrollment
13. **Visual feedback during capture** - Show real-time guidance for optimal selfie positioning
14. **Progressive consent flow** - Break consent process into manageable, understandable steps
15. **Accessible design patterns** - Ensure biometric consent interfaces work for all users

### Integration & Development
16. **Preserve existing MFA flows** - Biometric consent should enhance, not disrupt authentication
17. **Use proper TypeScript types** - Leverage biometric consent event types for type safety
18. **Implement comprehensive logging** - Log consent flow progress without exposing sensitive data
19. **Test consent state changes** - Verify proper handling of opt-in, opt-out, and re-enrollment scenarios
20. **Monitor performance metrics** - Track consent completion times and identify bottlenecks

### Privacy & Compliance
21. **Follow privacy regulations** - Ensure biometric consent implementation meets GDPR, CCPA, and other requirements
22. **Implement secure consent handling** - Never log or expose biometric consent details
23. **Audit consent activities** - Log consent changes and withdrawals for compliance monitoring
24. **Ensure secure transmission** - All biometric consent communications should use secure channels
25. **Test privacy scenarios** - Verify biometric data handling under various privacy configurations
26. **Document consent processes** - Maintain clear documentation of consent workflows for auditing
27. **Implement consent withdrawal** - Provide easy mechanisms for users to withdraw biometric consent
28. **Regular compliance reviews** - Periodically review consent processes against evolving privacy regulations

## 🔗 Key Implementation Files

### Core Biometric Consent API Implementation
```typescript
// rdnaService.ts - Biometric Opt-In API
async setBiometricOptInStatus(optInStatus: boolean): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    console.log('RdnaService - Setting biometric opt-in status:', optInStatus);
    
    RdnaClient.setBiometricOptInStatus(optInStatus, response => {
      const result: RDNASyncResponse = response;
      if (result.error && result.error.longErrorCode === 0) {
        console.log('RdnaService - Biometric opt-in status set successfully');
        resolve(result);
      } else {
        console.error('RdnaService - Failed to set biometric opt-in status:', result);
        reject(result);
      }
    });
  });
}

// rdnaService.ts - Biometric Opt-Out API
async setBiometricOptOutStatus(optOutStatus: boolean): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    console.log('RdnaService - Setting biometric opt-out status:', optOutStatus);
    
    RdnaClient.setBiometricOptOutStatus(optOutStatus, response => {
      const result: RDNASyncResponse = response;
      if (result.error && result.error.longErrorCode === 0) {
        console.log('RdnaService - Biometric opt-out status set successfully');
        resolve(result);
      } else {
        console.error('RdnaService - Failed to set biometric opt-out status:', result);
        reject(result);
      }
    });
  });
}

// rdnaService.ts - Selfie Capture Process API
async setIDVSelfieProcessStartConfirmation(isConfirm: boolean, useBackCamera: boolean, idvWorkflow: number): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    console.log('RdnaService - Starting selfie capture process:', { isConfirm, useBackCamera, idvWorkflow });
    
    RdnaClient.setIDVSelfieProcessStartConfirmation(isConfirm, useBackCamera, idvWorkflow, response => {
      const result: RDNASyncResponse = response;
      if (result.error && result.error.longErrorCode === 0) {
        console.log('RdnaService - Selfie capture process started successfully');
        resolve(result);
      } else {
        console.error('RdnaService - Failed to start selfie capture process:', result);
        reject(result);
      }
    });
  });
}
```

### Biometric Consent Event Handling Implementation
```tsx
// SDKEventProvider.tsx - Biometric Opt-In Event Handler
const handleGetBiometricOptInStatus = useCallback(async (data: RDNAIDVBiometricOptInStatusData) => {
  console.log('Biometric opt-in event received for user:', data.userID);
  console.log('Challenge mode:', data.challengeMode);
  
  try {
    // Navigate to biometric opt-in screen
    NavigationService.navigateOrUpdate('BiometricOptInScreen', {
      eventName: 'getBiometricOptInStatus',
      eventData: data,
      title: 'Enable Biometric Authentication',
      subtitle: `Set up biometric authentication for user: ${data.userID}`,
      challengeMode: data.challengeMode,
    });
  } catch (error) {
    console.error('Failed to navigate to biometric opt-in screen:', error);
  }
}, []);

// SDKEventProvider.tsx - Biometric Opt-Out Event Handler
const handleGetBiometricOptOutStatus = useCallback(async (data: RDNAIDVBiometricOptOutStatusData) => {
  console.log('Biometric opt-out event received for user:', data.userID);
  console.log('Challenge mode:', data.challengeMode);
  
  try {
    // Navigate to biometric opt-out screen
    NavigationService.navigateOrUpdate('BiometricOptOutScreen', {
      eventName: 'getBiometricOptOutStatus',
      eventData: data,
      title: 'Disable Biometric Authentication',
      subtitle: `Withdraw biometric consent for user: ${data.userID}`,
      challengeMode: data.challengeMode,
    });
  } catch (error) {
    console.error('Failed to navigate to biometric opt-out screen:', error);
  }
}, []);

// SDKEventProvider.tsx - Selfie Capture Event Handler
const handleGetIDVSelfieProcessStartConfirmation = useCallback(async (data: RDNAGetIDVSelfieProcessStartConfirmationData) => {
  console.log('Selfie capture event received for user:', data.userID);
  console.log('IDV workflow:', data.idvWorkflow);
  
  try {
    // Navigate to selfie capture confirmation screen
    NavigationService.navigateOrUpdate('IDVSelfieProcessStartConfirmationScreen', {
      eventName: 'getIDVSelfieProcessStartConfirmation',
      eventData: data,
      title: 'Biometric Capture',
      subtitle: `Capture your selfie for biometric enrollment: ${data.userID}`,
      idvWorkflow: data.idvWorkflow,
    });
  } catch (error) {
    console.error('Failed to navigate to selfie capture screen:', error);
  }
}, []);
```

### Biometric Consent Screen Implementation
```tsx
// BiometricOptInScreen.tsx - Biometric Opt-In Interface
const BiometricOptInScreen: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const route = useRoute<BiometricOptInScreenRouteProp>();
  const navigation = useNavigation();
  
  const handleOptIn = async () => {
    try {
      setIsProcessing(true);
      console.log('User opted in for biometric authentication');
      
      // Call API to set biometric opt-in status
      const response = await RdnaService.setBiometricOptInStatus(true);
      console.log('Biometric opt-in successful:', response);
      
      // Navigate to dashboard or next screen
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Failed to opt in for biometric authentication:', error);
      Alert.alert('Error', 'Failed to enable biometric authentication');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptOut = async () => {
    try {
      setIsProcessing(true);
      console.log('User opted out of biometric authentication');
      
      // Call API to set biometric opt-in status as false
      const response = await RdnaService.setBiometricOptInStatus(false);
      console.log('Biometric opt-out successful:', response);
      
      // Navigate to dashboard
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Failed to opt out of biometric authentication:', error);
      Alert.alert('Error', 'Failed to disable biometric authentication');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Enable Biometric Authentication</Text>
        <Text style={styles.subtitle}>
          Enhance your account security by enabling biometric authentication. 
          This allows you to securely access your account using your face.
        </Text>
        
        {capturedImage && (
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        )}
        
        <View style={styles.benefitsList}>
          <Text style={styles.benefitsTitle}>Benefits:</Text>
          <Text style={styles.benefitItem}>• Faster and more secure login</Text>
          <Text style={styles.benefitItem}>• Enhanced account protection</Text>
          <Text style={styles.benefitItem}>• Convenient authentication</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Enable Biometric Authentication"
            onPress={handleOptIn}
            loading={isProcessing}
            style={styles.optInButton}
          />
          
          <Button
            title="Not Now"
            onPress={handleOptOut}
            loading={isProcessing}
            style={styles.optOutButton}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
```

### Biometric Consent Management Implementation
```tsx
// IDVBiometricOptInConsentScreen.tsx - Consent Management Screen
const IDVBiometricOptInConsentScreen: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const route = useRoute<IDVBiometricOptInConsentScreenRouteProp>();
  const navigation = useNavigation();
  
  const handleConsentConfirmation = async () => {
    if (!consentGiven) {
      Alert.alert('Consent Required', 'Please provide your consent to proceed with biometric enrollment');
      return;
    }
    
    try {
      setIsProcessing(true);
      console.log('User provided biometric consent');
      
      const challengeMode = route.params?.challengeMode || 0;
      
      // Call API to set biometric consent
      const response = await RdnaService.setIDVBiometricOptInConsent(true, challengeMode);
      console.log('Biometric consent set successfully:', response);
      
      // Navigate back to dashboard
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Failed to set biometric consent:', error);
      Alert.alert('Error', 'Failed to save biometric consent');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Biometric Data Consent</Text>
        
        <View style={styles.consentContent}>
          <Text style={styles.consentText}>
            By proceeding, you consent to the collection, storage, and processing of your biometric data 
            for authentication purposes. Your biometric template will be securely stored and used only 
            for account verification.
          </Text>
          
          <View style={styles.privacyInfo}>
            <Text style={styles.privacyTitle}>Privacy Information:</Text>
            <Text style={styles.privacyItem}>• Your biometric data is encrypted and stored securely</Text>
            <Text style={styles.privacyItem}>• Data is used only for authentication purposes</Text>
            <Text style={styles.privacyItem}>• You can withdraw consent at any time</Text>
            <Text style={styles.privacyItem}>• Data will be deleted upon consent withdrawal</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setConsentGiven(!consentGiven)}
          >
            <View style={[styles.checkbox, consentGiven && styles.checkboxChecked]}>
              {consentGiven && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              I consent to the collection and processing of my biometric data
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Confirm Consent"
            onPress={handleConsentConfirmation}
            loading={isProcessing}
            disabled={!consentGiven}
            style={[styles.confirmButton, !consentGiven && styles.disabledButton]}
          />
          
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
```

---

**🔐 Congratulations! You've mastered IDV Biometric Opt-In & Opt-Out workflows with REL-ID SDK!**

*You're now equipped to implement comprehensive biometric consent management including opt-in workflows, opt-out processes, selfie capture integration, and privacy-compliant biometric authentication. Use this knowledge to create transparent and user-friendly biometric consent experiences that prioritize user privacy while enhancing security.*

### 🚀 Next Steps
- Explore advanced biometric workflows with multi-factor authentication
- Implement custom biometric consent UI with brand-specific designs
- Add biometric analytics and consent tracking
- Integrate with compliance frameworks (GDPR, CCPA, etc.)
- Implement biometric fallback and recovery mechanisms
- Add biometric preference management and user controls
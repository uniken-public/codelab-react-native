# REL-ID React Native Codelab: Device Management

[![React Native](https://img.shields.io/badge/React%20Native-0.73%2B-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-Latest-green.svg)](https://developer.uniken.com/)
[![Device Management](https://img.shields.io/badge/Device%20Management-Enabled-orange.svg)]()
[![Real-time Sync](https://img.shields.io/badge/Real--time%20Sync-Pull%20to%20Refresh-purple.svg)]()
[![Cooling Period](https://img.shields.io/badge/Cooling%20Period-Server%20Enforced-red.svg)]()

> **Codelab Advanced:** Master multi-device management with REL-ID SDK server synchronization and cooling period enforcement

This folder contains the source code for the solution demonstrating [REL-ID Device Management](https://codelab.uniken.com/codelabs/rn-device-management-flow/index.html?index=..%2F..index#0) with comprehensive device lifecycle management, real-time synchronization, and server-enforced cooling periods.

## 🔐 What You'll Learn

In this advanced device management codelab, you'll master production-ready device management patterns:

- ✅ **Device Listing API**: `getRegisteredDeviceDetails()` with cooling period detection
- ✅ **Device Update Operations**: Rename and delete with `updateDeviceDetails()` API
- ✅ **Cooling Period Management**: Server-enforced cooling periods between operations
- ✅ **Current Device Protection**: Preventing accidental deletion of active device
- ✅ **Sync+Async Pattern**: Understanding two-phase response architecture
- ✅ **Event-Driven Architecture**: Handle `onGetRegistredDeviceDetails` and `onUpdateDeviceDetails` callbacks
- ✅ **Three-Layer Error Handling**: API errors, status codes, and promise rejections
- ✅ **Real-time Synchronization**: Pull-to-refresh and automatic device list updates

## 🎯 Learning Objectives

By completing this Device Management codelab, you'll be able to:

1. **Implement device listing workflows** with proper cooling period detection and handling
2. **Build device management interfaces** with rename and delete operations
3. **Handle server-enforced cooling periods** with visual warnings and action disabling
4. **Protect current device** from accidental deletion with validation checks
5. **Design sync+async patterns** with proper event handler preservation
6. **Implement three-layer error handling** for comprehensive error detection
7. **Create real-time sync experiences** with pull-to-refresh functionality
8. **Debug device management flows** and troubleshoot operation-related issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/rn-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of REL-ID SDK event-driven architecture patterns
- Experience with React Native list rendering and pull-to-refresh
- Knowledge of Promise-based asynchronous programming
- Familiarity with TypeScript interfaces and type definitions
- Basic understanding of server-client synchronization patterns

## 📁 Device Management Project Structure

```
relid-device-management/
├── 📱 Enhanced React Native MFA + Device Management App
│   ├── android/                 # Android-specific configuration
│   ├── ios/                     # iOS-specific configuration
│   └── react-native-rdna-client/ # REL-ID Native Bridge
│
├── 📦 Device Management Source Architecture
│   └── src/
│       ├── tutorial/            # Device Management Implementation
│       │   ├── navigation/      # Enhanced navigation with device management
│       │   │   ├── AppNavigator.tsx        # Stack navigation + Device screens
│       │   │   ├── DrawerNavigator.tsx     # Drawer with device management menu
│       │   │   └── NavigationService.ts    # Navigation utilities
│       │   ├── screens/         # Device Management Screens
│       │   │   ├── components/  # Reusable UI components
│       │   │   │   ├── Button.tsx                # Loading and disabled states
│       │   │   │   ├── Input.tsx                 # Secure input with validation
│       │   │   │   ├── StatusBanner.tsx          # Success and error displays
│       │   │   │   └── DrawerContent.tsx         # Drawer menu with device mgmt
│       │   │   └── deviceManagement/ # 🔐 Device Management Flow
│       │   │       ├── DeviceManagementScreen.tsx   # 🆕 Device list with pull-to-refresh
│       │   │       ├── DeviceDetailScreen.tsx       # 🆕 Device details & actions
│       │   │       └── RenameDeviceDialog.tsx       # 🆕 Rename modal dialog
│       └── uniken/              # 🛡️ Enhanced REL-ID Integration
│           ├── providers/       # Enhanced providers
│           │   └── SDKEventProvider.tsx          # Device management event handling
│           │                                    # - onGetRegistredDeviceDetails handler
│           │                                    # - onUpdateDeviceDetails handler
│           ├── services/        # 🆕 Enhanced SDK service layer
│           │   ├── rdnaService.ts                # Added device management APIs
│           │   │                                # - getRegisteredDeviceDetails()
│           │   │                                # - updateDeviceDetails()
│           │   └── rdnaEventManager.ts           # Complete event management
│           │                                    # - setGetRegisteredDeviceDetailsHandler()
│           │                                    # - setUpdateDeviceDetailsHandler()
│           └── types/           # 📝 Enhanced TypeScript definitions
│               └── rdnaEvents.ts                # Complete event type definitions
│                                               # - RDNARegisteredDevice
│                                               # - RDNAGetRegisteredDeviceDetailsData
│                                               # - RDNAUpdateDeviceDetailsData
│
└── 📚 Production Configuration
    ├── package.json             # Dependencies
    ├── tsconfig.json
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-device-management

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

### Verify Device Management Features

Once the app launches, verify these device management capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ Device Management screen accessible from drawer navigation
3. ✅ `getRegisteredDeviceDetails()` API integration with device list display
4. ✅ Pull-to-refresh functionality for real-time device synchronization
5. ✅ Cooling period banner when server cooling period is active
6. ✅ Device detail screen with rename and delete operations
7. ✅ `updateDeviceDetails()` API integration with proper error handling
8. ✅ Current device protection preventing accidental deletion

## 🔑 REL-ID Device Management Operation Types

### Official REL-ID Device Management API Mapping

> **⚠️ Critical**: Device management operations follow a sync+async pattern. Always register event handlers BEFORE calling APIs.

| API Method | Operation Type | Event Handler | Description | Documentation |
|------------|---------------|---------------|-------------|---------------|
| `getRegisteredDeviceDetails()` | **List Devices** | `onGetRegistredDeviceDetails` | Fetches all user devices with cooling period info | [📖 API Docs](https://developer.uniken.com/docs/get-registered-devices) |
| `updateDeviceDetails()` | **Rename Device** (operationType: 0) | `onUpdateDeviceDetails` | Updates device name with server validation | [📖 API Docs](https://developer.uniken.com/docs/update-device-details) |
| `updateDeviceDetails()` | **Delete Device** (operationType: 1) | `onUpdateDeviceDetails` | Removes non-current device from account | [📖 API Docs](https://developer.uniken.com/docs/update-device-details) |

> **🎯 Production Recommendation**: Always implement three-layer error handling (API errors, status codes, promise rejections) for robust device management.

### How to Use Device Management APIs

REL-ID device management supports three primary operations:

#### **1. List Devices** - View All Registered Devices
```typescript
const userID = 'john.doe';
await rdnaService.getRegisteredDeviceDetails(userID);
// Wait for onGetRegistredDeviceDetails event
```
- **Use Case**: Display all devices registered to user account
- **Returns**: Device list with cooling period information
- **Status Code 100**: Success with device data
- **Status Code 146**: Cooling period active - disable all operations
- **📖 Official Documentation**: [Get Registered Devices API](https://developer.uniken.com/docs/get-registered-devices)

#### **2. Rename Device** - Update Device Display Name
```typescript
const operationType = 0; // Rename operation
await rdnaService.updateDeviceDetails(
  userID,
  deviceUUID,
  'My iPhone 14 Pro',
  operationType
);
// Wait for onUpdateDeviceDetails event
```
- **Use Case**: User-friendly device name customization
- **Validation**: Cannot rename during cooling period
- **Server Response**: StatusCode 100 (success) or 146 (cooling period)
- **📖 Official Documentation**: [Update Device Details API](https://developer.uniken.com/docs/update-device-details)

#### **3. Delete Device** - Remove Device from Account
```typescript
const operationType = 1; // Delete operation
await rdnaService.updateDeviceDetails(
  userID,
  deviceUUID,
  '', // Empty string for delete
  operationType
);
// Wait for onUpdateDeviceDetails event
```
- **Use Case**: Remove lost or unused devices
- **Protection**: Cannot delete current device (currentDevice: true)
- **Validation**: Cannot delete during cooling period
- **Confirmation**: Always show destructive action confirmation dialog
- **📖 Official Documentation**: [Update Device Details API](https://developer.uniken.com/docs/update-device-details)

## 🎓 Learning Checkpoints

### Checkpoint 1: Sync+Async Pattern Understanding
- [ ] I understand the two-phase response pattern (sync acknowledgment + async event)
- [ ] I know why event handlers must be registered BEFORE API calls
- [ ] I can implement proper callback preservation to avoid memory leaks
- [ ] I understand when to use screen-level vs global event handlers
- [ ] I can debug issues related to missing or incorrectly timed event handlers

### Checkpoint 2: Device Listing & Synchronization
- [ ] I can implement `getRegisteredDeviceDetails()` API with proper error handling
- [ ] I understand how to parse device list from `onGetRegistredDeviceDetails` event
- [ ] I know how to detect cooling period from StatusCode 146
- [ ] I can implement pull-to-refresh for real-time device synchronization
- [ ] I understand the device object structure (devUUID, devName, currentDevice, status)

### Checkpoint 3: Device Update Operations
- [ ] I can implement device rename with `updateDeviceDetails()` operationType 0
- [ ] I can implement device deletion with `updateDeviceDetails()` operationType 1
- [ ] I understand the JSON payload structure required by the SDK
- [ ] I know how to handle update responses in `onUpdateDeviceDetails` event
- [ ] I can differentiate between rename and delete operation responses

### Checkpoint 4: Cooling Period Management
- [ ] I understand what cooling periods are and why they exist
- [ ] I can detect cooling period from `deviceManagementCoolingPeriodEndTimestamp`
- [ ] I know how to disable UI actions when StatusCode is 146
- [ ] I can display visual warnings when cooling period is active
- [ ] I understand how to handle cooling period errors in update operations

### Checkpoint 5: Three-Layer Error Handling
- [ ] I can implement Layer 1: API-level error detection (longErrorCode !== 0)
- [ ] I can implement Layer 2: Status code validation (StatusCode 100, 146, etc.)
- [ ] I can implement Layer 3: Promise rejection handling for network errors
- [ ] I understand when each error layer catches different failure scenarios
- [ ] I can provide user-friendly error messages for all error types

### Checkpoint 6: Current Device Protection
- [ ] I understand why current device deletion must be prevented
- [ ] I can identify current device using `currentDevice: true` flag
- [ ] I know how to disable delete button for current device
- [ ] I can display appropriate UI indicators for current device (badge, etc.)
- [ ] I understand the security implications of current device protection

## 🔄 Device Management User Flow

### Scenario 1: Standard Device Listing with Real-time Sync
1. **User navigates to Device Management** → From drawer navigation menu
2. **API call initiated** → `getRegisteredDeviceDetails(userID)` called automatically
3. **Loading indicator displayed** → User sees loading state during API call
4. **Device list received** → `onGetRegistredDeviceDetails` event provides device array
5. **Cooling period check** → StatusCode 146 detection and banner display
6. **Device list rendered** → FlatList displays all devices with metadata
7. **Current device highlighted** → Badge or indicator for current device
8. **User pulls to refresh** → Manual refresh triggers new API call
9. **List updates** → Latest device data synchronized from server
10. **User taps device** → Navigate to DeviceDetailScreen for actions

### Scenario 2: Device Rename Operation
1. **User taps device card** → Navigate to DeviceDetailScreen
2. **User taps "Rename Device"** → Opens RenameDeviceDialog modal
3. **Current name pre-filled** → Text input shows existing device name
4. **User enters new name** → Real-time validation as user types
5. **User taps "Save"** → `updateDeviceDetails(userID, devUUID, newName, 0)` called
6. **Loading state shown** → Modal shows loading indicator
7. **Update response received** → `onUpdateDeviceDetails` event with StatusCode 100
8. **Success confirmation** → Alert displays "Device renamed successfully"
9. **UI updates immediately** → Device name updates in detail screen
10. **User returns to list** → Navigate back, device list shows updated name

### Scenario 3: Device Deletion with Protection
1. **User navigates to device detail** → Taps non-current device
2. **Delete button enabled** → Button active only for non-current devices
3. **User taps "Delete Device"** → Destructive action confirmation dialog appears
4. **Confirmation dialog shown** → "Are you sure? This cannot be undone."
5. **User confirms deletion** → `updateDeviceDetails(userID, devUUID, '', 1)` called
6. **Delete processing** → Loading indicator replaces button
7. **Delete response received** → `onUpdateDeviceDetails` event with StatusCode 100
8. **Success confirmation** → Alert with "Device deleted successfully"
9. **Navigation back** → Automatic return to device list
10. **Device list refreshed** → Deleted device no longer appears in list

### Scenario 4: Cooling Period Enforcement
1. **User performs operation** → Rename or delete device
2. **Server applies cooling period** → 30-minute cooldown starts
3. **User returns to device list** → Pull-to-refresh or automatic load
4. **API returns StatusCode 146** → Cooling period detected
5. **Warning banner displayed** → "Device management in cooling period. Please try again later."
6. **All actions disabled** → Rename and delete buttons grayed out
7. **User attempts operation** → Validation prevents API call
8. **Error message shown** → "Actions disabled during cooling period"
9. **Cooling period expires** → After configured time (e.g., 30 minutes)
10. **Operations re-enabled** → Next API call returns StatusCode 100, actions enabled

### Scenario 5: Error Handling (Network Failures, Current Device Protection)
1. **User attempts delete current device** → Taps delete on device with currentDevice: true
2. **Validation catches attempt** → Client-side check prevents API call
3. **Error alert displayed** → "Cannot delete the current device"
4. **User attempts network operation** → Rename/delete with no network
5. **Network error occurs** → Promise rejection in Layer 3 error handling
6. **Layer 3 catches error** → Promise .catch() handles network timeout
7. **User-friendly error shown** → "Failed to complete operation. Please check connection."
8. **User retries operation** → Taps retry button
9. **Network restored** → Operation succeeds on retry
10. **Success confirmation** → Operation completes successfully

## 💡 Pro Tips

### Device Management Implementation Best Practices
1. **Always preserve event handlers** - Use callback preservation pattern to prevent memory leaks
2. **Register handlers before API calls** - Event handlers must be set before calling SDK APIs
3. **Implement three-layer error handling** - Check API errors, status codes, and promise rejections
4. **Protect current device** - Never allow deletion of device with currentDevice: true
5. **Enforce cooling periods** - Disable all operations when StatusCode is 146
6. **Use pull-to-refresh** - Provide manual refresh for real-time synchronization
7. **Show loading states** - Always provide visual feedback during API operations
8. **Confirm destructive actions** - Use Alert.alert for delete operations

### Security & User Experience
9. **Validate before API calls** - Check cooling period and current device before operations
10. **Display cooling period warnings** - Show prominent banner when StatusCode 146
11. **Highlight current device** - Use badges or indicators for current device visibility
12. **Auto-refresh after operations** - Reload device list after successful rename/delete
13. **Handle cleanup on unmount** - Restore original event handlers in useEffect cleanup
14. **Provide timestamp context** - Display "Last accessed" and "Created" timestamps
15. **Optimize list rendering** - Use FlatList with proper keyExtractor for performance

## 🔗 Key Implementation Files

### Core Device Listing API Implementation
```typescript
// rdnaService.ts - Device Listing API
async getRegisteredDeviceDetails(userId: string): Promise<RDNASyncResponse> {
  return new Promise((resolve, reject) => {
    RdnaClient.getRegisteredDeviceDetails(
      userId,
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
```

### Device Update API Implementation
```typescript
// rdnaService.ts - Device Update API (Rename/Delete)
async updateDeviceDetails(
  userId: string,
  devUuid: string,
  devName: string,
  operationType: number
): Promise<RDNASyncResponse> {
  // SDK expects JSON string with complete device object array format
  // The status field determines operation: "Update" for rename, "Delete" for delete
  const status = operationType === 0 ? 'Update' : 'Delete';

  // Complete device object structure required by SDK
  const payload = JSON.stringify({
    device: [{
      devUUID: devUuid,
      devName: devName,
      status: status,
      lastAccessedTs: "2025-10-09T11:39:49UTC",
      lastAccessedTsEpoch: 1760009989000,
      createdTs: "2025-10-09T11:38:34UTC",
      createdTsEpoch: 1760009914000,
      appUuid: "6b72172f-3e51-4ea9-b217-2f3e51aea9c3",
      currentDevice: true,
      devBind: 0
    }]
  });

  return new Promise((resolve, reject) => {
    RdnaClient.updateDeviceDetails(
      userId,
      payload,
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
```

**Example Payload for Rename Operation:**
```json
{
  "device": [{
    "devUUID": "I6RT38G3M7K4JKBXW81FUEM2VYWQFQB3JSMQU0ZV7MZ84UMQR",
    "devName": "iOS-iPhone-iPhone 12 Mini-Updated",
    "status": "Update",
    "lastAccessedTs": "2025-10-09T11:39:49UTC",
    "lastAccessedTsEpoch": 1760009989000,
    "createdTs": "2025-10-09T11:38:34UTC",
    "createdTsEpoch": 1760009914000,
    "appUuid": "6b72172f-3e51-4ea9-b217-2f3e51aea9c3",
    "currentDevice": true,
    "devBind": 0
  }]
}
```

**Example Payload for Delete Operation:**
```json
{
  "device": [{
    "devUUID": "I6RT38G3M7K4JKBXW81FUEM2VYWQFQB3JSMQU0ZV7MZ84UMQR",
    "devName": "",
    "status": "Delete",
    "lastAccessedTs": "2025-10-09T11:39:49UTC",
    "lastAccessedTsEpoch": 1760009989000,
    "createdTs": "2025-10-09T11:38:34UTC",
    "createdTsEpoch": 1760009914000,
    "appUuid": "6b72172f-3e51-4ea9-b217-2f3e51aea9c3",
    "currentDevice": false,
    "devBind": 0
  }]
}
```

### Callback Preservation Pattern with Cleanup
```typescript
// DeviceManagementScreen.tsx - Proper Event Handler Setup with Cleanup
const loadDevices = useCallback(async () => {
  const eventManager = rdnaService.getEventManager();

  await new Promise<void>((resolve, reject) => {
    // Preserve existing callback
    const originalCallback = eventManager.getRegisteredDeviceDetailsHandler;

    // Set temporary callback for this screen
    eventManager.setGetRegisteredDeviceDetailsHandler((data) => {
      // Layer 1: Check API errors
      if (data.error && data.error.longErrorCode !== 0) {
        reject(new Error(data.error.errorString));
        return;
      }

      // Layer 2: Check status code
      const deviceList = data.pArgs?.response?.ResponseData?.device || [];
      const statusCode = data.pArgs?.response?.StatusCode || 0;
      const coolingPeriodEnd = data.pArgs?.response?.ResponseData
        ?.deviceManagementCoolingPeriodEndTimestamp || null;

      setDevices(deviceList);
      setIsCoolingPeriodActive(statusCode === 146);
      setCoolingPeriodEndTimestamp(coolingPeriodEnd);

      resolve();

      // Restore original callback
      if (originalCallback) {
        eventManager.setGetRegisteredDeviceDetailsHandler(originalCallback);
      }
    });

    // Layer 3: Call API with promise rejection handling
    rdnaService.getRegisteredDeviceDetails(userID).catch(reject);
  });
}, [userID]);

// Cleanup event handlers when screen unfocuses
useFocusEffect(
  useCallback(() => {
    console.log('Screen focused, loading devices');
    loadDevices();

    // Cleanup function: reset event handler when screen unfocuses
    return () => {
      console.log('Screen unfocused, cleaning up event handlers');
      const eventManager = rdnaService.getEventManager();
      eventManager.setGetRegisteredDeviceDetailsHandler(undefined);
    };
  }, [loadDevices])
);
```

### Event Handler Cleanup Pattern
```typescript
// DeviceDetailScreen.tsx - Proper Event Handler Cleanup
const DeviceDetailScreen: React.FC = () => {
  const [isRenaming, setIsRenaming] = useState(false);

  /**
   * Cleanup event handlers on component unmount
   * CRITICAL: Prevents memory leaks and event handler conflicts
   */
  React.useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up event handlers');
      const eventManager = rdnaService.getEventManager();
      // Reset handler to prevent memory leaks
      eventManager.setUpdateDeviceDetailsHandler(undefined);
    };
  }, []); // Empty dependency array = cleanup only on unmount

  const handleRenameDevice = async (newName: string) => {
    setIsRenaming(true);
    try {
      const eventManager = rdnaService.getEventManager();

      await new Promise<void>((resolve, reject) => {
        const originalCallback = eventManager.updateDeviceDetailsHandler;

        eventManager.setUpdateDeviceDetailsHandler((data) => {
          // Process response...

          // Restore original callback after use
          if (originalCallback) {
            eventManager.setUpdateDeviceDetailsHandler(originalCallback);
          }
        });

        rdnaService.updateDeviceDetails(userID, device.devUUID, newName, 0)
          .catch(reject);
      });

      Alert.alert('Success', 'Device renamed successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsRenaming(false);
    }
  };

  return (/* UI */);
};
```

**Why Cleanup is Critical:**
1. **Prevents Memory Leaks**: Unreferenced handlers can accumulate in memory
2. **Avoids Event Conflicts**: Multiple screens setting the same handler causes unpredictable behavior
3. **Ensures Proper State**: Clean slate for next screen mount
4. **React Best Practice**: Always cleanup side effects in useEffect

### Three-Layer Error Handling Implementation
```typescript
// DeviceDetailScreen.tsx - Complete Error Handling with Cleanup
const handleRenameDevice = async (newName: string) => {
  setIsRenaming(true);

  try {
    const eventManager = rdnaService.getEventManager();

    await new Promise<void>((resolve, reject) => {
      const originalCallback = eventManager.updateDeviceDetailsHandler;

      eventManager.setUpdateDeviceDetailsHandler((data) => {
        // Layer 1: API Error Check
        if (data.error && data.error.longErrorCode !== 0) {
          reject(new Error(data.error.errorString || 'Failed to rename device'));
          return;
        }

        // Layer 2: Status Code Check
        const statusCode = data.pArgs?.response?.StatusCode || 0;
        const statusMsg = data.pArgs?.response?.StatusMsg || '';

        if (statusCode === 100) {
          setCurrentDeviceName(newName);
          resolve();
        } else if (statusCode === 146) {
          reject(new Error('Device management is currently in cooling period.'));
        } else {
          reject(new Error(statusMsg || 'Failed to rename device'));
        }

        // Restore original callback
        if (originalCallback) {
          eventManager.setUpdateDeviceDetailsHandler(originalCallback);
        }
      });

      // Layer 3: Promise Rejection Handling
      rdnaService.updateDeviceDetails(userID, device.devUUID, newName, 0)
        .catch(reject);
    });

    Alert.alert('Success', 'Device renamed successfully');
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'Failed to rename device';
    Alert.alert('Rename Failed', errorMessage);
  } finally {
    setIsRenaming(false);
  }
};
```

### Cooling Period Detection & UI
```typescript
// DeviceManagementScreen.tsx - Cooling Period Banner
{isCoolingPeriodActive && (
  <View style={styles.coolingPeriodBanner}>
    <Text style={styles.coolingPeriodIcon}>⏳</Text>
    <View style={styles.coolingPeriodTextContainer}>
      <Text style={styles.coolingPeriodTitle}>Cooling Period Active</Text>
      <Text style={styles.coolingPeriodMessage}>
        {coolingPeriodMessage}
      </Text>
      {coolingPeriodEndTimestamp && (
        <Text style={styles.coolingPeriodTime}>
          Ends: {new Date(coolingPeriodEndTimestamp).toLocaleString()}
        </Text>
      )}
    </View>
  </View>
)}

// DeviceDetailScreen.tsx - Disabled Actions During Cooling Period
<TouchableOpacity
  style={[
    styles.actionButton,
    isCoolingPeriodActive && styles.actionButtonDisabled
  ]}
  onPress={() => setShowRenameDialog(true)}
  disabled={isCoolingPeriodActive || isRenaming}
>
  <Text style={styles.actionButtonText}>✏️ Rename Device</Text>
</TouchableOpacity>
```

### Current Device Protection
```typescript
// DeviceDetailScreen.tsx - Protect Current Device from Deletion
const isCurrentDevice = device.currentDevice;

{!isCurrentDevice && (
  <TouchableOpacity
    style={[
      styles.actionButtonDanger,
      (isCoolingPeriodActive || isDeleting) && styles.actionButtonDisabled
    ]}
    onPress={handleDeleteDevice}
    disabled={isCoolingPeriodActive || isDeleting}
  >
    <Text style={styles.actionButtonDangerText}>🗑️ Remove Device</Text>
  </TouchableOpacity>
)}

// Validation check
const handleDeleteDevice = () => {
  if (device.currentDevice) {
    Alert.alert('Error', 'Cannot delete the current device.');
    return;
  }

  Alert.alert(
    'Delete Device',
    `Are you sure you want to delete "${currentDeviceName}"? This action cannot be undone.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: performDeleteDevice }
    ]
  );
};
```

---

## 📚 Related Documentation

### Official REL-ID Device Management APIs
- **[Get Registered Devices API](https://developer.uniken.com/docs/get-registered-devices)** - Complete API reference for fetching device lists with cooling period information
- **[Update Device Details API](https://developer.uniken.com/docs/update-device-details)** - Comprehensive guide for rename and delete operations with JSON payload structure

### REL-ID Developer Resources
- **[REL-ID Developer Portal](https://developer.uniken.com/)** - Main developer documentation hub

### React Native Resources
- **[React Native Documentation](https://reactnative.dev/docs/getting-started)** - Official React Native setup and development guides
- **[React Navigation](https://reactnavigation.org/docs/getting-started)** - Navigation library documentation for React Native apps
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript language reference and best practices

---

**🔐 Congratulations! You've mastered Device Management with REL-ID SDK!**

*You're now equipped to implement secure, production-ready device management workflows with proper synchronization, cooling period enforcement, and error handling. Use this knowledge to create robust device management experiences that provide users with complete control over their registered devices while maintaining security through server-enforced cooling periods and current device protection.*

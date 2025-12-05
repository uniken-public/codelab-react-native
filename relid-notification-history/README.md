# REL-ID React Native Codelab: Notification History Management

[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-blue.svg)](https://reactnative.dev/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![Notification History](https://img.shields.io/badge/Feature-Notification%20History-purple.svg)]()

> **Codelab Advanced:** Master notification history retrieval, display, and filtering with REL-ID SDK in React Native

This folder contains the source code for the solution demonstrating [REL-ID Notification History Management](https://codelab.uniken.com/codelabs/rn-notification-history/index.html?index=..%2F..index#0) using React Native architecture with comprehensive historical tracking, filtering, and status management.

## 🔐 What You'll Learn

In this notification history management codelab, you'll master production-ready notification history patterns:

- ✅ **History Retrieval**: `getNotificationHistory()` API with 9 filter parameters for flexible querying
- ✅ **Historical Display**: FlatList with sorted notifications by timestamp and color-coded status badges
- ✅ **Status Tracking**: Visual indicators (UPDATED, EXPIRED, DISCARDED, DISMISSED) with color coding
- ✅ **Detail Modal**: Full notification view with complete metadata and timestamps
- ✅ **UTC Conversion**: Automatic local timestamp conversion for user-friendly display
- ✅ **Auto-Loading**: Notifications history loaded automatically on screen mount
- ✅ **Pull-to-Refresh**: Manual refresh functionality for real-time synchronization
- ✅ **Empty State Handling**: User-friendly messages when no history available
- ✅ **Error Handling**: Two-layer error checking (API errors and status codes)
- ✅ **Drawer Integration**: Accessible via "📜 Notification History" menu item

## 🎯 Learning Objectives

By completing this Notification History codelab, you'll be able to:

### Notification History Management
1. **Implement history retrieval** with `getNotificationHistory()` API and 9 filter parameters
2. **Handle onGetNotificationHistory event** with two-layer error checking pattern
3. **Display historical data** with FlatList, sorted by timestamp, status badges, and color coding
4. **Build detail modal** for viewing complete notification information
5. **Convert UTC timestamps** to local time for user-friendly display
6. **Implement auto-loading** pattern with `useEffect()` hook on screen mount
7. **Handle empty states** and error scenarios gracefully
8. **Manage event handlers** with cleanup on screen unmount to prevent accumulation

### React Native Development
9. **Build FlatList screens** with pull-to-refresh and optimized rendering
10. **Implement modal overlays** with proper state management
11. **Manage event handlers** with `useEffect` cleanup to prevent memory leaks
12. **Use TypeScript types** for SDK integration with proper type safety
13. **Handle navigation parameters** through drawer and stack navigation
14. **Debug React Native applications** with proper logging and error handling

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID React Native MFA Codelab](https://codelab.uniken.com/codelabs/rn-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- **[REL-ID React Native Additional Device Activation Flow With Notifications Codelab](https://codelab.uniken.com/codelabs/rn-mfa-additional-device-activation-flow/index.html?index=..%2F..index#0)** - Notification retrieval and display
- Understanding of React Native FlatList and pull-to-refresh patterns
- Experience with React hooks (`useState`, `useEffect`, `useCallback`)
- Knowledge of REL-ID SDK event-driven architecture
- Familiarity with TypeScript interfaces and type definitions
- Basic understanding of notification systems and historical data display

## 📁 Notification History Project Structure

```
relid-notification-history/
├── 📱 React Native Notification History App
│   ├── android/                 # Android-specific configuration
│   ├── ios/                     # iOS-specific configuration
│   └── react-native-rdna-client/ # REL-ID Native Bridge
│
├── 📦 Notification History Source Architecture
│   └── src/
│       ├── tutorial/            # Notification History Implementation
│       │   ├── navigation/      # Enhanced navigation
│       │   │   ├── AppNavigator.tsx        # Stack navigation
│       │   │   ├── DrawerNavigator.tsx     # Drawer with history menu
│       │   │   └── NavigationService.ts    # Navigation utilities
│       │   └── screens/         # Notification History Screens
│       │       ├── components/  # Reusable UI components
│       │       │   ├── Button.tsx                # Loading states
│       │       │   ├── StatusBanner.tsx          # Error displays
│       │       │   ├── DrawerContent.tsx         # Drawer menu
│       │       │   └── ...                       # Other reusable components
│       │       ├── notification/ # 🆕 Notification History Management
│       │       │   ├── GetNotificationsScreen.tsx    # Notification retrieval
│       │       │   ├── NotificationHistoryScreen.tsx # 🆕 Historical notifications
│       │       │   │                                 # - Auto-loads history
│       │       │   │                                 # - Detail modal
│       │       │   │                                 # - Status badges
│       │       │   │                                 # - UTC conversion
│       │       │   │                                 # - Pull-to-refresh
│       │       │   └── index.ts                      # Notification exports
│       │       └── mfa/         # MFA screens
│       │           ├── DashboardScreen.tsx          # Dashboard with drawer
│       │           ├── CheckUserScreen.tsx          # User validation
│       │           └── ...                          # Other MFA screens
│       └── uniken/              # 🛡️ REL-ID Integration
│           ├── providers/       # Enhanced providers
│           │   └── SDKEventProvider.tsx          # Event handling
│           │                                    # - onGetNotificationHistory
│           │                                    # - onGetNotifications
│           ├── services/        # 🆕 Enhanced SDK service layer
│           │   ├── rdnaService.ts                # Notification APIs
│           │   │                                # - getNotifications(params)
│           │   │                                # - getNotificationHistory(filters)
│           │   └── rdnaEventManager.ts           # Complete event management
│           │                                    # - setGetNotificationHistoryHandler()
│           │                                    # - setGetNotificationsHandler()
│           ├── types/           # 📝 TypeScript definitions
│           │   ├── rdnaEvents.ts                # Complete event type definitions
│           │   │                                # - RDNANotificationHistoryData
│           │   │                                # - RDNAGetNotificationsData
│           │   └── index.ts                     # Type exports
│           └── utils/           # Helper utilities
│               └── connectionProfileParser.ts  # Profile configuration
│
└── 📚 Production Configuration
    ├── package.json             # Dependencies
    ├── tsconfig.json
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-notification-history

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

### Verify Notification History Features

Once the app launches, verify these notification history capabilities:

**Notification History Retrieval**:

1. ✅ Complete MFA flow and log in to dashboard
2. ✅ Navigate to "📜 Notification History" from drawer menu
3. ✅ `getNotificationHistory()` called automatically on screen mount
4. ✅ Historical notifications displayed in FlatList (sorted by timestamp, latest first)
5. ✅ Status badges visible with color coding:
   - Green: UPDATED, ACCEPTED
   - Red: REJECTED, DISCARDED
   - Orange: EXPIRED
   - Gray: DISMISSED
   - Blue: Other statuses

**Detail Modal & Timestamps**:

6. ✅ Tap notification item → Detail modal displays
7. ✅ Modal shows complete notification info:
   - Subject and message
   - Status and action performed
   - Created timestamp (converted to local time)
   - Updated timestamp (converted to local time)
   - Expiry timestamp (converted to local time)
   - Signing status (if available)
8. ✅ UTC timestamps automatically converted to local time
9. ✅ Tap "Cancel" button → Modal closes

**Pull-to-Refresh & Error Handling**:

10. ✅ Pull down on history list → Refresh indicator displays
11. ✅ History reloads with latest data from server
12. ✅ When no history available → "No notification history found" message with retry button
13. ✅ Tap retry button → History reloads
14. ✅ API errors display user-friendly error messages from server
15. ✅ Status code errors show StatusMsg from response

**Event Handler Management**:

16. ✅ Open Notification History for the first time → Handler registered
17. ✅ Navigate away → cleanup function called, handler removed
18. ✅ Open Notification History again → New handler registered (no accumulation)
19. ✅ Response handled only once (not multiple times)

## 🎓 Learning Checkpoints

### Checkpoint 1: Notification History Basics
- [ ] I understand how `getNotificationHistory()` retrieves historical notifications
- [ ] I can implement filtered history retrieval with 9 parameters (recordCount, startIndex, enterpriseId, dates, status, action, keyword, deviceId)
- [ ] I know how to handle `onGetNotificationHistory` event with two-layer error checking
- [ ] I can display historical notifications with FlatList sorted by timestamp

### Checkpoint 2: Status Display & Color Coding
- [ ] I understand different notification statuses (UPDATED, EXPIRED, DISCARDED, DISMISSED)
- [ ] I can implement color-coding for different statuses
- [ ] I know how to display status badges with appropriate colors
- [ ] I can display action performed with color-coding based on action type

### Checkpoint 3: Detail Modal & Timestamps
- [ ] I can build detail modal for viewing complete notification information
- [ ] I understand how to convert UTC timestamps to local time
- [ ] I know how to handle different UTC timestamp formats (with/without "UTC" suffix)
- [ ] I can display multiple timestamp fields (created, updated, expiry)

### Checkpoint 4: Auto-Loading & Pull-to-Refresh
- [ ] I understand auto-loading pattern with `useEffect()` hook on screen mount
- [ ] I can implement pull-to-refresh with FlatList's `onRefresh` and `refreshing` props
- [ ] I know how to handle empty states with user-friendly messages
- [ ] I can implement two-layer error checking (error.longErrorCode and StatusCode)

### Checkpoint 5: Event Handler Management
- [ ] I understand event handler accumulation prevention with `useEffect` cleanup
- [ ] I know when to call cleanup (in return function of `useEffect`)
- [ ] I can remove event handlers when screen unmounts
- [ ] I understand why callback preservation is not needed for notification history

### Checkpoint 6: React Native Development
- [ ] I understand FlatList optimization with `keyExtractor` and `renderItem`
- [ ] I know how to implement modal overlays with proper state management
- [ ] I can implement navigation with drawer and parameter passing
- [ ] I understand TypeScript integration with REL-ID SDK types
- [ ] I can maintain session parameters across screen navigation

## 🔄 Notification History User Flows

### Scenario 1: Viewing Notification History
1. **User in Dashboard** → Opens drawer menu
2. **User taps "📜 Notification History"** → Navigation.navigate('NotificationHistory', params)
3. **NotificationHistoryScreen mounts** → `useEffect()` called
4. **Register event handler** → `setGetNotificationHistoryHandler()` registered
5. **Auto-load history** → `getNotificationHistory()` called with default parameters
6. **SDK returns history** → `onGetNotificationHistory` event triggered
7. **Two-layer error checking** → Check error.longErrorCode, then StatusCode
8. **History displayed** → FlatList with sorted items, status badges (color-coded)
9. **User taps history item** → Detail modal displays
10. **Modal shows details** → Complete notification info with UTC timestamps converted to local time
11. **User closes modal** → Returns to history list

### Scenario 2: Pull-to-Refresh
1. **User in Notification History** → Sees current history list
2. **User pulls down** → Refresh indicator displays
3. **API called** → `getNotificationHistory()` with same parameters
4. **History updated** → FlatList re-renders with latest data
5. **Refresh indicator hidden** → User sees updated history

### Scenario 3: Empty Notification History
1. **NotificationHistoryScreen mounts** → Auto-calls `getNotificationHistory()`
2. **SDK returns empty array** → No historical notifications found
3. **Empty state displayed** → "No notification history found" message with retry button
4. **User taps retry** → `getNotificationHistory()` called again

### Scenario 4: Returning to Notification History (Proper Cleanup)
1. **User visits Notification History** → Handler registered via `useEffect`
2. **User navigates away** → `useEffect` cleanup function executes, handler removed
3. **User returns to Notification History** → New handler registered (old one removed)
4. **Response received** → Handler called only ONCE (no multiple calls)

### Scenario 5: Error Handling
1. **API error occurs** → error.longErrorCode !== 0
2. **Layer 1 check triggers** → Display error.errorString
3. **Error state displayed** → User-friendly error message with retry button

**Important Notes**:

- **Filter Parameters**: 9 parameters available (recordCount, startIndex, enterpriseId, startDate, endDate, notificationStatus, actionPerformed, keywordSearch, deviceId)
- **UTC Conversion**: All timestamps automatically converted to local time using `replace('UTC', 'Z')` pattern
- **Handler Cleanup**: Return cleanup function in `useEffect()` to prevent handler accumulation
- **Two-Layer Error Checking**: Always check error.longErrorCode first, then StatusCode
- **Status Color Coding**: Green (success), Red (rejected), Orange (expired), Gray (dismissed), Blue (other)
- **Event Uniqueness**: Only NotificationHistoryScreen uses `onGetNotificationHistory`, so no callback preservation needed

## 🔄 Notification History Filter Parameters

The `getNotificationHistory()` API supports 9 filter parameters for flexible querying:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `recordCount` | number | Number of records to retrieve | 10 |
| `startIndex` | number | Starting index for pagination | 1 |
| `enterpriseId` | string | Filter by enterprise ID | '' (empty for all) |
| `startDate` | string | Filter from this date | '' (empty for all) |
| `endDate` | string | Filter until this date | '' (empty for all) |
| `notificationStatus` | string | Filter by status | 'UPDATED', 'EXPIRED', etc. |
| `actionPerformed` | string | Filter by action | 'APPROVE', 'REJECT', etc. |
| `keywordSearch` | string | Search by keyword | '' (empty for all) |
| `deviceId` | string | Filter by device ID | '' (empty for all) |

**Default Parameters for Basic Retrieval**:
```typescript
getNotificationHistory(
  10,    // recordCount - Get 10 most recent
  1,     // startIndex - Start from first record
  '',    // enterpriseId - All enterprises
  '',    // startDate - No start date filter
  '',    // endDate - No end date filter
  '',    // notificationStatus - All statuses
  '',    // actionPerformed - All actions
  '',    // keywordSearch - No keyword filter
  ''     // deviceId - All devices
);
```

## 🎨 Status Badge Color Coding

Notification history uses color-coded status badges for visual clarity:

| Status | Color | Hex Code | Meaning |
|--------|-------|----------|---------|
| UPDATED, ACCEPTED | Green | #4CAF50 | Successfully processed |
| REJECTED, DISCARDED | Red | #F44336 | Declined or discarded |
| EXPIRED | Orange | #FF9800 | Expired before action |
| DISMISSED | Gray | #9E9E9E | User dismissed |
| Other statuses | Blue | #2196F3 | Default color |

## 🕐 UTC Timestamp Conversion

All notification timestamps are returned in UTC format and must be converted to local time:

**UTC Timestamp Formats**:
- Format 1: `"2025-10-09T11:39:49UTC"` (with "UTC" suffix)
- Format 2: `"2025-10-09T11:39:49Z"` (with "Z" suffix)

**Conversion Logic**:
1. Check if timestamp ends with "UTC"
2. Replace "UTC" with "Z" for proper JavaScript Date parsing
3. Create Date object: `new Date(cleanTimestamp)`
4. Convert to local string: `utcDate.toLocaleString()`

**Example Conversion**:
- UTC: `"2025-10-09T11:39:49UTC"`
- Cleaned: `"2025-10-09T11:39:49Z"`
- Local: `"10/9/2025, 7:09:49 AM"` (assuming EST timezone)

## ⚠️ Two-Layer Error Checking Pattern

All notification history responses use two-layer error checking:

**Layer 1 - API Error** (`error.longErrorCode`):
- Check if `data.error && data.error.longErrorCode !== 0`
- If error exists → Display `data.error.errorString`
- Return early (don't process data)

**Layer 2 - Status Code** (`pArgs.response.StatusCode`):
- Check if `data.pArgs?.response?.StatusCode !== 100`
- If status not 100 → Display `data.pArgs?.response?.StatusMsg`
- Return early (don't process data)

**Success** (Both checks pass):
- Process `data.pArgs?.response?.ResponseData?.history`
- Display sorted notification history in FlatList

## 🔧 Event Handler Cleanup

To prevent event handler accumulation when visiting the screen multiple times:

**Pattern**:
1. Register handler in `useEffect()` hook
2. Return cleanup function that removes handler
3. Cleanup executes when screen unmounts or dependencies change
4. Result: Only one handler active at a time (no multiple calls)

**Why This Matters**:
- Without cleanup: Handlers accumulate on each visit (1st visit = 1 handler, 2nd visit = 2 handlers, 3rd visit = 3 handlers)
- With cleanup: Always exactly 1 handler active
- Response processed only once (no duplicate "Loaded 10 history items" logs)

## 🎓 Learning Checkpoints Summary

Use this checklist to verify your implementation:

**Core Features**:
- [ ] Notification history retrieval with `getNotificationHistory()` API
- [ ] Auto-loading pattern on screen mount with `useEffect()`
- [ ] FlatList display sorted by timestamp (newest first)
- [ ] Status badges with color coding
- [ ] Detail modal with complete notification info
- [ ] UTC timestamp conversion to local time
- [ ] Pull-to-refresh functionality

**Error Handling**:
- [ ] Layer 1: API error checking (error.longErrorCode)
- [ ] Layer 2: Status code checking (StatusCode)
- [ ] Empty state handling
- [ ] User-friendly error messages

**Event Management**:
- [ ] Event handler registration in `useEffect()`
- [ ] Event handler cleanup (prevents accumulation)
- [ ] Cleanup called in return function of `useEffect()`
- [ ] No callback preservation needed (unique event)

**React Native Patterns**:
- [ ] FlatList optimization with keyExtractor
- [ ] Pull-to-refresh with onRefresh and refreshing props
- [ ] Modal overlay management with state
- [ ] Navigation parameter passing through drawer
- [ ] TypeScript type safety with SDK types

## 📚 Advanced Resources

- **REL-ID Notifications API**: [Notifications API Guide](https://developer.uniken.com/docs/notification-management)
- **REL-ID SDK Documentation**: [REL-ID SDK Reference](https://developer.uniken.com/docs/rel-id-sdk)
- **React Native FlatList**: [FlatList Performance](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- **React Native Modal**: [Modal Component](https://reactnative.dev/docs/modal)
- **React Hooks**: [useEffect Hook](https://react.dev/reference/react/useEffect)

## 💡 Pro Tips

### Notification History Implementation
1. **Auto-load history** - Call `getNotificationHistory()` in `useEffect()` on mount
2. **Sort by timestamp** - Display newest history items first for better UX
3. **Color-code status** - Use visual indicators for different statuses
4. **Convert UTC timestamps** - Always convert to local time for display
5. **Handle empty states** - Show user-friendly messages when no data
6. **Use default filters** - Start with empty filters to get all history

### Error Handling Best Practices
7. **Two-layer checking** - Always check error.longErrorCode first, then StatusCode
8. **Show server messages** - Display error.errorString and StatusMsg from server
9. **Log error codes** - Include error codes in console logs for debugging
10. **Handle empty arrays** - Check for empty history array and show appropriate message

### Event Handler Management
11. **Cleanup in useEffect** - Return cleanup function to remove handler on unmount
12. **Remove old handlers** - Clear handler before setting new one
13. **No preservation needed** - NotificationHistory event is unique to this screen
14. **Test multiple visits** - Ensure handler doesn't accumulate on repeated visits

### React Native Development
15. **Optimize FlatList** - Use `keyExtractor`, `renderItem`, and `getItemLayout` for performance
16. **Pull-to-refresh UX** - Provide visual feedback during refresh operations
17. **Pass session params** - Always pass userID, sessionID through navigation
18. **Use TypeScript types** - Leverage SDK type definitions for type safety
19. **Test on device** - Some features only work on real devices
20. **Use React DevTools** - Debug component state and props effectively

---

**📜 Congratulations! You've mastered Notification History Management in React Native!**

*You're now equipped to implement production-ready notification history features with:*

- **Historical Tracking**: Complete notification history with filtering capabilities
- **Visual Status Indicators**: Color-coded badges for quick status recognition
- **Detail Views**: Comprehensive notification metadata display
- **UTC Conversion**: User-friendly local timestamp display
- **Error Handling**: Two-layer error checking with server messages
- **Event Management**: Proper handler cleanup to prevent accumulation
- **Pull-to-Refresh**: Real-time synchronization with server data

*Use this knowledge to create user-friendly notification history experiences in React Native applications that provide complete audit trails and historical insights!*

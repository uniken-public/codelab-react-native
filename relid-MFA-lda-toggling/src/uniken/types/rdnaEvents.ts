// ================================================================================================
// RDNA Event Type Definitions
// This file contains unified type definitions for REL-ID SDK events and responses.
// Designed for simplicity, clarity, and future extensibility.
// ================================================================================================

/**
 * Standard RDNA Error Structure
 * Used across all APIs and events for consistent error handling
 */
export interface RDNAError {
  longErrorCode: number;
  shortErrorCode: number;
  errorString: string;
}

/**
 * Standard RDNA Status Structure
 * Used in challenge responses and API responses
 */
export interface RDNAStatus {
  statusCode: number;
  statusMessage: string;
}

/**
 * Standard RDNA Session Structure
 * Contains session information from the SDK
 */
export interface RDNASession {
  sessionType: number;
  sessionID: string;
}

/**
 * Standard RDNA Additional Info Structure
 * Contains comprehensive session and configuration data
 */
export interface RDNAAdditionalInfo {
  DNAProxyPort: number;
  isAdUser: number;
  isDNAProxyLocalHostOnly: number;
  jwtJsonTokenInfo: string;
  settings: string;
  mtlsP12Bundle: string;
  configSettings: string;
  loginIDs: any[];
  availableGroups: any[];
  idvAuditInfo: string;
  idvUserRole: string;
  currentWorkFlow: string;
  isMTDDownloadOnly: number;
}

/**
 * Standard RDNA Challenge Info Structure
 * Key-value pairs for challenge-related information
 */
export interface RDNAChallengeInfo {
  key: string;
  value: string;
}

/**
 * Standard RDNA Challenge Response Structure
 * Complete challenge response with all components
 */
export interface RDNAChallengeResponse {
  status: RDNAStatus;
  session: RDNASession;
  additionalInfo: RDNAAdditionalInfo;
  challengeInfo: RDNAChallengeInfo[];
}




// ================================================================================================
// RESPONSE CATEGORIES
// ================================================================================================

/**
 * RDNA Sync Response Structure
 * Used for synchronous API responses (initialize, takeActionOnThreats, setUser, setActivationCode)
 */
export interface RDNASyncResponse {
  error: RDNAError;
}

/**
 * RDNA JSON Response Structure
 * Used for simple JSON string responses
 */
export interface RDNAJsonResponse {
  response: string;
}

/**
 * Base RDNA Event Structure
 * Foundation for all asynchronous SDK events that include challenge responses
 */
export interface RDNAEvent {
  challengeResponse: RDNAChallengeResponse;
  error: RDNAError;
}


// ================================================================================================
// SPECIFIC EVENT INTERFACES
// ================================================================================================

// --- Progress and Error Events ---

/**
 * RDNA Progress Data
 * Real-time progress updates during initialization
 */
export interface RDNAProgressData {
  systemThreatCheckStatus: string;
  appThreatCheckStatus: string;
  networkThreatCheckStatus: string;
  initializeStatus: string;
}

/**
 * RDNA Initialize Error Data
 * Error information during initialization
 */
export interface RDNAInitializeErrorData {
  longErrorCode: number;
  shortErrorCode: number;
  errorString: string;
}

/**
 * RDNA Initialized Data
 * Success data after initialization completion
 */
export interface RDNAInitializedData {
  status: RDNAStatus;
  session: RDNASession;
  additionalInfo: RDNAAdditionalInfo;
  challengeInfo: RDNAChallengeInfo[];
}

// --- User Authentication Events ---

/**
 * RDNA Get User Data
 * User information request event
 */
export interface RDNAGetUserData extends RDNAEvent {
  recentLoggedInUser: string;
  rememberedUsers: string[];
}

/**
 * RDNA Get Activation Code Data
 * Activation code request event
 */
export interface RDNAGetActivationCodeData extends RDNAEvent {
  userID: string;
  verificationKey: string;
  attemptsLeft: number;
}

/**
 * RDNA Get User Consent For LDA Data
 * User consent request for LDA authentication
 */
export interface RDNAGetUserConsentForLDAData extends RDNAEvent {
  userID: string;
  challengeMode: number;
  authenticationType: number;
}

/**
 * RDNA Get Password Data
 * Password request event
 */
export interface RDNAGetPasswordData extends RDNAEvent {
  userID: string;
  challengeMode: number;
  attemptsLeft: number;
}

/**
 * RDNA User Logged In Data
 * User login completion event with full session and JWT information
 */
export interface RDNAUserLoggedInData extends RDNAEvent {
  userID: string;
}

/**
 * RDNA Credentials Available For Update Data
 * Event indicating credentials can be updated (triggered by getAllChallenges)
 */
export interface RDNACredentialsAvailableForUpdateData {
  userID: string;
  options: string[];
  error: RDNAError;
}

/**
 * RDNA Update Credential Response Data
 * Response after updating credentials via updatePassword with challengeMode = 2
 */
export interface RDNAUpdateCredentialResponseData {
  userID: string;
  credType: string;
  status: RDNAStatus;
  error: RDNAError;
}

/**
 * RDNA User Logged Off Data
 * Event triggered after successful user logout
 */
export interface RDNAUserLoggedOffData extends RDNAEvent {
  userID: string;
}

/**
 * RDNA Authentication Capability
 * Individual authentication type configuration for LDA management
 */
export interface RDNAAuthenticationCapability {
  authenticationType: number;
  isConfigured: number; // 1 = enabled, 0 = disabled
}

/**
 * RDNA Device Authentication Details Data
 * Response structure for getDeviceAuthenticationDetails (sync callback only)
 */
export interface RDNADeviceAuthenticationDetailsData {
  authenticationCapabilities: RDNAAuthenticationCapability[];
  error: RDNAError;
}

/**
 * RDNA Device Auth Management Status Data
 * Event triggered after manageDeviceAuthenticationModes call (async event)
 */
export interface RDNADeviceAuthManagementStatusData {
  userID: string;
  OpMode: number; // 1 = enable, 0 = disable
  ldaType: number;
  status: RDNAStatus;
  error: RDNAError;
}

/**
 * RDNA Add New Device Options Data
 * New device activation options
 */
export interface RDNAAddNewDeviceOptionsData {
  userID: string;
  newDeviceOptions: string[];
  challengeInfo: RDNAChallengeInfo[];
}

// --- Threat Detection Events ---

/**
 * RDNA Threat Info
 * Individual threat information
 */
export interface RDNAThreatInfo {
  threatName: string;
  threatMsg: string;
  threatId: number;
  threatCategory: string;
  networkInfo: {
    bssid: string;
    maliciousAddress: string;
    maliciousMacAddress: string;
    ssid: string;
  };
  threatSeverity: string;
  threatReason: string[] | string;
  rememberActionForSession: number;
  configuredAction: string;
  appInfo: {
    appName: string;
    appSha256: string;
    packageName: string;
  };
  shouldProceedWithThreats: number;
}

/**
 * RDNA User Consent Threats Data
 * Threat detection requiring user consent
 */
export interface RDNAUserConsentThreatsData {
  threats: RDNAThreatInfo[];
}

/**
 * RDNA Terminate With Threats Data
 * Critical threats requiring application termination
 */
export interface RDNATerminateWithThreatsData {
  threats: RDNAThreatInfo[];
}

// --- Session Management Events ---

/**
 * RDNA Session Timeout Data
 * Event triggered when session times out
 */
export interface RDNASessionTimeoutData {
  message: string;
}

/**
 * RDNA Session Timeout Notification Data
 * Event triggered before session timeout with extension option
 */
export interface RDNASessionTimeoutNotificationData {
  userID: string;
  message: string;
  timeLeftInSeconds: number;
  sessionCanBeExtended: number; // 0 = cannot extend, 1 = can extend
  info: {
    sessionType: number;
    currentWorkFlow: string;
  };
}

/**
 * RDNA Session Extension Response Data
 * Response received after attempting to extend session timeout
 */
export interface RDNASessionExtensionResponseData {
  status: RDNAStatus;
  error: RDNAError;
}

// --- Notification Events ---

/**
 * RDNA Notification Body
 * Localized content for notification
 */
export interface RDNANotificationBody {
  lng: string;
  subject: string;
  message: string;
  label: Record<string, string>;
}

/**
 * RDNA Notification Action
 * Available actions for notification
 */
export interface RDNANotificationAction {
  label: string;
  action: string;
  authlevel: string;
}

/**
 * RDNA Notification Item
 * Individual notification structure from API response
 */
export interface RDNANotificationItem {
  notification_uuid: string;
  create_ts: string;
  expiry_timestamp: string;
  create_ts_epoch: number;
  expiry_timestamp_epoch: number;
  body: RDNANotificationBody[];
  actions: RDNANotificationAction[];
  action_performed: string;
  ds_required: boolean;
}

/**
 * RDNA Notification Response Data
 * Response structure for notifications API
 */
export interface RDNANotificationResponseData {
  notifications: RDNANotificationItem[];
  start: string;
  count: string;
  total: string;
}

/**
 * RDNA Get Notifications Data
 * Unified notification response structure for onGetNotifications event
 */
export interface RDNAGetNotificationsData {
  errCode?: number;
  error?: RDNAError;
  eMethId?: number;
  userID?: string;
  challengeMode?: number;
  authenticationType?: number;
  challengeResponse?: RDNAChallengeResponse;
  pArgs?: {
    service_details: any;
    response: {
      ResponseData: RDNANotificationResponseData;
      ResponseDataLen: number;
      StatusMsg: string;
      StatusCode: number;
      CredOpMode: number;
    };
    pxyDetails: {
      isStarted: number;
      isLocalhostOnly: number;
      isAutoStarted: number;
      isPrivacyEnabled: number;
      portType: number;
      port: number;
    };
  };
}

/**
 * RDNA Update Notification Response Data
 * Response data structure for notification update
 */
export interface RDNAUpdateNotificationResponseData {
  status_code: number;
  message: string;
  notification_uuid: string;
  is_ds_verified: boolean;
}

/**
 * RDNA Update Notification Data
 * Complete response structure for onUpdateNotification event
 */
export interface RDNAUpdateNotificationData {
  errCode: number;
  error: RDNAError;
  eMethId: number;
  pArgs: {
    service_details: any;
    response: {
      ResponseData: RDNAUpdateNotificationResponseData;
      ResponseDataLen: number;
      StatusMsg: string;
      StatusCode: number;
      CredOpMode: number;
    };
    pxyDetails: {
      isStarted: number;
      isLocalhostOnly: number;
      isAutoStarted: number;
      isPrivacyEnabled: number;
      portType: number;
      port: number;
    };
  };
}

// ================================================================================================
// UTILITY HELPERS
// ================================================================================================

/**
 * RDNA Event Utilities
 * Helper functions for common event operations to simplify integration
 */
export const RDNAEventUtils = {
  /**
   * Check if an RDNA event completed successfully
   * @param event Any RDNA event with error and challengeResponse
   * @returns true if successful, false otherwise
   */
  isSuccess: (event: RDNAEvent): boolean => 
    event.error.longErrorCode === 0 && 
    (event.challengeResponse.status.statusCode === 100 || event.challengeResponse.status.statusCode === 0),

  /**
   * Check if an RDNA event has API-level errors
   * @param event Any RDNA event with error
   * @returns true if has API errors, false otherwise
   */
  hasApiError: (event: RDNAEvent): boolean => 
    event.error.longErrorCode !== 0,

  /**
   * Check if an RDNA event has status-level errors
   * @param event Any RDNA event with challengeResponse
   * @returns true if has status errors, false otherwise
   */
  hasStatusError: (event: RDNAEvent): boolean => 
    event.challengeResponse.status.statusCode !== 100,

  /**
   * Get the primary error message from an RDNA event
   * @param event Any RDNA event
   * @returns The most relevant error message
   */
  getErrorMessage: (event: RDNAEvent): string => {
    if (event.error.longErrorCode !== 0) {
      return event.error.errorString;
    }
    if (event.challengeResponse.status.statusCode !== 100) {
      return event.challengeResponse.status.statusMessage;
    }
    return 'Unknown error occurred';
  },

  /**
   * Get session information from an RDNA event
   * @param event Any RDNA event with challengeResponse
   * @returns Session information object
   */
  getSessionInfo: (event: RDNAEvent) => ({
    sessionID: event.challengeResponse.session.sessionID,
    sessionType: event.challengeResponse.session.sessionType,
  }),

  /**
   * Get a specific challenge info value by key
   * @param event Any RDNA event with challengeResponse
   * @param key The challenge info key to look for
   * @returns The value if found, undefined otherwise
   */
  getChallengeValue: (event: RDNAEvent, key: string): string | undefined => 
    event.challengeResponse.challengeInfo.find(info => info.key === key)?.value,

  /**
   * Get all challenge info as a key-value object
   * @param event Any RDNA event with challengeResponse
   * @returns Object with all challenge info key-value pairs
   */
  getChallengeMap: (event: RDNAEvent): Record<string, string> => 
    event.challengeResponse.challengeInfo.reduce((map, info) => {
      map[info.key] = info.value;
      return map;
    }, {} as Record<string, string>),

  /**
   * Check if this is a specific workflow
   * @param event Any RDNA event with challengeResponse
   * @param workflow The workflow name to check
   * @returns true if matches the workflow, false otherwise
   */
  isWorkflow: (event: RDNAEvent, workflow: string): boolean => 
    event.challengeResponse.additionalInfo.currentWorkFlow === workflow,

};

/**
 * RDNA Sync Response Utilities
 * Helper functions for synchronous API responses
 */
export const RDNASyncUtils = {
  /**
   * Check if sync response was successful
   * @param response RDNASyncResponse
   * @returns true if successful, false otherwise
   */
  isSuccess: (response: RDNASyncResponse): boolean => 
    response.error.longErrorCode === 0,

  /**
   * Get error message from sync response
   * @param response RDNASyncResponse
   * @returns Error message string
   */
  getErrorMessage: (response: RDNASyncResponse): string => 
    response.error.errorString,
};

// ================================================================================================
// CALLBACK FUNCTION TYPES
// ================================================================================================

export type RDNAProgressCallback = (data: RDNAProgressData) => void;
export type RDNAErrorCallback = (data: RDNAInitializeErrorData) => void;
export type RDNASuccessCallback = (data: RDNAInitializedData) => void;
export type RDNAUserConsentThreatsCallback = (data: RDNAUserConsentThreatsData) => void;
export type RDNATerminateWithThreatsCallback = (data: RDNATerminateWithThreatsData) => void;
export type RDNAGetUserCallback = (data: RDNAGetUserData) => void;
export type RDNAGetActivationCodeCallback = (data: RDNAGetActivationCodeData) => void;
export type RDNAGetUserConsentForLDACallback = (data: RDNAGetUserConsentForLDAData) => void;
export type RDNAGetPasswordCallback = (data: RDNAGetPasswordData) => void;
export type RDNAUserLoggedInCallback = (data: RDNAUserLoggedInData) => void;
export type RDNAUserLoggedOffCallback = (data: RDNAUserLoggedOffData) => void;
export type RDNACredentialsAvailableForUpdateCallback = (data: RDNACredentialsAvailableForUpdateData) => void;
export type RDNAUpdateCredentialResponseCallback = (data: RDNAUpdateCredentialResponseData) => void;
export type RDNAAddNewDeviceOptionsCallback = (data: RDNAAddNewDeviceOptionsData) => void;

// Session Management Callbacks
export type RDNASessionTimeoutCallback = (data: RDNASessionTimeoutData) => void;
export type RDNASessionTimeoutNotificationCallback = (data: RDNASessionTimeoutNotificationData) => void;
export type RDNASessionExtensionResponseCallback = (data: RDNASessionExtensionResponseData) => void;

// Notification Management Callbacks
export type RDNAGetNotificationsCallback = (data: RDNAGetNotificationsData) => void;
export type RDNAUpdateNotificationCallback = (data: RDNAUpdateNotificationData) => void;

// LDA Management Callbacks
export type RDNADeviceAuthManagementStatusCallback = (data: RDNADeviceAuthManagementStatusData) => void;


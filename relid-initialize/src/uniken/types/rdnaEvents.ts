// ================================================================================================
// RDNA Event Type Definitions
// ================================================================================================
// This file contains optimized, unified type definitions for REL-ID SDK events and responses.
// Designed for simplicity, clarity, and future extensibility.
// ================================================================================================

// ================================================================================================
// CORE BASE STRUCTURES
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

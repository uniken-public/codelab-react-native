/**
 * Data Signing Types and Interfaces
 * Comprehensive TypeScript definitions for the Data Signing feature
 */

import { RDNAAuthLevel, RDNAAuthenticatorType } from 'react-native-rdna-client';

// =============================================================================
// DROPDOWN INTERFACES
// =============================================================================

export interface DropdownOption {
  value: string;
}

export interface AuthLevelDropdownData {
  authLevelOptions: DropdownOption[];
}

export interface AuthenticatorTypeDropdownData {
  authenticatorTypeOptions: DropdownOption[];
}

// =============================================================================
// DATA SIGNING REQUEST/RESPONSE INTERFACES
// =============================================================================

export interface DataSigningRequest {
  payload: string;
  authLevel: RDNAAuthLevel;
  authenticatorType: RDNAAuthenticatorType;
  reason: string;
}

export interface DataSigningResponse {
  dataPayload: string;
  dataPayloadLength: number;
  reason: string;
  payloadSignature: string;
  dataSignatureID: string;
  authLevel: number;
  authenticationType: number;
  status: ResponseStatus;
  error: ResponseError;
}

export interface ResponseStatus {
  statusCode: number;
  statusMessage: string;
}

export interface ResponseError {
  longErrorCode: number;
  shortErrorCode: number;
  errorString: string;
}

// =============================================================================
// CHALLENGE/AUTHENTICATION INTERFACES
// =============================================================================

export interface ChallengeInfo {
  key: string;
  value: string;
}

export interface SessionInfo {
  sessionType: number;
  sessionID: string;
}

export interface AdditionalInfo {
  DNAProxyPort: number;
  isAdUser: number;
  isDNAProxyLocalHostOnly: number;
  jwtJsonTokenInfo: string;
  settings: string;
  mtlsP12Bundle: string;
  configSettings: string;
  loginIDs: string[];
  availableGroups: any[];
  idvAuditInfo: string;
  idvUserRole: string;
  currentWorkFlow: string;
  isMTDDownloadOnly: number;
}

export interface ChallengeResponse {
  status: ResponseStatus;
  session: SessionInfo;
  additionalInfo: AdditionalInfo;
  challengeInfo: ChallengeInfo[];
}

export interface PasswordChallengeResponse {
  userID: string;
  challengeMode: number;
  attemptsLeft: number;
  challengeResponse: ChallengeResponse;
  error: ResponseError;
}

// =============================================================================
// UI STATE INTERFACES
// =============================================================================

export interface DataSigningFormState {
  payload: string;
  selectedAuthLevel: string;
  selectedAuthenticatorType: string;
  reason: string;
  isLoading: boolean;
}

export interface PasswordModalState {
  isVisible: boolean;
  password: string;
  challengeMode: number;
  attemptsLeft: number;
  authenticationOptions: string[];
  isLargeModal: boolean;
  keyboardHeight: number;
  responseData?: any;
}

// =============================================================================
// RESULT DISPLAY INTERFACE (excludes status and error)
// =============================================================================

export interface DataSigningResultDisplay {
  authLevel: string;
  authenticationType: string;
  dataPayloadLength: string;
  dataPayload: string;
  payloadSignature: string;
  dataSignatureID: string;
  reason: string;
}

export interface ResultInfoItem {
  name: string;
  value: string;
}

// =============================================================================
// SERVICE INTERFACES
// =============================================================================

export interface DropdownDataService {
  getAuthLevelOptions(): DropdownOption[];
  getAuthenticatorTypeOptions(): DropdownOption[];
  convertAuthLevelToEnum(displayValue: string): RDNAAuthLevel;
  convertAuthenticatorTypeToEnum(displayValue: string): RDNAAuthenticatorType;
}

export interface DataSigningService {
  authenticateUserAndSignData(request: DataSigningRequest): Promise<void>;
  setPassword(password: string, challengeMode: number): Promise<void>;
  resetAuthenticateUserAndSignDataState(): Promise<void>;
}

// =============================================================================
// CONTEXT INTERFACES
// =============================================================================

export interface DataSigningContextValue {
  // Form State
  formState: DataSigningFormState;
  updateFormState: (updates: Partial<DataSigningFormState>) => void;

  // Password Modal State
  passwordModalState: PasswordModalState;
  updatePasswordModalState: (updates: Partial<PasswordModalState>) => void;

  // Actions
  submitDataSigning: () => Promise<void>;
  submitPassword: () => Promise<void>;
  cancelPasswordModal: () => Promise<void>;
  resetState: () => void;

  // Results
  signingResult: DataSigningResponse | null;
  resultDisplay: DataSigningResultDisplay | null;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const AUTH_LEVEL_OPTIONS: DropdownOption[] = [
  { value: "NONE (0)" },
  { value: "RDNA_AUTH_LEVEL_1 (1)" },
  { value: "RDNA_AUTH_LEVEL_2 (2)" },
  { value: "RDNA_AUTH_LEVEL_3 (3)" },
  { value: "RDNA_AUTH_LEVEL_4 (4)" },
];

export const AUTHENTICATOR_TYPE_OPTIONS: DropdownOption[] = [
  { value: "NONE (0)" },
  { value: "RDNA_IDV_SERVER_BIOMETRIC (1)" },
  { value: "RDNA_AUTH_PASS (2)" },
  { value: "RDNA_AUTH_LDA (3)" },
];

// =============================================================================
// VALIDATION CONSTANTS
// =============================================================================

export const VALIDATION_PATTERNS = {
  REASON_REGEX: /[a-zA-Z0-9@=\-'"]+/,
  PAYLOAD_REGEX: /[a-zA-Z0-9@=\-'"]+/,
  MAX_PAYLOAD_LENGTH: 500,
};

// =============================================================================
// ERROR CODES
// =============================================================================

export const DATA_SIGNING_ERROR_CODES = {
  SUCCESS: 0,
  AUTHENTICATION_NOT_SUPPORTED: 214,
  AUTHENTICATION_FAILED: 102,
  USER_CANCELLED: 153,
  NETWORK_ERROR: 500,
} as const;
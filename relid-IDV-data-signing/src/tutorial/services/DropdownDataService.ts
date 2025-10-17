/**
 * Dropdown Data Service
 * Handles dropdown data and enum conversion for Data Signing feature
 */

import { RDNAAuthLevel, RDNAAuthenticatorType } from 'react-native-rdna-client';
import {
  DropdownOption,
  AUTH_LEVEL_OPTIONS,
  AUTHENTICATOR_TYPE_OPTIONS,
} from '../types/DataSigningTypes';

/**
 * Service class for managing dropdown data and enum conversions
 * Provides a clean interface for UI components to work with SDK enums
 */
class DropdownDataServiceClass {

  /**
   * Get all available authentication level options for dropdown
   * @returns Array of dropdown options for auth levels
   */
  getAuthLevelOptions(): DropdownOption[] {
    return AUTH_LEVEL_OPTIONS;
  }

  /**
   * Get all available authenticator type options for dropdown
   * @returns Array of dropdown options for authenticator types
   */
  getAuthenticatorTypeOptions(): DropdownOption[] {
    return AUTHENTICATOR_TYPE_OPTIONS;
  }

  /**
   * Convert human-readable auth level string to SDK enum value
   * Maps dropdown display values to RDNAAuthLevel enum constants
   *
   * @param displayValue - The string value from dropdown (e.g., "RDNA_AUTH_LEVEL_4 (4)")
   * @returns Corresponding RDNAAuthLevel enum value
   */
  convertAuthLevelToEnum(displayValue: string): RDNAAuthLevel {
    switch (displayValue) {
      case "NONE (0)":
        return RDNAAuthLevel.RDNA_AUTH_LEVEL_NONE;
      case "RDNA_AUTH_LEVEL_1 (1)":
        return RDNAAuthLevel.RDNA_AUTH_LEVEL_1;
      case "RDNA_AUTH_LEVEL_2 (2)":
        return RDNAAuthLevel.RDNA_AUTH_LEVEL_2;
      case "RDNA_AUTH_LEVEL_3 (3)":
        return RDNAAuthLevel.RDNA_AUTH_LEVEL_3;
      case "RDNA_AUTH_LEVEL_4 (4)":
        return RDNAAuthLevel.RDNA_AUTH_LEVEL_4;
      default:
        console.warn(`Unknown auth level: ${displayValue}, defaulting to NONE`);
        return RDNAAuthLevel.RDNA_AUTH_LEVEL_NONE;
    }
  }

  /**
   * Convert human-readable authenticator type string to SDK enum value
   * Maps dropdown display values to RDNAAuthenticatorType enum constants
   *
   * @param displayValue - The string value from dropdown (e.g., "RDNA_IDV_SERVER_BIOMETRIC (1)")
   * @returns Corresponding RDNAAuthenticatorType enum value
   */
  convertAuthenticatorTypeToEnum(displayValue: string): RDNAAuthenticatorType {
    switch (displayValue) {
      case "NONE (0)":
        return RDNAAuthenticatorType.RDNA_AUTH_TYPE_NONE;
      case "RDNA_IDV_SERVER_BIOMETRIC (1)":
        return RDNAAuthenticatorType.RDNA_IDV_SERVER_BIOMETRIC;
      case "RDNA_AUTH_PASS (2)":
        return RDNAAuthenticatorType.RDNA_AUTH_PASS;
      case "RDNA_AUTH_LDA (3)":
        return RDNAAuthenticatorType.RDNA_AUTH_LDA;
      default:
        console.warn(`Unknown authenticator type: ${displayValue}, defaulting to NONE`);
        return RDNAAuthenticatorType.RDNA_AUTH_TYPE_NONE;
    }
  }

  /**
   * Convert enum value back to display string (for reverse lookup)
   * Useful for displaying current selections or debugging
   *
   * @param enumValue - RDNAAuthLevel enum value
   * @returns Human-readable string for display
   */
  convertAuthLevelEnumToDisplay(enumValue: RDNAAuthLevel): string {
    switch (enumValue) {
      case RDNAAuthLevel.RDNA_AUTH_LEVEL_NONE:
        return "NONE (0)";
      case RDNAAuthLevel.RDNA_AUTH_LEVEL_1:
        return "RDNA_AUTH_LEVEL_1 (1)";
      case RDNAAuthLevel.RDNA_AUTH_LEVEL_2:
        return "RDNA_AUTH_LEVEL_2 (2)";
      case RDNAAuthLevel.RDNA_AUTH_LEVEL_3:
        return "RDNA_AUTH_LEVEL_3 (3)";
      case RDNAAuthLevel.RDNA_AUTH_LEVEL_4:
        return "RDNA_AUTH_LEVEL_4 (4)";
      default:
        return "NONE (0)";
    }
  }

  /**
   * Convert enum value back to display string (for reverse lookup)
   * Useful for displaying current selections or debugging
   *
   * @param enumValue - RDNAAuthenticatorType enum value
   * @returns Human-readable string for display
   */
  convertAuthenticatorTypeEnumToDisplay(enumValue: RDNAAuthenticatorType): string {
    switch (enumValue) {
      case RDNAAuthenticatorType.RDNA_AUTH_TYPE_NONE:
        return "NONE (0)";
      case RDNAAuthenticatorType.RDNA_IDV_SERVER_BIOMETRIC:
        return "RDNA_IDV_SERVER_BIOMETRIC (1)";
      case RDNAAuthenticatorType.RDNA_AUTH_PASS:
        return "RDNA_AUTH_PASS (2)";
      case RDNAAuthenticatorType.RDNA_AUTH_LDA:
        return "RDNA_AUTH_LDA (3)";
      default:
        return "NONE (0)";
    }
  }

  /**
   * Validate if a display value is a valid auth level option
   * @param displayValue - String to validate
   * @returns true if valid, false otherwise
   */
  isValidAuthLevel(displayValue: string): boolean {
    return AUTH_LEVEL_OPTIONS.some(option => option.value === displayValue);
  }

  /**
   * Validate if a display value is a valid authenticator type option
   * @param displayValue - String to validate
   * @returns true if valid, false otherwise
   */
  isValidAuthenticatorType(displayValue: string): boolean {
    return AUTHENTICATOR_TYPE_OPTIONS.some(option => option.value === displayValue);
  }

  /**
   * Get the numeric value from SDK enum (for logging/debugging)
   * @param authLevel - RDNAAuthLevel enum
   * @returns Numeric value of the enum
   */
  getAuthLevelNumericValue(authLevel: RDNAAuthLevel): number {
    return authLevel as number;
  }

  /**
   * Get the numeric value from SDK enum (for logging/debugging)
   * @param authenticatorType - RDNAAuthenticatorType enum
   * @returns Numeric value of the enum
   */
  getAuthenticatorTypeNumericValue(authenticatorType: RDNAAuthenticatorType): number {
    return authenticatorType as number;
  }
}

// Export singleton instance
export const DropdownDataService = new DropdownDataServiceClass();

// Export the class as well for testing purposes
export { DropdownDataServiceClass };
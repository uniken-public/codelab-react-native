/**
 * Data Signing Service
 * High-level service that orchestrates data signing operations
 */

import { RDNAAuthLevel, RDNAAuthenticatorType } from 'react-native-rdna-client';
import rdnaService from '../../uniken/services/rdnaService';
import { DropdownDataService } from './DropdownDataService';
import type {
  DataSigningRequest,
  DataSigningResponse,
  DataSigningResultDisplay,
  ResultInfoItem,
} from '../types/DataSigningTypes';

/**
 * High-level service for data signing operations
 * Combines RdnaService and DropdownDataService for complete functionality
 */
class DataSigningServiceClass {

  /**
   * Get dropdown data service instance
   */
  get dropdownService() {
    return DropdownDataService;
  }

  /**
   * Get RDNA service instance
   */
  get rdnaService() {
    return rdnaService;
  }

  /**
   * Initiates data signing with proper enum conversion
   *
   * @param request Data signing request with display values
   * @returns Promise that resolves when sync response is received
   */
  async signData(request: DataSigningRequest): Promise<void> {
    console.log('DataSigningService - Starting data signing process');

    try {
      const response = await rdnaService.authenticateUserAndSignData(
        request.payload,
        request.authLevel,
        request.authenticatorType,
        request.reason
      );

      console.log('DataSigningService - Data signing initiated successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('DataSigningService - Data signing failed:', error);
      throw error;
    }
  }

  /**
   * Submits password for step-up authentication during data signing
   *
   * @param password User's password
   * @param challengeMode Challenge mode from getPassword callback
   * @returns Promise that resolves when sync response is received
   */
  async submitPassword(password: string, challengeMode: number): Promise<void> {
    console.log('DataSigningService - Submitting password for data signing');

    try {
      const response = await rdnaService.setPassword(password, challengeMode);
      console.log('DataSigningService - Password submitted successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('DataSigningService - Password submission failed:', error);
      throw error;
    }
  }

  /**
   * Resets data signing state (cleanup)
   *
   * @returns Promise that resolves when state is reset
   */
  async resetState(): Promise<void> {
    console.log('DataSigningService - Resetting data signing state');

    try {
      await rdnaService.resetAuthenticateUserAndSignDataState();
      console.log('DataSigningService - State reset successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('DataSigningService - State reset failed:', error);
      throw error;
    }
  }

  /**
   * Convert dropdown values to SDK enums for API call
   *
   * @param authLevelDisplay Display value from dropdown
   * @param authenticatorTypeDisplay Display value from dropdown
   * @returns Converted enum values
   */
  convertDropdownToEnums(
    authLevelDisplay: string,
    authenticatorTypeDisplay: string
  ): {
    authLevel: RDNAAuthLevel;
    authenticatorType: RDNAAuthenticatorType;
  } {
    return {
      authLevel: DropdownDataService.convertAuthLevelToEnum(authLevelDisplay),
      authenticatorType: DropdownDataService.convertAuthenticatorTypeToEnum(authenticatorTypeDisplay),
    };
  }

  /**
   * Validates form input before submission
   *
   * @param payload Data payload to validate
   * @param authLevel Selected auth level
   * @param authenticatorType Selected authenticator type
   * @param reason Signing reason
   * @returns Validation result with errors if any
   */
  validateSigningInput(
    payload: string,
    authLevel: string,
    authenticatorType: string,
    reason: string
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate payload
    if (!payload || payload.trim().length === 0) {
      errors.push('Payload is required');
    } else if (payload.length > 500) {
      errors.push('Payload must be less than 500 characters');
    }

    // Validate auth level
    if (!authLevel || !DropdownDataService.isValidAuthLevel(authLevel)) {
      errors.push('Please select a valid authentication level');
    }

    // Validate authenticator type
    if (!authenticatorType || !DropdownDataService.isValidAuthenticatorType(authenticatorType)) {
      errors.push('Please select a valid authenticator type');
    }

    // Validate reason
    if (!reason || reason.trim().length === 0) {
      errors.push('Reason is required');
    } else if (reason.length > 100) {
      errors.push('Reason must be less than 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Converts raw data signing response to display format
   * Excludes status and error fields as per requirements
   *
   * @param response Raw response from onAuthenticateUserAndSignData
   * @returns Formatted data for UI display
   */
  formatSigningResultForDisplay(response: DataSigningResponse): DataSigningResultDisplay {
    return {
      authLevel: response.authLevel?.toString() || 'N/A',
      authenticationType: response.authenticationType?.toString() || 'N/A',
      dataPayloadLength: response.dataPayloadLength?.toString() || 'N/A',
      dataPayload: response.dataPayload || 'N/A',
      payloadSignature: response.payloadSignature || 'N/A',
      dataSignatureID: response.dataSignatureID || 'N/A',
      reason: response.reason || 'N/A',
    };
  }

  /**
   * Converts display format to info items for results screen
   *
   * @param displayData Formatted display data
   * @returns Array of info items for UI rendering
   */
  convertToResultInfoItems(displayData: DataSigningResultDisplay): ResultInfoItem[] {
    return [
      {
        name: 'Payload Signature',
        value: displayData.payloadSignature,
      },
      {
        name: 'Data Signature ID',
        value: displayData.dataSignatureID,
      },
      {
        name: 'Reason',
        value: displayData.reason,
      },
      {
        name: 'Data Payload',
        value: displayData.dataPayload,
      },
      {
        name: 'Auth Level',
        value: displayData.authLevel,
      },
      {
        name: 'Authentication Type',
        value: displayData.authenticationType,
      },
      {
        name: 'Data Payload Length',
        value: displayData.dataPayloadLength,
      },
    ];
  }

  /**
   * Validates password input
   *
   * @param password Password to validate
   * @returns Validation result
   */
  validatePassword(password: string): {
    isValid: boolean;
    error?: string;
  } {
    if (!password || password.trim().length === 0) {
      return {
        isValid: false,
        error: 'Password is required',
      };
    }

    return {
      isValid: true,
    };
  }

  /**
   * Gets user-friendly error message for error codes
   *
   * @param errorCode Error code from SDK
   * @returns Human-readable error message
   */
  getErrorMessage(errorCode: number): string {
    switch (errorCode) {
      case 0:
        return 'Success';
      case 214:
        return 'Authentication method not supported. Please try a different authentication type.';
      case 102:
        return 'Authentication failed. Please check your credentials and try again.';
      case 153:
        return 'Operation cancelled by user.';
      default:
        return `Operation failed with error code: ${errorCode}`;
    }
  }
}

// Export singleton instance
export const DataSigningService = new DataSigningServiceClass();

// Export the class as well for testing purposes
export { DataSigningServiceClass };
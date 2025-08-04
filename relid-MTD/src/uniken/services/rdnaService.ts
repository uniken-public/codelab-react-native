import RdnaClient, {
  RDNALoggingLevel,
} from 'react-native-rdna-client/src/index';
import { loadAgentInfo } from '../utils/connectionProfileParser';
import RdnaEventManager from './rdnaEventManager';
import type {
  RDNASyncResponse,
} from '../types/rdnaEvents';



export class RdnaService {
  private static instance: RdnaService;
  private eventManager: RdnaEventManager;

  constructor() {
    this.eventManager = RdnaEventManager.getInstance();
  }

  static getInstance(): RdnaService {
    if (!RdnaService.instance) {
      RdnaService.instance = new RdnaService();
    }
    return RdnaService.instance;
  }

    /**
   * Cleans up the service and event manager
   */
  cleanup(): void {
    console.log('RdnaService - Cleaning up service');
    this.eventManager.cleanup();
  }

  /**
   * Gets the event manager instance for external callback setup
   */
  getEventManager(): RdnaEventManager {
    return this.eventManager;
  }

  /**
   * Initializes the REL-ID SDK
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async initialize(): Promise<RDNASyncResponse> {
   
    const profile = await loadAgentInfo();
    console.log('RdnaService - Loaded connection profile:', {
      host: profile.host,
      port: profile.port,
      relId: profile.relId.substring(0, 10) + '...',
    });

    console.log('RdnaService - Starting initialization');

    return new Promise((resolve, reject) => {
      RdnaClient.initialize(
        profile.relId,                    // agentInfo: The REL-ID encrypted string, part of connection profile
        profile.host,                     // gatewayHost: Hostname or IP of the gateway server, part of connection profile
        profile.port,                     // gatewayPort: Port number for gateway server communication, part of connection profile
        '',                               // cipherSpecs: Encryption format string (e.g., "AES/256/CFB/NoPadding:SHA-256")
        '',                               // cipherSalt: Cryptographic salt for additional security (recommended: package name)
        '',                               // proxySettings: Proxy configuration (JSON string, optional)
        '',                               // dnsServerList: DNS server list (comma-separated, optional)
        RDNALoggingLevel.RDNA_NO_LOGS,   // logLevel: Logging level (use RDNA_NO_LOGS in production)
        response => {
          console.log('RdnaService - Initialize sync callback received');
          console.log('RdnaService - initialize Sync raw response', response);

          const result: RDNASyncResponse = response;
          
          if (result.error && result.error.longErrorCode === 0) {
            console.log(
              'RdnaService - Sync response success, waiting for async events',
            );
            resolve(result);
          } else {
            console.error('RdnaService - Sync response error:', result);
            reject(result);
          }
        },
      );
    });
  }



  /**
   * Gets the version of the REL-ID SDK
   */
  async getSDKVersion(): Promise<string> {
    return new Promise((resolve, reject) => {
      RdnaClient.getSDKVersion(response => {
        console.log('RdnaService - SDK version response received');

        try {
          const version = response?.response || 'Unknown';
          console.log('RdnaService - SDK Version:', version);
          resolve(version);
        } catch (error) {
          console.error('RdnaService - Failed to parse SDK version:', error);
          reject(new Error('Failed to parse SDK version response'));
        }
      });
    });
  }

  /**
   * Takes action on detected security threats
   * @param modifiedThreatsJson JSON string containing threat action decisions
   * @returns Promise<RDNASyncResponse> that resolves with sync response structure
   */
  async takeActionOnThreats(modifiedThreatsJson: string): Promise<RDNASyncResponse> {
    return new Promise((resolve, reject) => {
      RdnaClient.takeActionOnThreats(modifiedThreatsJson, response => {
        console.log('RdnaService - Take action on threats response received');

        const result: RDNASyncResponse = response;

        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - Successfully took action on threats');
          resolve(result);
        } else {
          const errorMessage =
            result.error?.errorString ||
            'Unknown error from takeActionOnThreats';
          console.error(
            'RdnaService - Take action on threats failed:',
            errorMessage,
          );
          reject(result);
        }
      });
    });
  }

}

export default RdnaService.getInstance();

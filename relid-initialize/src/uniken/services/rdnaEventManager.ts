import { NativeEventEmitter, NativeModules } from 'react-native';
import type {
  RDNAJsonResponse,
  RDNAProgressData,
  RDNAInitializeErrorData,
  RDNAInitializedData,
  RDNAUserConsentThreatsData,
  RDNATerminateWithThreatsData,
  RDNAInitializeProgressCallback,
  RDNAInitializeErrorCallback,
  RDNAInitializeSuccessCallback,
  RDNAUserConsentThreatsCallback,
  RDNATerminateWithThreatsCallback
} from '../types/rdnaEvents';

/**
 * REL-ID SDK Event Manager
 *
 * Manages all REL-ID SDK events in a centralized, type-safe manner.
 * Provides a singleton pattern for consistent event handling across the application.
 *
 * Supported Events:
 * - onInitializeProgress: SDK initialization progress updates
 * - onInitializeError: SDK initialization error handling
 * - onInitialized: Successful SDK initialization with session data
 * - onUserConsentThreats: Non-terminating threats requiring user consent
 * - onTerminateWithThreats: Critical threats requiring app termination
 *
 * Key Features:
 * - Singleton pattern for global event management
 * - Type-safe callback handling with TypeScript interfaces
 * - Automatic event listener registration and cleanup
 * - Single event handler per type for simplicity
 * - Comprehensive error handling and logging
 *
 * @see https://developer.uniken.com/docs/initialize-1
 */
class RdnaEventManager {
  private static instance: RdnaEventManager;
  private rdnaEmitter: NativeEventEmitter;
  private listeners: Array<any> = [];

    // Composite event handlers (can handle multiple concerns)
  private initializeProgressHandler?: RDNAInitializeProgressCallback;
  private initializeErrorHandler?: RDNAInitializeErrorCallback;
  private initializedHandler?: RDNAInitializeSuccessCallback;

  constructor() {
    this.rdnaEmitter = new NativeEventEmitter(NativeModules.RdnaClient);
    this.registerEventListeners();
  }

  static getInstance(): RdnaEventManager {
    if (!RdnaEventManager.instance) {
      RdnaEventManager.instance = new RdnaEventManager();
    }
    return RdnaEventManager.instance;
  }

  /**
   * Registers native event listeners for all SDK events
   */
  private registerEventListeners() {
    console.log('RdnaEventManager - Registering native event listeners');

    this.listeners.push(
      this.rdnaEmitter.addListener('onInitializeProgress', this.onInitializeProgress.bind(this)),
      this.rdnaEmitter.addListener('onInitializeError', this.onInitializeError.bind(this)),
      this.rdnaEmitter.addListener('onInitialized', this.onInitialized.bind(this)),
    );

    console.log('RdnaEventManager - Native event listeners registered');
  }

  /**
   * Handles SDK initialization progress events
   * @param response Raw response from native SDK
   */
  private onInitializeProgress(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Initialize progress event received");

    try {
      const progressData: RDNAProgressData = JSON.parse(response.response);
      console.log("RdnaEventManager - Progress:", progressData.initializeStatus);

      if (this.initializeProgressHandler) {
        this.initializeProgressHandler(progressData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse initialize progress:", error);
    }
  }

  /**
   * Handles SDK initialization error events
   * @param response Raw response from native SDK containing error details
   */
  private onInitializeError(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Initialize error event received");

    try {
      const errorData: RDNAInitializeErrorData = JSON.parse(response.response);
      console.error("RdnaEventManager - Initialize error:", errorData.errorString);

      if (this.initializeErrorHandler) {
        this.initializeErrorHandler(errorData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse initialize error:", error);
    }
  }

  /**
   * Handles SDK initialization success events
   * @param response Raw response from native SDK containing session data
   */
  private onInitialized(response: RDNAJsonResponse) {
    console.log("RdnaEventManager - Initialize success event received");

    try {
      const initializedData: RDNAInitializedData = JSON.parse(response.response);
      console.log("RdnaEventManager - Successfully initialized, Session ID:", initializedData.session.sessionID);

      if (this.initializedHandler) {
        this.initializedHandler(initializedData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse initialize success:", error);
    }
  }

  /**
   * Sets event handlers for SDK events. Only one handler per event type.
   */
  public setInitializeProgressHandler(callback?: RDNAInitializeProgressCallback): void {
    this.initializeProgressHandler = callback;
  }

  public setInitializeErrorHandler(callback?: RDNAInitializeErrorCallback): void {
    this.initializeErrorHandler = callback;
  }

  public setInitializedHandler(callback?: RDNAInitializeSuccessCallback): void {
    this.initializedHandler = callback;
  }

  /**
   * Cleans up all event listeners and handlers
   */
  public cleanup() {
    console.log('RdnaEventManager - Cleaning up event listeners and handlers');

    // Remove native event listeners
    this.listeners.forEach(listener => {
      if (listener && listener.remove) {
        listener.remove();
      }
    });
    this.listeners = [];

    // Clear all event handlers
    this.initializeProgressHandler = undefined;
    this.initializeErrorHandler = undefined;
    this.initializedHandler = undefined;
    console.log('RdnaEventManager - Cleanup completed');
  }
}

export default RdnaEventManager;

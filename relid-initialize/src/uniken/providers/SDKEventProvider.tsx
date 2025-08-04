/**
 * SDK Event Provider
 *
 * Centralized React Context provider for REL-ID SDK event handling.
 * Manages all SDK events, screen state, and navigation logic in one place.
 *
 * Key Features:
 * - Consolidated event handling for all SDK events
 * - Screen state management for active screen tracking
 * - Response routing to appropriate screens
 * - Navigation logic for different event types
 * - React lifecycle integration
 *
 * Usage:
 * ```typescript
 * <SDKEventProvider>
 *   <YourApp />
 * </SDKEventProvider>
 * ```
 */

import React, { createContext, useEffect, useCallback, ReactNode } from 'react';
import rdnaService from '../services/rdnaService';
import NavigationService from '../../tutorial/navigation/NavigationService';
import type {
  RDNAInitializedData,
} from '../types/rdnaEvents';

/**
 * SDK Event Context Interface - Simplified for direct navigation approach
 */
interface SDKEventContextType {}


/**
 * SDK Event Context
 */
const SDKEventContext = createContext<SDKEventContextType | undefined>(undefined);

/**
 * SDK Event Provider Props
 */
interface SDKEventProviderProps {
  children: ReactNode;
}

/**
 * SDK Event Provider Component
 */
export const SDKEventProvider: React.FC<SDKEventProviderProps> = ({ children }) => {

  /**
   * Set up SDK Event Subscriptions on mount
   */
  useEffect(() => {
    const eventManager = rdnaService.getEventManager();
    // Set up event handlers once on mount
    eventManager.setInitializedHandler(handleInitialized);
    // Only cleanup on component unmount
    return () => {
      console.log('SDKEventProvider - Component unmounting, cleaning up event handlers');
      eventManager.cleanup();
    };
  }, []); // Include callback dependencies

  /**
   * Context Value - Simplified for direct navigation approach
   */
  const contextValue: SDKEventContextType = {};


  /**
   * Event handler for successful initialization
   */
  const handleInitialized = useCallback((data: RDNAInitializedData) => {
    console.log('SDKEventProvider - Successfully initialized, Session ID:', data.session.sessionID);

    NavigationService.navigate('TutorialSuccess', {
      statusCode: data.status.statusCode,
      statusMessage: data.status.statusMessage,
      sessionId: data.session.sessionID,
      sessionType: data.session.sessionType,
    });
  }, []);



  return (
    <SDKEventContext.Provider value={contextValue}>
      {children}
    </SDKEventContext.Provider>
  );
};


export default SDKEventProvider;
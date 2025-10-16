/**
 * Push Notification Provider
 *
 * Ultra-simplified provider that initializes Android FCM push notifications
 * and registers tokens directly with REL-ID SDK. No complex state management needed
 * since the pushNotificationService singleton handles everything internally.
 *
 * Usage:
 * <PushNotificationProvider>
 *   <App />
 * </PushNotificationProvider>
 */

import React, { useEffect, ReactNode } from 'react';
import pushNotificationService from '../services/pushNotificationService';

/**
 * Provider props
 */
interface PushNotificationProviderProps {
  children: ReactNode;
}

/**
 * Push Notification Provider Component
 * Simply initializes FCM on mount and lets the service handle everything
 */
export const PushNotificationProvider: React.FC<PushNotificationProviderProps> = ({ children }) => {
  useEffect(() => {
    console.log('PushNotificationProvider - Initializing FCM');

    pushNotificationService
      .initialize()
      .then(() => {
        console.log('PushNotificationProvider - FCM initialization successful');
      })
      .catch((error) => {
        console.error('PushNotificationProvider - FCM initialization failed:', error);
      });
  }, []);

  return <>{children}</>;
};

export default PushNotificationProvider;
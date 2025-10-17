/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {MTDThreatProvider} from './src/uniken/MTDContext';
import {SDKEventProvider} from './src/uniken/providers/SDKEventProvider';
import {PushNotificationProvider} from './src/uniken/providers/PushNotificationProvider';
import { SessionProvider } from './src/uniken/SessionContext';
import {AppNavigator} from './src/tutorial/navigation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SessionProvider>
      <MTDThreatProvider>
        <SDKEventProvider>
          <PushNotificationProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <AppNavigator />
          </PushNotificationProvider>
        </SDKEventProvider>
      </MTDThreatProvider>
    </SessionProvider>
  );
}

export default App;

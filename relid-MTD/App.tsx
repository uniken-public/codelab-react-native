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
import {AppNavigator} from './src/tutorial/navigation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <MTDThreatProvider>
      <SDKEventProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </SDKEventProvider>
    </MTDThreatProvider>
  );
}

export default App;

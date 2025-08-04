import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { navigationRef } from './NavigationService';

import TutorialHomeScreen from '../screens/tutorial/TutorialHomeScreen';
import TutorialErrorScreen from '../screens/tutorial/TutorialErrorScreen';
import TutorialSuccessScreen from '../screens/tutorial/TutorialSuccessScreen';
import { SecurityExitScreen } from '../screens';

export type RootStackParamList = {
  TutorialHome: undefined;
  TutorialError: {
    shortErrorCode: number;
    longErrorCode: number;
    errorString: string;
  };
  TutorialSuccess: {
    statusCode: number;
    statusMessage: string;
    sessionId: string;
    sessionType: number;
  };
  SecurityExit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="TutorialHome">
        <Stack.Screen
          name="TutorialHome"
          component={TutorialHomeScreen}
          options={{
            title: 'RDNA Tutorial',
          }}
        />
        <Stack.Screen
          name="TutorialError"
          component={TutorialErrorScreen}
          options={{
            title: 'Initialization Error',
          }}
        />
        <Stack.Screen
          name="TutorialSuccess"
          component={TutorialSuccessScreen}
          options={{
            title: 'Initialization Success',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
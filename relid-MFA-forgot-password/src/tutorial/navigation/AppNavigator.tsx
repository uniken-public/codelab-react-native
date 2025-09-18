import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { navigationRef } from './NavigationService';

import TutorialHomeScreen from '../screens/tutorial/TutorialHomeScreen';
import TutorialErrorScreen from '../screens/tutorial/TutorialErrorScreen';
import TutorialSuccessScreen from '../screens/tutorial/TutorialSuccessScreen';
import { SecurityExitScreen } from '../screens';

// Import new SDK screens
import { CheckUserScreen, ActivationCodeScreen, UserLDAConsentScreen, SetPasswordScreen, VerifyPasswordScreen, VerifyAuthScreen } from '../../tutorial/screens/mfa';
import DrawerNavigator from './DrawerNavigator';

// Import RDNA types
import type { RDNAGetUserConsentForLDAData, RDNAGetPasswordData, RDNAAddNewDeviceOptionsData } from '../../uniken/types/rdnaEvents';

// Check User Screen Parameters
interface CheckUserScreenParams {
  eventData: any;
  inputType: 'text';
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  responseData?: any; // Direct response data
}

// Activation Code Screen Parameters
interface ActivationCodeScreenParams {
  eventData: any;
  inputType: 'text';
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  attemptsLeft?: number;
  responseData?: any; // Direct response data
}

// User LDA Consent Screen Parameters
interface UserLDAConsentScreenParams {
  eventName: string;
  eventData: RDNAGetUserConsentForLDAData;
  title: string;
  subtitle: string;
  responseData?: RDNAGetUserConsentForLDAData; // Direct response data
}

// Set Password Screen Parameters
interface SetPasswordScreenParams {
  eventName: string;
  eventData: RDNAGetPasswordData;
  title: string;
  subtitle: string;
  responseData?: RDNAGetPasswordData; // Direct response data
}

// Verify Password Screen Parameters
interface VerifyPasswordScreenParams {
  eventData: any;
  inputType: 'password';
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  userID?: string;
  challengeMode?: number;
  attemptsLeft?: number;
  responseData?: any; // Direct response data
}

// Verify Auth Screen Parameters
interface VerifyAuthScreenParams {
  eventName: string;
  eventData: RDNAAddNewDeviceOptionsData;
  title: string;
  subtitle: string;
  responseData?: RDNAAddNewDeviceOptionsData; // Direct response data
}

// Drawer Navigator Parameters
interface DrawerNavigatorParams {
  screen?: string;
  params?: {
    userID: string;
    sessionID: string;
    sessionType: number;
    jwtToken: string;
    loginTime?: string;
    userRole?: string;
    currentWorkFlow?: string;
  };
}

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
  
  // SDK Event-Driven Screens
  CheckUserScreen: CheckUserScreenParams;
  ActivationCodeScreen: ActivationCodeScreenParams;
  UserLDAConsentScreen: UserLDAConsentScreenParams;
  SetPasswordScreen: SetPasswordScreenParams;
  VerifyPasswordScreen: VerifyPasswordScreenParams;
  VerifyAuthScreen: VerifyAuthScreenParams;
  DrawerNavigator: DrawerNavigatorParams;

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
        <Stack.Screen 
          name="SecurityExit" 
          component={SecurityExitScreen}
          options={{
            title: 'Security Exit',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        
        {/* SDK Event-Driven Screens */}
        <Stack.Screen 
          name="CheckUserScreen" 
          component={CheckUserScreen}
          options={{
            title: 'Check User',
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="ActivationCodeScreen" 
          component={ActivationCodeScreen}
          options={{
            title: 'Activation Code',
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="UserLDAConsentScreen" 
          component={UserLDAConsentScreen}
          options={{
            title: 'LDA Consent',
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="SetPasswordScreen" 
          component={SetPasswordScreen}
          options={{
            title: 'Set Password',
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="VerifyPasswordScreen" 
          component={VerifyPasswordScreen}
          options={{
            title: 'Verify Password',
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="VerifyAuthScreen" 
          component={VerifyAuthScreen}
          options={{
            title: 'Additional Device Activation',
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="DrawerNavigator" 
          component={DrawerNavigator}
          options={{
            title: 'Dashboard',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

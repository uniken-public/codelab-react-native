import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/mfa/DashboardScreen';
import { GetNotificationsScreen, NotificationHistoryScreen } from '../screens/notification';
import { UpdatePasswordScreen } from '../screens/updatePassword';
import LDATogglingScreen from '../screens/lda-toggling/LDATogglingScreen';
import { DataSigningInputScreen } from '../screens/dataSigning';
import { DeviceManagementScreen } from '../screens/deviceManagement';
import DrawerContent from '../screens/components/DrawerContent';

// Define the drawer parameter types
export type DrawerParamList = {
  Dashboard: {
    userID: string;
    sessionID: string;
    sessionType: number;
    jwtToken: string;
    loginTime?: string;
    userRole?: string;
    currentWorkFlow?: string;
  };
  GetNotifications: {
    userID: string;
    sessionID: string;
    sessionType: number;
    jwtToken: string;
    loginTime?: string;
    userRole?: string;
    currentWorkFlow?: string;
  };
  NotificationHistory: {
    userID: string;
    sessionID: string;
    sessionType: number;
    jwtToken: string;
    loginTime?: string;
    userRole?: string;
    currentWorkFlow?: string;
  };
  UpdatePassword: {
    eventName: string;
    eventData: any;
    responseData?: any;
  };
  LDAToggling: {
    userID: string;
    sessionID: string;
    sessionType: number;
    jwtToken: string;
    loginTime?: string;
    userRole?: string;
    currentWorkFlow?: string;
  };
  DataSigning: {
    userID: string;
    sessionID: string;
    sessionType: number;
    jwtToken: string;
    loginTime?: string;
    userRole?: string;
    currentWorkFlow?: string;
  };
  DeviceManagement: {
    userID?: string;
  };
};

const Drawer = createDrawerNavigator<DrawerParamList>();

interface DrawerNavigatorProps {
  route: {
    params: {
      params?: {
        userID: string;
        sessionID: string;
        sessionType: number;
        jwtToken: string;
        loginTime?: string;
        userRole?: string;
        currentWorkFlow?: string;
      };
    };
  };
}

const DrawerNavigator: React.FC<DrawerNavigatorProps> = ({ route }) => {
  // Extract params from the nested navigation structure and persist them
  const [persistedUserParams, setPersistedUserParams] = useState(route.params?.params);
  
  // Update persisted params when new params are received
  useEffect(() => {
    if (route.params?.params) {
      console.log('DrawerNavigator - Updating persisted params with:', route.params.params);
      setPersistedUserParams(route.params.params);
    }
  }, [route.params?.params]);
   
   console.log('DrawerNavigator - Received route.params:', route.params);
   console.log('DrawerNavigator - Using persistedUserParams:', persistedUserParams);

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <DrawerContent {...props} userParams={persistedUserParams} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerType: 'front',
        drawerStyle: {
          width: 280,
          backgroundColor: '#fff',
        },
        swipeEnabled: false, // No gesture support as requested
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        initialParams={persistedUserParams}
        options={{
          drawerLabel: 'Dashboard',
        }}
      />
      <Drawer.Screen
        name="GetNotifications"
        component={GetNotificationsScreen}
        initialParams={persistedUserParams}
        options={{
          drawerLabel: 'Get Notifications',
        }}
      />
      <Drawer.Screen
        name="NotificationHistory"
        component={NotificationHistoryScreen}
        initialParams={persistedUserParams}
        options={{
          drawerLabel: 'Notification History',
        }}
      />
      <Drawer.Screen
        name="UpdatePassword"
        component={UpdatePasswordScreen}
        options={{
          drawerLabel: 'Update Password',
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu since it's triggered programmatically
        }}
      />
      <Drawer.Screen
        name="LDAToggling"
        component={LDATogglingScreen}
        initialParams={persistedUserParams}
        options={{
          drawerLabel: 'LDA Toggling',
        }}
      />
      <Drawer.Screen
        name="DataSigning"
        component={DataSigningInputScreen}
        initialParams={persistedUserParams}
        options={{
          drawerLabel: 'Data Signing',
          title: 'Data Signing',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
      <Drawer.Screen
        name="DeviceManagement"
        component={DeviceManagementScreen}
        initialParams={{ userID: persistedUserParams?.userID }}
        options={{
          drawerLabel: 'Device Management',
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

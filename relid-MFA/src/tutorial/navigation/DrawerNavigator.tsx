import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/mfa/DashboardScreen';
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
  // Extract params from the nested navigation structure
  const userParams = route.params?.params || route.params;

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => {
        // Get params from the active route's params (Dashboard screen)
        const activeRoute = props.state.routes[props.state.index];
        const activeRouteParams = activeRoute.params || userParams;
        return <DrawerContent {...props} userParams={activeRouteParams} />;
      }}
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
        initialParams={userParams}
        options={{
          drawerLabel: 'Dashboard',
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
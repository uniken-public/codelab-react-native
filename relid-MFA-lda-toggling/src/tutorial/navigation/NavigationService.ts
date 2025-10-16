import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import type { RootStackParamList } from './AppNavigator';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const NavigationService = {
  navigate: (name: keyof RootStackParamList, params?: any) => {
    if (navigationRef.isReady()) {
      console.log('NavigationService: Navigating to', name, params);
      navigationRef.navigate(name as any, params);
    } else {
      console.warn('NavigationService: Navigation not ready, cannot navigate to', name);
    }
  },

  navigateOrUpdate: (name: keyof RootStackParamList, params?: any) => {
    if (!navigationRef.isReady()) {
      console.warn('NavigationService: Navigation not ready, cannot navigate to', name);
      return;
    }
    
    const currentRoute = navigationRef.getCurrentRoute();
    
    if (currentRoute?.name === name) {
      // Already on target screen - update params with new event data
      navigationRef.setParams(params);
      console.log('NavigationService: Updating existing screen', name, 'with new params');
    } else {
      // Different screen - navigate normally
      navigationRef.navigate(name as any, params);
      console.log('NavigationService: Navigating to new screen', name);
    }
  },

  push: (name: keyof RootStackParamList, params?: any) => {
    if (navigationRef.isReady()) {
      console.log('NavigationService: Pushing to', name, params);
      navigationRef.dispatch(
        CommonActions.navigate({
          name: name as any,
          params,
        })
      );
    } else {
      console.warn('NavigationService: Navigation not ready, cannot push to', name);
    }
  },

  reset: (routeName: keyof RootStackParamList) => {
    if (navigationRef.isReady()) {
      console.log('NavigationService: Resetting navigation to', routeName);
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routeName as any }],
        })
      );
    } else {
      console.warn('NavigationService: Navigation not ready, cannot reset to', routeName);
    }
  },

  isReady: () => {
    return navigationRef.isReady();
  },

  getCurrentRoute: () => {
    if (navigationRef.isReady()) {
      return navigationRef.getCurrentRoute();
    }
    return null;
  }
};

export default NavigationService;

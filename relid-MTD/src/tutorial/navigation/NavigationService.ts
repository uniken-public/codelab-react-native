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

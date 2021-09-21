import SplashScreen from 'react-native-splash-screen';

import { navigationRef } from 'shoutem.navigation';

import { ext } from '../const';

export const openInitialScreen = subscriptionValid => {
  if (subscriptionValid === false) {
    navigationRef.current?.navigate(ext(), {
      screen: ext('SubscriptionMissingScreen'),
    });
  }

  SplashScreen.hide();
};

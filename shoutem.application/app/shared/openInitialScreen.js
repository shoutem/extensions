import SplashScreen from 'react-native-splash-screen';

import { navigateTo, setNavigationInitialized } from 'shoutem.navigation';

import { executeShortcut } from '../redux';
import { ext } from '../const';
import { getFirstShortcut } from './getFirstShortcut';

export const openInitialScreen = (app, subscriptionValid) => {
  const store = app.getStore();
  const state = store.getState();

  if (subscriptionValid === false) {
    store.dispatch(navigateTo({ screen: ext('SubscriptionMissingScreen') }));
    SplashScreen.hide();
    return;
  }

  const firstShortcut = getFirstShortcut(state);
  if (firstShortcut) {
    // Initial navigation action has some constraints on the navigation actions,
    // @see initialNavigationReducer in shoutem-core/navigation
    store.dispatch(executeShortcut(firstShortcut.id));
    store.dispatch(setNavigationInitialized());
    SplashScreen.hide();
  }
};

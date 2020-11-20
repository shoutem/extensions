import SplashScreen from 'react-native-splash-screen';

import { navigateTo, setNavigationInitialized } from 'shoutem.navigation';

import { executeShortcut } from '../redux';
import { ext } from '../const';
import { getFirstShortcut } from './getFirstShortcut';

export const openInitialScreen = (subscriptionValid) => {
  return (dispatch, getState) => {
    const state = getState();

    if (subscriptionValid === false) {
      return dispatch(navigateTo({ screen: ext('SubscriptionMissingScreen') }))
        .then(() => SplashScreen.hide());
    }

    const firstShortcut = getFirstShortcut(state);
    if (firstShortcut) {
      // Initial navigation action has some constraints on the navigation actions,
      // @see initialNavigationReducer in shoutem-core/navigation
      return dispatch(executeShortcut(firstShortcut.id))
        .then(() => dispatch(setNavigationInitialized()))
        .then(() => SplashScreen.hide());
    }
  }
};

import { BackAndroid, ToastAndroid } from 'react-native';

import { getActiveNavigationStackState, navigateBack } from '@shoutem/core/navigation';

// The time duration after the first back button press during
// which the user is able to immediately exit the app.
const allowAppExitDurationMs = 3000;
let exitAppConfirmationVisible = false;

export const appWillMount = (app) => {
  const store = app.getStore();
  BackAndroid.addEventListener('hardwareBackPress', () => {
    const state = store.getState();
    const navState = getActiveNavigationStackState(state);
    if (navState && navState.routes && (navState.routes.length > 1)) {
      // There are routes in the navigation history, we want to go
      // back to the previous screen in this case.
      store.dispatch(navigateBack());
      return true;
    }

    if (!exitAppConfirmationVisible) {
      exitAppConfirmationVisible = true;
      ToastAndroid.show('Press back again to exit', ToastAndroid.LONG);
      setTimeout(() => {
        exitAppConfirmationVisible = false;
      }, allowAppExitDurationMs);
      return true;
    }

    // We didn't handle the back button press, allow the
    // default back button behavior.
    return false;
  });
};

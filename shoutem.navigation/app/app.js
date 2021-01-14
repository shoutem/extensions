import React from 'react';
import { BackHandler, ToastAndroid } from 'react-native';
import { canonicalRenderResource } from 'shoutem-core';
import { getExtensionSettings } from 'shoutem.application/redux';
import { I18n } from 'shoutem.i18n';
import { getActiveNavigationStackState, navigateBack } from './redux/core';
import { RootScreenStack } from './components/stacks';
import { NavigationBar } from './components/ui';
import { ext } from './const';

// The time duration after the first back button press during
// which the user is able to immediately exit the app.
const allowAppExitDurationMs = 3000;
let exitAppConfirmationVisible = false;

export const appWillMount = (app) => {
  const store = app.getStore();

  BackHandler.addEventListener('hardwareBackPress', () => {
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
      ToastAndroid.show(I18n.t(ext('androidExitMessage')), ToastAndroid.LONG);
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

export const appDidMount = (app) => {
  const state = app.getState();
  const settings = getExtensionSettings(state, ext());
  const {
    backgroundImage,
    backgroundImageEnabledFirstScreen,
    showTitle,
    fitContainer,
  } = settings;

  // Setup background image of the NavigationBar component for all screens
  if (backgroundImage && !backgroundImageEnabledFirstScreen) {
    NavigationBar.globalNavigationBarImage = backgroundImage;
  }
  NavigationBar.showTitle = showTitle;
  NavigationBar.fitContainer = fitContainer;
};

export function render() {
  const renderKey = canonicalRenderResource(ext(), 'RootScreenStack');

  return (
      <RootScreenStack key={renderKey} styleName="root" />
  );
}

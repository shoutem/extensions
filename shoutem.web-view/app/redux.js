import { navigateTo } from 'shoutem.navigation';
import { getShortcut } from 'shoutem.application';

import { ext } from './const';

const getWebViewRoute = (url, title, showNavigationToolbar = true, requireLocationPermission = false) => ({
  screen: ext('WebViewWithShareScreen'),
  props: {
    url,
    title,
    showNavigationToolbar,
    requireLocationPermission,
  },
});

export const OPEN_EXTERNAL_BROWSER = 'OPEN_EXTERNAL_BROWSER';

function openExternalBrowserActionCreator(url) {
  return ({
    type: OPEN_EXTERNAL_BROWSER,
    url,
  });
}

// Shoutem specified actions
export function openURL(url, title, showNavigationToolbar, requireLocationPermission) {
  return navigateTo(getWebViewRoute(url, title, showNavigationToolbar, requireLocationPermission));
}

export function openUrlInExternalBrowser(state, action) {
  const shortcut = getShortcut(state, action.shortcutId);

  const { url } = shortcut.settings || {};

  return openExternalBrowserActionCreator(url);
}

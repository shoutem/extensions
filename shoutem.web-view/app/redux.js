import { openInModal } from 'shoutem.navigation';

import { ext } from './const';

export const OPEN_EXTERNAL_BROWSER = 'OPEN_EXTERNAL_BROWSER';

function openExternalBrowserActionCreator(url) {
  return {
    type: OPEN_EXTERNAL_BROWSER,
    url,
  };
}

// Shoutem specified actions
export function openURL(
  url,
  title,
  showNavigationToolbar = true,
  requireGeolocationPermission = false,
  webViewProps = {},
) {
  return openInModal(ext('WebViewWithShareScreen'), {
    url,
    title,
    showNavigationToolbar,
    requireGeolocationPermission,
    webViewProps,
  });
}

export function openUrlInExternalBrowser(shortcut) {
  const { url } = shortcut.settings || {};

  return openExternalBrowserActionCreator(url);
}

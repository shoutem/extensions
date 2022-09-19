import { openInModal } from 'shoutem.navigation';
import { ext } from '../const';

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
  otherRouteParams,
  screenOptions = {},
) {
  const showSharing = screenOptions.showSharing ?? true;
  const screenToOpen = showSharing ? 'WebViewWithShareScreen' : 'WebViewScreen';

  return openInModal(ext(screenToOpen), {
    url,
    title,
    showNavigationToolbar,
    requireGeolocationPermission,
    webViewProps,
    ...otherRouteParams,
  });
}

export function openUrlInExternalBrowser(shortcut) {
  const { url } = shortcut.settings || {};

  return openExternalBrowserActionCreator(url);
}

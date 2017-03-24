import { navigateTo } from '@shoutem/core/navigation';
import { getShortcut } from 'shoutem.application';

import { ext } from './const';

export const OPEN_EXTERNAL_BROWSER = 'OPEN_EXTERNAL_BROWSER';

export function openExternalBrowserActionCreator(url) {
  return ({
    type: OPEN_EXTERNAL_BROWSER,
    url,
  });
}
// Shoutem specified actions
export function openURL(url, title, showNavigationToolbar = true) {
  return navigateTo({
    screen: ext('WebViewScreen'),
    props: {
      url,
      title,
      showNavigationToolbar,
    },
  },
  );
}

export function openWebViewScreen(state, action) {
  const shortcut = getShortcut(state, action.shortcutId);
  const { title } = shortcut;
  const {
    url,
    showNavigationToolbar,
    openExternalBrowser,
  } = shortcut.settings;

  if (openExternalBrowser) {
    return openExternalBrowserActionCreator(url);
  }

  const openUrlAction = openURL(url, title, showNavigationToolbar);
  openUrlAction.operation = action.navigationOperation || openUrlAction.operation;
  openUrlAction.navigationStack = action.navigationStack;
  return openUrlAction;
}

import { createNavigationAction, navigateTo } from '@shoutem/core/navigation';
import { getShortcut } from 'shoutem.application';

import { ext } from './const';

const getWebViewRoute = (url, title, showNavigationToolbar = true) => ({
  screen: ext('WebViewScreen'),
  props: {
    url,
    title,
    showNavigationToolbar,
  },
});

// Shoutem specified actions
export function openURL(url, title, showNavigationToolbar) {
  return navigateTo(getWebViewRoute(url, title, showNavigationToolbar));
}

export function openWebViewScreen(state, action) {
  const shortcut = getShortcut(state, action.shortcutId);
  const { title } = shortcut;
  const {
    url,
    showNavigationToolbar,
  } = shortcut.settings;

  const route = getWebViewRoute(url, title, showNavigationToolbar);

  const { navigationAction, navigationStack } = action;

  const actionToDispatch = createNavigationAction(navigationAction, route, navigationStack);

  return actionToDispatch;
}

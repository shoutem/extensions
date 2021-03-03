import SubscriptionMissingScreen from './screens/SubscriptionMissingScreen';
import enTranslations from './translations/en.json';
import { initializeApp, appActions } from './app';
import {
  resolveScreenLayout,
  navigateToShortcutScreen,
  createExecuteShortcutActionMiddleware,
  injectShortcutIdToActionRouteContext,
  noInternetMiddleware,
  restartAppMiddleware,
  appInitQueueMiddleware,
} from './middleware';
import { executeShortcut, fetchConfiguration } from './redux';

export { AppInitQueue } from './services';
export { default as configuration } from './configuration.json';
export { default as buildConfig } from './buildConfig.json';

export {
  default as RemoteDataListScreen,

  // For backwards compatibility only,
  // remove this when all extensions have been updated.
  default as ListScreen,
} from './screens/RemoteDataListScreen';

export { isConfigurationLoaded } from './shared/isConfigurationLoaded';
export { resolveAppEndpoint } from './shared/resolveAppEndpoint';
export { openInitialScreen } from './shared/openInitialScreen';
export { getFirstShortcut } from './shared/getFirstShortcut';
export { isProduction } from './shared/isProduction';
export { isRelease } from './shared/isRelease';

export { InlineMap } from './components/InlineMap';
export { MapView } from './components/MapView';

export {
  CONFIGURATION_SCHEMA,
  EXTENSIONS_SCHEMA,
  ext,
} from './const';

export {
  appWillMount,
  appDidMount,
  appWillUnmount,
  getAppId,
  isDevelopment,
} from './app';

export {
  default as reducer,
  RESTART_APP,
  executeShortcut,
  getExtensionSettings,
  getConfiguration,
  getSubscriptionValidState,
  showAllShortcuts,
  showShortcut,
  hideShortcut,
  getShortcut,
  getAllShortcuts,
  getActiveShortcut,
  isShortcutVisible,
  restartApp,
  setQueueTargetComplete,
  getExtensionCloudUrl,
} from './redux';

export const actions = {
  executeShortcut,
  fetchConfiguration,
};

export const middleware = [
  createExecuteShortcutActionMiddleware(appActions),
  navigateToShortcutScreen,
  resolveScreenLayout,
  injectShortcutIdToActionRouteContext,
  noInternetMiddleware,
  restartAppMiddleware,
  appInitQueueMiddleware,
];

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export const screens = { SubscriptionMissingScreen };

initializeApp();

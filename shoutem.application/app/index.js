import './navigation';
import SubscriptionMissingScreen from './screens/SubscriptionMissingScreen';
import enTranslations from './translations/en.json';
import {
  navigationInitializedMiddleware,
  noInternetMiddleware,
  restartAppMiddleware,
} from './middleware';

export {
  appActions,
  appDidMount,
  appWillMount,
  appWillUnmount,
  getAppId,
  isDevelopment,
} from './app';
export { default as buildConfig } from './buildConfig.json';
export { InlineMap } from './components/InlineMap';
export { MapView } from './components/MapView';
export { default as configuration } from './configuration.json';
export { CONFIGURATION_SCHEMA, ext, EXTENSIONS_SCHEMA } from './const';
export {
  getAllShortcuts,
  getAppInitQueueComplete,
  getConfiguration,
  getExtensionCloudUrl,
  getExtensionServiceUrl,
  getExtensionSettings,
  getHiddenShortcuts,
  getShortcut,
  getSubscriptionValidState,
  hideShortcuts,
  isShortcutVisible,
  QUEUE_TARGET_COMPLETED,
  default as reducer,
  RESTART_APP,
  restartApp,
  setQueueTargetComplete,
  showAllShortcuts,
  showShortcut,
} from './redux';
export {
  // For backwards compatibility only,
  // remove this when all extensions have been updated.
  default as ListScreen,
  default as RemoteDataListScreen,
} from './screens/RemoteDataListScreen';
export { AppInitQueue } from './services';
export { getFirstShortcut } from './shared/getFirstShortcut';
export { isConfigurationLoaded } from './shared/isConfigurationLoaded';
export { isProduction } from './shared/isProduction';
export { isRelease } from './shared/isRelease';
export { openInitialScreen } from './shared/openInitialScreen';
export { resolveAppEndpoint } from './shared/resolveAppEndpoint';

export const middleware = [
  noInternetMiddleware,
  restartAppMiddleware,
  navigationInitializedMiddleware,
];

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export const screens = { SubscriptionMissingScreen };

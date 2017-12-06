import configuration from './configuration.json';
import buildConfig from './buildConfig.json';

import RemoteDataListScreen from './screens/RemoteDataListScreen';
import DeviceInfo from './services/device-info';

import {
  resolveScreenLayout,
  navigateToShortcutScreen,
  createExecuteShortcutActionMiddleware,
  injectShortcutIdToActionRouteContext,
  noInternetMiddleware,
} from './middleware';
import { openInitialScreen } from './shared/openInitialScreen';
import { isConfigurationLoaded } from './shared/isConfigurationLoaded';
import { isProduction } from './shared/isProduction';
import { isRelease } from './shared/isRelease';
import { getFirstShortcut } from './shared/getFirstShortcut';
import {
  CONFIGURATION_SCHEMA,
  EXTENSIONS_SCHEMA,
} from './const';
import {
  initializeApp,
  appWillMount,
  appDidMount,
  appDidFinishLaunching,
  appWillUnmount,
  appActions,
  getAppId,
  isDevelopment,
} from './app';
import { resolveAppEndpoint } from './shared/resolveAppEndpoint';

import reducer, {
  executeShortcut,
  fetchConfiguration,
  getExtensionSettings,
  getConfiguration,
  showAllShortcuts,
  showShortcut,
  hideShortcut,
  getShortcut,
  getAllShortcuts,
  getActiveShortcut,
  isShortcutVisible,
} from './redux';

import enTranslations from './translations/en.json';

const actions = {
  executeShortcut,
  fetchConfiguration,
};

const middleware = [
  createExecuteShortcutActionMiddleware(appActions),
  navigateToShortcutScreen,
  resolveScreenLayout,
  injectShortcutIdToActionRouteContext,
  noInternetMiddleware,
];

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

initializeApp();
export {
  CONFIGURATION_SCHEMA,
  EXTENSIONS_SCHEMA,

  buildConfig,
  configuration,

  getAppId,
  getConfiguration,
  getShortcut,
  getExtensionSettings,
  getActiveShortcut,
  getFirstShortcut,
  getAllShortcuts,
  isShortcutVisible,
  isConfigurationLoaded,
  isProduction,
  isDevelopment,
  isRelease,

  RemoteDataListScreen,
  // For backwards compatibility only,
  // remove this when all extensions have been updated.
  RemoteDataListScreen as ListScreen,

  executeShortcut,
  openInitialScreen,
  resolveAppEndpoint,
  showAllShortcuts,
  showShortcut,
  hideShortcut,

  actions,
  reducer,
  middleware,
  appWillMount,
  appDidMount,
  appDidFinishLaunching,
  appWillUnmount,

  DeviceInfo,
};

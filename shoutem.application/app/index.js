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
  restartAppMiddleware,
} from './middleware';

import { isConfigurationLoaded } from './shared/isConfigurationLoaded';
import { resolveAppEndpoint } from './shared/resolveAppEndpoint';
import { openInitialScreen } from './shared/openInitialScreen';
import { getFirstShortcut } from './shared/getFirstShortcut';
import { isProduction } from './shared/isProduction';
import { isRelease } from './shared/isRelease';

import { InlineMap } from './components/InlineMap';
import { MapView } from './components/MapView';

import {
  CONFIGURATION_SCHEMA,
  EXTENSIONS_SCHEMA,
  ext,
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

import reducer, {
  RESTART_APP,
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
  restartApp,
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
  restartAppMiddleware,
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
  RESTART_APP,

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

  InlineMap,
  MapView,

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
  restartApp,

  ext,
};

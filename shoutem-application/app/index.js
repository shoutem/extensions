import configuration from './configuration.json';
import buildConfig from './buildConfig.json';

import ListScreen from './components/ListScreen';

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
  isPreviewMode,
} from './app';
import { resolveAppEndpoint } from './shared/resolveAppEndpoint';

import reducer, {
  executeShortcut,
  fetchConfiguration,
  getExtensionSettings,
  getConfiguration,
  getShortcut,
  getActiveShortcut,
} from './redux';

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
  isConfigurationLoaded,
  isPreviewMode,
  isProduction,
  isRelease,

  ListScreen,

  executeShortcut,
  openInitialScreen,
  resolveAppEndpoint,

  actions,
  reducer,
  middleware,
  appWillMount,
  appDidMount,
  appDidFinishLaunching,
  appWillUnmount,
};

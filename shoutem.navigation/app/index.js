import Drawer from './screens/Drawer';
import TabBar from './screens/TabBar';
import IconGrid from './screens/IconGrid';
import Modal from './screens/Modal';
import List from './screens/List';
import CardList from './screens/CardList';
import None from './screens/None';
import Tab from './screens/Tab';
import NoScreens from './screens/NoScreens';
import { ScreenStack, RootScreenStack } from './components/stacks';
import TileGrid from './screens/TileGrid';
import reducer, { middleware } from './redux';
import enTranslations from './translations/en.json';

export const screens = {
  TabBar,
  Tab,
  Drawer,
  None,
  NoScreens,
  IconGrid,
  List,
  CardList,
  Modal,
  TileGrid,
};

export const actions = {};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export {
  ROOT_NAVIGATION_STACK,
  SET_ACTIVE_NAVIGATION_STACK,
  NAVIGATE,
  NAVIGATE_BACK,
  JUMP_TO_INDEX,
  JUMP_TO_KEY,
  REPLACE,
  REPLACE_AT_INDEX,
  REPLACE_AT_KEY,
  RESET,
  RESET_TO_ROUTE,
  OPEN_MODAL,
  CLOSE_MODAL,
  SET_SCREEN_STATE,
  CLEAR_SCREEN_STATE,
  createNavigationAction,
  navigateTo,
  navigateBack,
  redirectTo,
  jumpToKey,
  jumpToIndex,
  replace,
  reset,
  resetToRoute,
  openInModal,
  closeModal,
  rewrite,
  clearScreenState,
  setActiveNavigationStack,
  setScreenState,
  hasRouteWithKey,
  isEmptyNavigationState,
  isEmptyRoute,
  isNavigationAction,
  isScreenActive,
  sanitizeRoute,

  createActiveNavigationStackReducer,
  createNavigationReducer,
  navigationCoreReducer,
  navigationCoreMiddleware,
  screenStateReducer,
  coreReducer,

  getActiveNavigationStack,
  getActiveNavigationStackState,
  getActiveRoute,
  getScreenState,
} from './redux/core';

export * from './components/ui';

export {
  reducer,
  middleware,
  ScreenStack,
  RootScreenStack,
};

export {
  appWillMount,
  appDidMount,
  render,
} from './app';

export {
  createSubNavigationScreen,
  isTabBarNavigation,
} from './helpers';

export { default as CardList } from './components/CardList';
export { default as FolderBase } from './components/FolderBase';
export { default as IconGrid } from './components/IconGrid';
export { default as List } from './components/List';
export { default as TileGrid } from './components/TileGrid';

export { NavigationBaseItem } from './components/NavigationBaseItem';

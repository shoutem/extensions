import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import IconGrid from './screens/IconGrid';
import List from './screens/List';
import CardList from './screens/CardList';
import None from './screens/None';
import NoScreens from './screens/NoScreens';
import TileGrid from './screens/TileGrid';
import enTranslations from './translations/en.json';

import './navigation';

export const screens = {
  None,
  NoScreens,
  IconGrid,
  List,
  CardList,
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

export * from './components/ui';

export { render } from './app';
export {
  reducer,
  getNavInitialized,
  SET_NAVIGATION_INITIALIZED,
  isTabBarNavigation,
} from './redux';

export {
  getRouteParams,
  HeaderStyles,
  ModalScreens,
  openInModal,
  closeModal,
  navigateTo,
  goBack,
  replace,
  push,
  getCurrentRoute,
  navigate,
  NavigationStacks,
  Decorators,
  composeNavigationStyles,
  BackHandlerAndroid,
} from './services';

export {
  FocusTriggerBase,
  withIsFocused,
  withChildrenRequired,
  withChildrenRequired as shortcutChildrenRequired,
  withBackHandling,
  withSubNavigationScreen,
} from './hoc';

export { MODAL, navigationRef, MAIN_NAVIGATION_SCREEN_TYPES } from './const';

export { List, IconGrid };

export { NavigationBaseItem } from './components/NavigationBaseItem';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

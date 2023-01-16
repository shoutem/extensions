import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import './navigation';
import CardList from './screens/CardList';
import IconGrid from './screens/IconGrid';
import List from './screens/List';
import None from './screens/None';
import NoScreens from './screens/NoScreens';
import TileGrid from './screens/TileGrid';
import enTranslations from './translations/en.json';

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

export { render } from './app';
export * from './components/ui';
export { MAIN_NAVIGATION_SCREEN_TYPES, MODAL, navigationRef } from './const';
export {
  FocusTriggerBase,
  withChildrenRequired as shortcutChildrenRequired,
  withBackHandling,
  withChildrenRequired,
  withIsFocused,
  withSubNavigationScreen,
} from './hoc';
export {
  getNavInitialized,
  isTabBarNavigation,
  reducer,
  SET_NAVIGATION_INITIALIZED,
} from './redux';
export {
  BackHandlerAndroid,
  closeModal,
  composeNavigationStyles,
  Decorators,
  getCurrentRoute,
  getRouteParams,
  goBack,
  HeaderStyles,
  ModalScreens,
  navigateTo,
  NavigationStacks,
  openInModal,
  push,
  replace,
} from './services';

export { IconGrid, List };

export { NavigationBaseItem } from './components/NavigationBaseItem';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

import Drawer from './screens/Drawer';
import TabBar from './screens/TabBar';
import IconGrid from './screens/IconGrid';
import Modal from './screens/Modal';
import List from './screens/List';
import CardList from './screens/CardList';
import None from './screens/None';
import Tab from './screens/Tab';
import NoScreens from './screens/NoScreens';

import reducer, {
  CLOSE_MODAL,
  OPEN_MODAL,
  openInModal,
  closeModal,
  middleware,
} from './redux';

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
};

export {
  CLOSE_MODAL,
  OPEN_MODAL,
  openInModal,
  closeModal,
};

export const actions = {};

export { reducer, middleware };

export {
  appWillMount,
} from './app';

import IconsPage from './iconsPage';
import List from './layoutSettings/list';
import CardList from './layoutSettings/cardList';
import None from './layoutSettings/None';
import IconGrid from './layoutSettings/iconGrid';
import TileGrid from './layoutSettings/tileGrid';
import Drawer from './layoutSettings/drawer';
import TabBar from './layoutSettings/tabbar';
import NavigationBarPage from './navigationBarPage';

import reducer from './reducer';
import { createDenormalizer } from 'denormalizer';
import { store } from 'context';

const adminPages = {
  IconsPage,
  List,
  TileGrid,
  CardList,
  None,
  IconGrid,
  Drawer,
  TabBar,
  NavigationBarPage,
};

export { adminPages, reducer };

createDenormalizer(store.getState);

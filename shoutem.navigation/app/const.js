// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const NO_SCREENS_ROUTE = { screen: ext('NoScreens') };

export const TAB_BAR = ext('TabBar');
export const DRAWER = ext('Drawer');
export const LIST = ext('List');
export const CARD_LIST = ext('CardList');
export const ICON_GRID = ext('IconGrid');
export const TILE_GRID = ext('TileGrid');


export const TAB_BAR_ITEM_HEIGHT = 60;
export {
  IPHONE_X_HOME_INDICATOR_PADDING,
  IPHONE_X_NOTCH_PADDING,
  NAVIGATION_HEADER_HEIGHT,
} from '@shoutem/ui';

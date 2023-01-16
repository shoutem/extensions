// This file is auto-generated.
import React from 'react';
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const navigationRef = React.createRef();

export const NO_SCREENS = ext('NoScreens');
export const TAB_BAR = ext('TabBar');
export const DRAWER = ext('Drawer');
export const GRID_STACK = ext('GridStack');
export const LIST = ext('List');
export const CARD_LIST = ext('CardList');
export const ICON_GRID = ext('IconGrid');
export const TILE_GRID = ext('TileGrid');
export const NONE = ext('None');
export const NO_CONTENT = ext('NoContent');
export const MODAL = ext('Modal');

export const MAIN_NAVIGATION_SCREEN_TYPES = [
  TAB_BAR,
  DRAWER,
  LIST,
  CARD_LIST,
  ICON_GRID,
  TILE_GRID,
  NONE,
];

export const TAB_BAR_ITEM_HEIGHT = 60;

export {
  IPHONE_X_HOME_INDICATOR_PADDING,
  IPHONE_X_NOTCH_PADDING,
  IPHONE_XR_NOTCH_PADDING,
  NAVIGATION_HEADER_HEIGHT,
} from '@shoutem/ui';

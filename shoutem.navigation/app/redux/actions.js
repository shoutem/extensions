import { ext } from '../const';

export const SET_NAVIGATION_INITIALIZED = ext('SET_NAVIGATION_INITIALIZED');
export const NAVIGATION_ITEM_PRESSED = ext('NAVIGATION_ITEM_PRESSED');

export const setNavigationInitialized = () => ({
  type: SET_NAVIGATION_INITIALIZED,
});

export const navItemPressed = shortcut => ({
  type: NAVIGATION_ITEM_PRESSED,
  payload: shortcut,
});

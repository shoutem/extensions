import * as extension from './extension';

const { PageScreen } = extension.screens;

export const screens = {
  ...extension.screens,
  ClearNavbarLargePageScreen: PageScreen,
  SolidNavbarLargePageScreen: PageScreen,
  ClearNavbarMediumPageScreen: PageScreen,
  SolidNavbarMediumPageScreen: PageScreen,
};

export { PAGE_SHORTCUT_NAME } from './const';
export { reducer } from './redux';

export const { themes } = extension;

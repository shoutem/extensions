import * as extension from './extension';
import { localeChangedMiddleware } from './redux';

const { PageScreen } = extension.screens;

export const screens = {
  ...extension.screens,
  ClearNavbarLargePageScreen: PageScreen,
  SolidNavbarLargePageScreen: PageScreen,
  ClearNavbarMediumPageScreen: PageScreen,
  SolidNavbarMediumPageScreen: PageScreen,
};

export { reducer } from './redux';

export const middleware = [localeChangedMiddleware];
export const { themes } = extension;

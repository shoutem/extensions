import * as extension from './extension.js';
import reducer from './reducers';

import AboutScreen, {
  AboutScreen as AboutScreenComponent,
} from './screens/AboutScreen';

export const components = {
  AboutScreen: AboutScreenComponent,
};

export const screens = {
  ...extension.screens,
  AboutScreen,
  SolidNavbarLargeAboutScreen: AboutScreen,
  ClearNavbarMediumAboutScreen: AboutScreen,
  SolidNavbarMediumAboutScreen: AboutScreen,
};

export const themes = extension.themes;

export { reducer };

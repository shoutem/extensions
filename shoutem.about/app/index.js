import AboutScreen, {
  AboutScreen as AboutScreenComponent,
} from './screens/AboutScreen';
import * as extension from './extension';
import { reducer } from './redux';

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

export const { themes } = extension;

export { reducer };

import reducer from './reducers';

import AboutScreen, {
  AboutScreen as AboutScreenComponent,
} from './screens/AboutScreen';

import MapScreen from './screens/MapScreen';

export const components = {
  AboutScreen: AboutScreenComponent,
};

export const screens = {
  AboutScreen,
  MapScreen,
};

export { reducer };

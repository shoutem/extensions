import BrowserScreen from './screens/BrowserScreen';
import * as actions from './redux';
import {
  openBrowserScreen,
} from './middleware';

const screens = {
  BrowserScreen,
};

const middleware = [
  openBrowserScreen,
];

const { openURL } = actions;

export {
  screens,
  middleware,
  actions,
  openURL,
};

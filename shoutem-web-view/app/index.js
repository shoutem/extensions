import WebViewScreen from './screens/WebViewScreen';
import * as actions from './redux';

const screens = {
  WebViewScreen,
};

const { openURL } = actions;

export {
  screens,
  actions,
  openURL,
};

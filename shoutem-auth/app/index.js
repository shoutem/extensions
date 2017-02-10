// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import reducer, {
  getUser,
  getAccessToken,
  authenticate,
  logoutAction,
  isAuthenticated,
} from './redux.js';

import _ from 'lodash';

import {
  createLoginMiddleware,
  createNetworkRequestMiddleware,
  logoutMiddleware,
} from './middleware.js';

import { loginRequired } from './loginRequired';

const appScreens = {};
function appWillMount(app) {
  _.map(app.getScreens(), (Screen, screenName) => { appScreens[screenName] = Screen; });
}

export const screens = {
  LoginScreen,
  RegisterScreen,
};

export { reducer };

export const actions = {
  logoutAction,
};

const middleware = [
  createLoginMiddleware(appScreens),
  createNetworkRequestMiddleware(),
  logoutMiddleware,
];

export { appDidMount } from './app';

export {
  appWillMount,
  appScreens,
  middleware,
  getUser,
  getAccessToken,
  authenticate,
  loginRequired,
  isAuthenticated,
};

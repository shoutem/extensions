// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import _ from 'lodash';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import reducer, {
  getUser,
  getAccessToken,
  authenticate,
  logoutAction,
  isAuthenticated,
  RESTORE_SESSION,
} from './redux';

import { getSession } from './session';

import {
  createLoginMiddleware,
  networkRequestMiddleware,
  logoutMiddleware,
} from './middleware';

import { loginRequired } from './loginRequired';

const appScreens = {};
function appDidMount(app) {
  const { dispatch } = app.getStore();

  _.each(app.getScreens(), (Screen, screenName) => { appScreens[screenName] = Screen; });

  return getSession().then(
    session => session && dispatch({
      type: RESTORE_SESSION,
      payload: JSON.parse(session),
    }),
  );
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
  networkRequestMiddleware,
  logoutMiddleware,
];

export {
  appDidMount,
  appScreens,
  middleware,
  getUser,
  getAccessToken,
  authenticate,
  loginRequired,
  isAuthenticated,
};

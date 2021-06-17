// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import _ from 'lodash';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import PasswordRecoveryScreen from './screens/PasswordRecoveryScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';

import reducer, {
  getUser,
  getUserGroups,
  getAccessToken,
  authenticate,
  logoutAction,
  isAuthenticated,
  isUserUpdateAction,
  openProfile,
  register,
  RESTORE_SESSION,
  LOGIN,
  LOGOUT,
  REGISTER,
  USER_SCHEMA,
  updateProfile,
  userRegistered,
  REAUTHENTICATE_FAILED,
} from './redux';

import {
  createLoginMiddleware,
  networkRequestMiddleware,
  logoutMiddleware,
  userUpdatedMiddleware,
  authenticateMiddleware,
} from './middleware';

import { loginRequired } from './loginRequired';
import { saveSession } from './session';
import { getErrorCode, getErrorMessage } from './errorMessages';

import enTranslations from './translations/en.json';

const appScreens = {};

function appWillMount(app) {
  _.each(app.getScreens(), (Screen, screenName) => {
    appScreens[screenName] = Screen;
  });
}

export const screens = {
  LoginScreen,
  RegisterScreen,
  UserProfileScreen,
  EditProfileScreen,
  MyProfileScreen,
  PasswordRecoveryScreen,
  ChangePasswordScreen,
};

export { reducer };

export const actions = {
  logoutAction,
};

const middleware = [
  createLoginMiddleware(appScreens),
  networkRequestMiddleware,
  logoutMiddleware,
  userUpdatedMiddleware,
  authenticateMiddleware,
];

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { appDidMount, appWillUnmount } from './app';

export {
  appWillMount,
  appScreens,
  middleware,
  getUser,
  getUserGroups,
  getAccessToken,
  getErrorCode,
  getErrorMessage,
  authenticate,
  loginRequired,
  isAuthenticated,
  register,
  saveSession,
  userRegistered,
  isUserUpdateAction,
  openProfile,
  updateProfile,
  LOGIN,
  LOGOUT,
  REGISTER,
  RESTORE_SESSION,
  REAUTHENTICATE_FAILED,
  USER_SCHEMA,
};

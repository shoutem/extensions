// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import _ from 'lodash';
import { AppInitQueue } from 'shoutem.application';
import { ext } from './const';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import PasswordRecoveryScreen from './screens/PasswordRecoveryScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import ConfirmDeletionScreen from './screens/ConfirmDeletionScreen';
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
  networkRequestMiddleware,
  logoutMiddleware,
  userUpdatedMiddleware,
} from './middleware';

import { loginRequired, withLoginRequired } from './loginRequired';
import { saveSession } from './session';
import { getErrorCode, getErrorMessage } from './errorMessages';

import enTranslations from './translations/en.json';

import './navigation';

AppInitQueue.addExtension(ext());

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
  ConfirmDeletionScreen,
};

export { reducer };

export const actions = {
  logoutAction,
};

const middleware = [
  networkRequestMiddleware,
  logoutMiddleware,
  userUpdatedMiddleware,
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
  withLoginRequired,
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

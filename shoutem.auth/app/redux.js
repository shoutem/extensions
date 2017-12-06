import _ from 'lodash';

import { combineReducers } from 'redux';

import {
  find,
  resource,
  update,
  one,
  storage,
  getOne,
  create,
  isBusy,
  isInitialized,
  isValid,
} from '@shoutem/redux-io';
import { chainReducers } from '@shoutem/redux-composers';
import { preventStateRehydration } from '@shoutem/core/preventStateRehydration';
import { navigateTo } from '@shoutem/core/navigation';

import {
  getAppId,
  getAllShortcuts,
  getExtensionSettings,
  showAllShortcuts,
  hideShortcut,
} from 'shoutem.application';
import { I18n } from 'shoutem.i18n';

import { ext } from './const';

import encodeToBase64 from './shared/encodeToBase64';

export const LOGIN = 'shoutem.auth.LOGIN';
export const LOGOUT = 'shoutem.auth.LOGOUT';
export const AUTHENTICATE = 'shoutem.auth.AUTHENTICATE';
export const RESTORE_SESSION = 'shoutem.auth.RESTORE_SESSION';
export const REGISTER = 'shoutem.auth.REGISTER';
export const SET_ACCESS_TOKEN = 'shoutem.auth.SET_ACCESS_TOKEN';

export const USER_SCHEMA = 'shoutem.core.users';
export const USER_PROFILE_SCHEMA = 'shoutem.auth.user-profile';
export const USER_PROFILE_IMAGE_SCHEMA = 'shoutem.auth.user-profile-image';
export const USER_CREDENTIALS_SCHEMA = 'shoutem.auth.user-credentials';
export const AUTH_TOKEN_SCHEMA = 'shoutem.auth.tokens';
export const USER_FACEBOOK_CREDENTIALS_SCHEMA = 'shoutem.auth.user-facebook-credentials';

export function restoreSession(session) {
  return {
    type: RESTORE_SESSION,
    payload: JSON.parse(session),
  };
}
const sessionReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case RESTORE_SESSION:
      return payload;
    case LOGOUT:
      return {};
    default:
      return { ...state };
  }
};

function setAccessToken(token) {
  return {
    type: SET_ACCESS_TOKEN,
    payload: {
      token,
    }
  };
}

function accessTokenReducer(state = '', { type, payload }) {
  switch (type) {
    case SET_ACCESS_TOKEN:
      return payload.token;
    default:
      return state;
  }
}

const userReducer = combineReducers({
  user: one(USER_SCHEMA, 'me', undefined),
  members: storage(USER_SCHEMA),
  session_id: (state = '') => state,
  access_token: accessTokenReducer,
});

export default preventStateRehydration(
  chainReducers([
    sessionReducer,
    resource(USER_CREDENTIALS_SCHEMA),
    resource(USER_FACEBOOK_CREDENTIALS_SCHEMA),
    userReducer,
  ]),
);

export function register(email, username, password) {
  return (dispatch) => {
    const schemeConfig = {
      schema: USER_SCHEMA,
      request: {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Authorization': 'Basic ' + encodeToBase64(`${email}:${password}`),
        },
      },
    };
    const user = {
      type: USER_SCHEMA,
      appRole: 'user',
      profile: {
        nick: username,
      },
    };

    return dispatch(create(schemeConfig, user)).then(() => {
      return dispatch(login(email, password));
    });
  };
}

export function login(email, password) {
  return (dispatch) => dispatch(fetchAccessToken(email, password))
    .then((action) => {
      const accessToken = _.get(action, 'payload.data.attributes.token');
      dispatch(setAccessToken(accessToken));
      return dispatch(fetchUser('me'));
    });
}

export function loginWithFacebook(accessToken) {
  return (dispatch) => {
    return dispatch(find(USER_FACEBOOK_CREDENTIALS_SCHEMA, '', { accessToken }))
      .then((action) => {
        dispatch(setAccessToken(_.get(action, 'payload.access_token')));
        return dispatch(fetchUser('me'));
      });
  };
}

export function updateProfile(updates) {
  return (dispatch) => dispatch(update(USER_SCHEMA, updates, { userId: updates.id }));
}

export const userLoggedIn = user => ({
  type: LOGIN,
  payload: user,
});

export const userRegistered = user => ({
  type: REGISTER,
  payload: user,
});

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function authenticate(callback) {
  return {
    type: AUTHENTICATE,
    callback,
  };
}

export function fetchToken(tokenType, authHeader) {
  const schemeConfig = {
    schema: AUTH_TOKEN_SCHEMA,
    request: {
      headers: {
        'Authorization': authHeader,
      },
    },
  };
  const token = {
    type: AUTH_TOKEN_SCHEMA,
    tokenType,
    subjectType: 'user',
  };

  return create(schemeConfig, token);
}

export function fetchAccessToken(email, password) {
  return (dispatch) =>
    dispatch(fetchToken('refresh-token', 'Basic ' + encodeToBase64(`${email}:${password}`)))
      .then((action) =>
        dispatch(fetchToken('access-token', `Bearer ${_.get(action, 'payload.data.attributes.token')}`))
      );
}

export function fetchUser(userId = 'me') {
  return find(USER_SCHEMA, userId, { userId });
}

// function checks whether or not the user is logged in the application
// if the user is logged the acces token value in state is set
export function isAuthenticated(state) {
  const user = getUser(state);
  return !_.isEmpty(state[ext()].access_token) && isValid(user);
}

// function returns access token
export function getAccessToken(state) {
  return state[ext()].access_token;
}

export const isUserUpdateAction = (action) => {
  const schema = _.get(action, 'meta.schema');

  return _.includes([USER_PROFILE_SCHEMA, USER_PROFILE_IMAGE_SCHEMA], schema);
};

// function checks if user exists and if it does returns object with user data
// if user doesn't exist function returns undefined
export function getUser(state) {
  if (!_.isEmpty(state[ext()].user)) {
    return getOne(state[ext()].user, state);
  }
  return undefined;
}

export function getUserGroups(state) {
  const user = getUser(state);
  return _.get(user, 'userGroups');
}

export function logoutAction() {
  return (dispatch) => {
    dispatch(logout());
  };
}

export function openProfile(user, title = I18n.t(ext('profileNavBarTitle'))) {
  const route = {
    screen: ext('UserProfileScreen'),
    title,
    props: {
      user,
    },
  };
  return navigateTo(route);
}

export function hideShortcuts(user) {
  return (dispatch, getState) => {
    const state = getState();
    const { allScreensProtected } = getExtensionSettings(state, ext());
    const shortcuts = getAllShortcuts(state);
    const userGroups = _.map(user.userGroups, 'id');

    dispatch(showAllShortcuts());

    if (!allScreensProtected) {
      return;
    }

    _.forEach(shortcuts, (shortcut) => {
      const shortcutUserGroups = _.get(shortcut, ['settings', _.camelCase(ext()), 'userGroups']);
      const userGroupsEmpty = _.isEmpty(shortcutUserGroups);

      if (userGroupsEmpty) {
        return;
      }

      const shortcutUserGroupIds = _.map(shortcutUserGroups, 'id');
      const isShortcutHiddenToUser = _.isEmpty(_.intersection(userGroups, shortcutUserGroupIds));

      if (isShortcutHiddenToUser) {
        dispatch(hideShortcut(shortcut.id));
      }
    });
  };
}

import _ from 'lodash';
import { combineReducers } from 'redux';
import { RSAA } from 'redux-api-middleware';

import { ext } from './const';

export const LOGIN_REQUEST = 'shoutem.auth.LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'shoutem.auth.LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'shoutem.auth.LOGIN_FAILURE';

export const REGISTER_REQUEST = 'shoutem.auth.REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'shoutem.auth.REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'shoutem.auth.REGISTER_FAILURE';

export const LOGOUT = 'shoutem.auth.LOGOUT';
export const AUTHENTICATE = 'shoutem.auth.AUTHENTICATE';

export const SERVER = 'https://api.dev.sauros.hr/';

export function user(state = {}, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return action.payload.user;
    case LOGOUT:
      return {};
    default:
      return state;
  }
}

export function accessToken(state = '', action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return action.payload.access_token;
    case LOGOUT:
      return '';
    default:
      return state;
  }
}

export function error(state = '', action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {};
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
      return action.payload.response.message;
    default:
      return state;
  }
}

export default combineReducers({
  user,
  accessToken,
  error,
});

export function login(appId, user, pass) {
  return {
    [RSAA]: {
      endpoint: `${SERVER}/api/account/verify_credentials.json?` +
        `nid=${appId}&email=${user}&password=${pass}`,
      method: 'GET',
      types: [
        {
          type: LOGIN_REQUEST,
          meta: {
            nid: appId,
            email: user,
            password: pass,
          },
        },
        LOGIN_SUCCESS,
        LOGIN_FAILURE,
      ],
    },
  };
}

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

export function register(appId, email, username, password) {
  return {
    [RSAA]: {
      endpoint: `${SERVER}/api/account/signup.json?nid=${appId}&` +
        `email=${email}&username=${username}&password=${password}`,
      method: 'POST',
      types: [
        {
          type: REGISTER_REQUEST,
          meta: {
            nid: appId,
            email,
            username,
            password,
          },
        },
        REGISTER_SUCCESS,
        REGISTER_FAILURE,
      ],
    },
  };
}

// function checks whether or not the user is logged in the application
// if the user is logged the acces token value in state is set
export function isAuthenticated(state) {
  return !_.isEmpty(state[ext()].accessToken);
}

// function returns access token
export function getAccessToken(state) {
  return state[ext()].accessToken;
}

// function checks if user exists and if it does returns object with user data
// if user doesn't exist function returns undefined
export function getUser(state) {
  if (!_.isEmpty(state[ext()].user)) {
    return state[ext()].user;
  }
  return undefined;
}

export function logoutAction() {
  return (dispatch) => {
    dispatch(logout());
  };
}

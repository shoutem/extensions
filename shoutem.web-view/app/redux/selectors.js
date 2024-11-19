import _ from 'lodash';
import { getOne } from '@shoutem/redux-io';
import { AUTH_EXTENSION, ext } from '../const';

const getModuleState = state => state[ext()];

export const getUser = state => {
  const user = state[AUTH_EXTENSION]?.user;

  if (_.isEmpty(user)) {
    return undefined;
  }

  return getOne(user, state);
};

export const getResetWebViewCallback = (state, shortcutId) =>
  getModuleState(state).resetWebViewCallback[shortcutId];

import _ from 'lodash';
import { getOne } from '@shoutem/redux-io';
import { AUTH_EXTENSION } from '../const';

export function getUser(state) {
  const user = state[AUTH_EXTENSION]?.user;

  if (_.isEmpty(user)) {
    return undefined;
  }

  return getOne(user, state);
}

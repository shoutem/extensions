import _ from 'lodash';

export function formatUserLabel(user) {
  const firstName = _.get(user, 'firstName', '');
  const lastName = _.get(user, 'lastName', '');
  return `${firstName} ${lastName}`;
}

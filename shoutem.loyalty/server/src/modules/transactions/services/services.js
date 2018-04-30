import _ from 'lodash';

export function formatRewardLabel(reward) {
  return reward ? reward.title : '';
}

export function formatPlaceLabel(place) {
  return place ? place.name : '';
}

export function formatUserLabel(user) {
  const firstName = _.get(user, 'profile.firstName', '');
  const lastName = _.get(user, 'profile.lastName', '');
  return `${firstName} ${lastName}`;
}

export function formatCashierLabel(cashier) {
  const firstName = _.get(cashier, 'firstName', '');
  const lastName = _.get(cashier, 'lastName', '');
  return `${firstName} ${lastName}`;
}

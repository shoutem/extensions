import _ from 'lodash';

export const PROFILE_FIELDS = ['firstName', 'lastName', 'phone'];

const PHONE_REGEX = /\+\d+/g;

export function isPhoneValid(phone) {
  if (!phone) {
    return false;
  }

  return !_.isEmpty(phone.match(PHONE_REGEX));
}

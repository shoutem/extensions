import isEmail from 'is-email';
import _ from 'lodash';

export const DATE_LABEL_FORMAT = 'DD MMM YYYY';
export const DATE_VALUE_FORMAT = 'YYYY-MM-DD';
const DATE_REGEX = /\d{2}\s\w{3}\s\d{4}/g;
const PHONE_REGEX = /.?\d{1,25}/g;
const EMAIL_REGEX = /.+@{1}.+\.{1}.+/g;

function validateSize(value, minLen, maxLen = Infinity) {
  return _.size(value) >= minLen && _.size(value) <= maxLen;
}

const FIELD_VALIDATOR_FUNCTIONS = {
  email: mail => isEmail(mail) && !!mail.match(EMAIL_REGEX),
  nick: value => !_.isEmpty(value),
  phoneNumber: phone => !!phone.match(PHONE_REGEX),
  password: value => validateSize(value, 6),
  firstName: name => validateSize(name, 2, 25),
  lastName: name => validateSize(name, 2, 25),
  dob: date => !!date.match(DATE_REGEX),
};

export function areFieldsFilled(fields) {
  return _.reduce(fields, (result, field) => result && !_.isEmpty(field), true);
}

export function validateField(field, value) {
  if (_.has(FIELD_VALIDATOR_FUNCTIONS, field)) {
    return FIELD_VALIDATOR_FUNCTIONS[field](value);
  }

  return true;
}

export function validateFields(fields) {
  const isValid = areFieldsFilled(fields);

  if (!isValid) {
    return isValid;
  }

  return _.reduce(
    fields,
    (result, field, key) => {
      const isFieldValid = validateField(key, field);

      return result && isFieldValid;
    },
    isValid,
  );
}

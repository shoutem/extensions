import i18next from 'i18next';
import _ from 'lodash';
import { isEmail } from 'validator';
import CASHIER_FORM_LOCALIZATION from '../components/cashier-form/localization';
import LOCALIZATION from './localization';

const ERROR_CODES = {
  DUPLICATE_PIN: 'lm_cashier_validation_pinInvalid',
  DUPLICATE_USER: 'lm_cashier_api_authError',
};

function validateRequiredField(value, name) {
  if (!value) {
    return i18next.t(LOCALIZATION.REQUIRED_FIELD_MESSAGE, { name });
  }

  return null;
}

function validateEmail(email) {
  if (!email) {
    return i18next.t(LOCALIZATION.EMAIL_REQUIRED_MESSAGE);
  }

  if (!isEmail(email)) {
    return i18next.t(LOCALIZATION.EMAIL_NOT_VALID_MESSAGE);
  }

  return null;
}

function validatePassword(password) {
  if (!password) {
    return i18next.t(LOCALIZATION.PASSWORD_REQUIRED_MESSAGE);
  }

  if (password.length < 6) {
    return i18next.t(LOCALIZATION.PASSWORD_TOO_SHORT_MESSAGE);
  }

  return null;
}

export function validateCashier(cashier) {
  const { id, firstName, lastName, email, password, pin } = cashier;
  const errors = {};

  errors.firstName = validateRequiredField(
    firstName,
    i18next.t(CASHIER_FORM_LOCALIZATION.FORM_FIRST_NAME_TITLE),
  );
  errors.lastName = validateRequiredField(
    lastName,
    i18next.t(CASHIER_FORM_LOCALIZATION.FORM_LAST_NAME_TITLE),
  );
  errors.pin = validateRequiredField(
    pin,
    i18next.t(CASHIER_FORM_LOCALIZATION.FORM_PIN_TITLE),
  );

  // email & password cannot be changed for existing users and don't have to be validated
  errors.email = _.isEmpty(id) ? validateEmail(email) : null;
  errors.password = _.isEmpty(id) ? validatePassword(password) : null;

  return errors;
}

export function getErrorMessage(errorCode) {
  if (errorCode === ERROR_CODES.DUPLICATE_PIN) {
    return { pin: i18next.t(LOCALIZATION.PIN_UNIQUE_MESSAGE) };
  }

  if (errorCode === ERROR_CODES.DUPLICATE_USER) {
    return { email: i18next.t(LOCALIZATION.USER_ALREADY_EXISTS_MESSAGE) };
  }

  return { _error: i18next.t(LOCALIZATION.ERROR_MESSAGE) };
}

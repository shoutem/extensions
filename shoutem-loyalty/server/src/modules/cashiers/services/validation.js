import { isEmail } from 'validator';

const ERROR_CODES = {
  DUPLICATE_PIN: 'lm_cashier_validation_pinInvalid',
  DUPLICATE_USER: 'lm_cashier_api_authError',
};

function validateRequiredField(value, name) {
  if (!value) {
    return `${name} is required`;
  }

  return null;
}

function validateEmail(email) {
  if (!email) {
    return 'Email is required';
  }

  if (!isEmail(email)) {
    return 'Email is not valid';
  }

  return null;
}

function validatePassword(password) {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password is too short';
  }

  return null;
}

export function validateCashier(cashier) {
  const { firstName, lastName, email, password } = cashier;
  const errors = {};

  errors.password = validatePassword(password);
  errors.firstName = validateRequiredField(firstName, 'First name');
  errors.lastName = validateRequiredField(lastName, 'Last name');
  errors.email = validateEmail(email);
  errors.pin = validateRequiredField(firstName, 'Pin');

  return errors;
}

export function resolveErrorMessage(errorCode) {
  if (errorCode === ERROR_CODES.DUPLICATE_PIN) {
    return { pin: 'Pin must be unique.' };
  }

  if (errorCode === ERROR_CODES.DUPLICATE_USER) {
    return { email: 'User with this email already exists.' };
  }

  return { _error: 'Something went wrong, please try again' };
}

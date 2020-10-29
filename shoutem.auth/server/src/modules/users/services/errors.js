import i18next from 'i18next';
import LOCALIZATION from './localization';

const ERROR_CODES = {
  DUPLICATE_USERNAME: 'auth_auth_validation_usernameTaken',
  DUPLICATE_EMAIL: 'auth_auth_validation_usernameTaken',
};

export function getErrorMessage(errorCode) {
  if (errorCode === ERROR_CODES.DUPLICATE_USERNAME) {
    return { nick: i18next.t(LOCALIZATION.USERNAME_EXISTS_MESSAGE) };
  }

  if (errorCode === ERROR_CODES.DUPLICATE_EMAIL) {
    return { username: i18next.t(LOCALIZATION.EMAIL_EXISTS_MESSAGE) };
  }

  return { _error: i18next.t(LOCALIZATION.ERROR_MESSAGE) };
}

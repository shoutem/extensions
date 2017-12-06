import { I18n } from 'shoutem.i18n';
import { ext } from './const';

export const errorMessages = {
  get EMAIL_UNKNOWN() {
    return I18n.t(ext('unknownEmailErrorMessage'));
  },
  get INVALID_CREDENTIALS() {
    return I18n.t(ext('invalidCredentialsErrorMessage'));
  },
  get SIGNUP_EMAIL_INVALID() {
    return I18n.t(ext('invalidEmailFormatErrorMessage'));
  },
  get SIGNUP_USERNAME_INVALID() {
    return I18n.t(ext('invalidUsernameFormatErrorMessage'));
  },
  get SIGNUP_PASSWORD_INVALID() {
    return I18n.t(ext('invalidPasswordFormatErrorMessage'));
  },
  get EMPTY_FIELDS() {
    return I18n.t(ext('formNotFilledErrorMessage'));
  },
  get UNEXPECTED_ERROR() {
    return I18n.t('shoutem.application.unexpectedErrorMessage');
  },
};

export const getErrorMessage = errorCode =>
    errorMessages[errorCode] || errorMessages.UNEXPECTED_ERROR;

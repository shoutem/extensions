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
  get USERNAME_TAKEN() {
    return I18n.t(ext('usernameTakenErrorMessage'));
  },
  get MANUAL_APPROVAL() {
    return I18n.t(ext('manualApprovalMessage'));
  }
};

export function resolveErrorMessage(errorCode) {
  switch(errorCode) {
    case 'EMAIL_UNKNOWN':
      return I18n.t(ext('unknownEmailErrorMessage'));
    case 'INVALID_CREDENTIALS':
      return I18n.t(ext('invalidCredentialsErrorMessage'));
    case 'SIGNUP_EMAIL_INVALID':
      return I18n.t(ext('invalidEmailFormatErrorMessage'));
    case 'SIGNUP_USERNAME_INVALID':
      return I18n.t(ext('invalidUsernameFormatErrorMessage'));
    case 'SIGNUP_PASSWORD_INVALID':
      return I18n.t(ext('invalidPasswordFormatErrorMessage'));
    case 'EMPTY_FIELDS':
      return I18n.t(ext('formNotFilledErrorMessage'));
    case 'USERNAME_TAKEN':
      return I18n.t(ext('usernameTakenErrorMessage'));
    case 'MANUAL_APPROVAL':
      return I18n.t(ext('manualApprovalMessage'));
    default:
      return I18n.t('shoutem.application.unexpectedErrorMessage');
  }
}

export const getErrorMessage = errorCode => resolveErrorMessage(errorCode);

export const apiCodeToErrorMessage = {
    auth_user_validation_usernameTaken: 'USERNAME_TAKEN',
    auth_auth_notAuthorized_userAuthenticationError: 'UNEXPECTED_ERROR',
};

export const getErrorCode = apiResponseErrorCode =>
apiCodeToErrorMessage[apiResponseErrorCode] || getErrorMessage(apiResponseErrorCode);

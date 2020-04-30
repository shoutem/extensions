import { AppleAuthError } from '@invertase/react-native-apple-authentication';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export function resolveAppleErrorMessage(errorCode) {
  switch (errorCode) {
    case AppleAuthError.CANCELED:
      return I18n.t(ext('appleAuthCanceledError'));
    case AppleAuthError.FAILED:
      return I18n.t(ext('appleAuthFailedError'));
    case AppleAuthError.INVALID_RESPONSE:
      return I18n.t(ext('appleAuthInvalidResponseError'));
    case AppleAuthError.NOT_HANDLED:
      return I18n.t(ext('appleAuthNotHandledError'));
    default:
      return I18n.t(ext('appleAuthUnknownError'));
  }
}

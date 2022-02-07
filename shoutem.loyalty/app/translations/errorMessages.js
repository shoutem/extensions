import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const localizationKeysMap = {
  lm_transaction_validation_numberOfRewardsInvalid: ext(
    'numberOfRewardsInvalidErrorMessage',
  ),
  lm_authorization_forbidden_authDataExpressionInvalid: ext(
    'authDataExpressionInvalidErrorMessage',
  ),
  lm_authorization_forbidden_transactionExists: ext(
    'transactionExistsErrorMessage',
  ),
  lm_transaction_validation_cardPointCountInvalid: ext('cardPointCountInvalid'),
  lm_transaction_validation_transactionInProgress: ext('transactionInProgress'),
};

export const getErrorMessage = errorCode => {
  const defaultError = 'shoutem.application.unexpectedErrorMessage';
  const localizationKey = localizationKeysMap[errorCode] || defaultError;

  return I18n.t(localizationKey);
};

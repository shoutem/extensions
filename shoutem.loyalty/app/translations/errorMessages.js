import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const localizationKeysMap = {
  lm_transaction_validation_numberOfRewardsInvalid: ext('numberOfRewardsInvalidErrorMessage'),
  lm_authorization_forbidden_authDataExpressionInvalid: ext('authDataExpressionInvalidErrorMessage'),
  lm_authorization_forbidden_transactionExists: ext('transactionExistsErrorMessage'),
};

export const getErrorMessage = errorCode => {
  const localizationKey = localizationKeysMap[errorCode] ||
    'shoutem.application.unexpectedErrorMessage';

  return I18n.t(localizationKey);
};

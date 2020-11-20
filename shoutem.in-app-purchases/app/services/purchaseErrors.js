import { Alert } from 'react-native';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export function formatPurchaseError(error) {
  if (error.code == "user_cancelled") {
    return;
  }

  if (error.code == "product_already_owned") {
    return Alert.alert(
      I18n.t(ext('errorProductOwnedTitle')),
      I18n.t(ext('errorProductOwnedDescription')),
    );
  }

  if (error.code == "deferred_payment") {
    return Alert.alert(
      I18n.t(ext('errorDeferredPaymentTitle')),
      I18n.t(ext('errorDeferredPaymentDescription')),
    );
  }

  if (error.code == "receipt_validation_failed") {
    return Alert.alert(
      I18n.t(ext('errorReceiptValidationTitle')),
      I18n.t(ext('errorReceiptValidationDescription')),
    );
  }

  if (error.code == "receipt_invalid") {
    return Alert.alert(
      I18n.t(ext('errorReceiptInvalidTitle')),
      I18n.t(ext('errorReceiptInvalidDescription')),
    );
  }

  if (error.code == "receipt_request_failed") {
    return Alert.alert(
      I18n.t(ext('errorReceiptRequestTitle')),
      I18n.t(ext('errorReceiptRequestDescription')),
    );
  }

  return Alert.alert(
    I18n.t(ext('errorGenericPurchaseTitle')),
    I18n.t(ext('errorGenericPurchaseDescription')),
  );
}

export function formatRestoreError() {
  return Alert.alert(
    I18n.t(ext('errorGenericRestoreTitle')),
    I18n.t(ext('errorGenericRestoreDescription')),
  );
}

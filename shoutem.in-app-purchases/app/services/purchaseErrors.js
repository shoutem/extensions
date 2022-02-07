import { Alert } from 'react-native';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export function formatPurchaseError(error) {
  if (error.code === 'user_cancelled') {
    return;
  }

  if (error.code === 'product_already_owned') {
    Alert.alert(
      I18n.t(ext('errorProductOwnedTitle')),
      I18n.t(ext('errorProductOwnedDescription')),
    );
    return;
  }

  if (error.code === 'deferred_payment') {
    Alert.alert(
      I18n.t(ext('errorDeferredPaymentTitle')),
      I18n.t(ext('errorDeferredPaymentDescription')),
    );
    return;
  }

  if (error.code === 'receipt_validation_failed') {
    Alert.alert(
      I18n.t(ext('errorReceiptValidationTitle')),
      I18n.t(ext('errorReceiptValidationDescription')),
    );
    return;
  }

  if (error.code === 'receipt_invalid') {
    Alert.alert(
      I18n.t(ext('errorReceiptInvalidTitle')),
      I18n.t(ext('errorReceiptInvalidDescription')),
    );
    return;
  }

  if (error.code === 'receipt_request_failed') {
    Alert.alert(
      I18n.t(ext('errorReceiptRequestTitle')),
      I18n.t(ext('errorReceiptRequestDescription')),
    );
    return;
  }

  Alert.alert(
    I18n.t(ext('errorGenericPurchaseTitle')),
    I18n.t(ext('errorGenericPurchaseDescription')),
  );
}

export function formatRestoreError() {
  Alert.alert(
    I18n.t(ext('errorGenericRestoreTitle')),
    I18n.t(ext('errorGenericRestoreDescription')),
  );
}

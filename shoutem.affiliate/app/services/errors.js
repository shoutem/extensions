import { Alert } from 'react-native';
import { I18n } from 'shoutem.i18n';

// TODO: Replace with toast
export const showError = () => {
  Alert.alert(
    I18n.t('shoutem.application.errorTitle'),
    I18n.t('shoutem.application.unexpectedErrorMessage'),
  );
};

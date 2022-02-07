import { Alert } from 'react-native';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

// TODO: Replace with toast
export function handleError() {
  return Alert.alert(null, I18n.t(ext('defaultErrorMessage')));
}

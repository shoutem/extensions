import { Alert } from 'react-native';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export function displayLocalNotification(title, message, navigationAction) {
  const viewAction = {
    text: I18n.t(ext('messageReceivedAlertView')),
    onPress: navigationAction,
  };

  const defaultAction = {
    text: I18n.t(ext('messageReceivedAlertDismiss')),
    onPress: () => null,
  };

  Alert.alert(title, message, [defaultAction, viewAction]);
}

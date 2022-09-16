import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export function getFieldLabel(label) {
  switch (label) {
    case 'email':
      return I18n.t(ext('checkoutEmail'));
    case 'address1':
      return I18n.t(ext('checkoutAddress'));
    case 'city':
      return I18n.t(ext('checkoutCity'));
    case 'province':
      return I18n.t(ext('checkoutProvince'));
    case 'zip':
      return I18n.t(ext('checkoutPostalCode'));
    case 'number':
      return I18n.t(ext('checkoutCardNumber'));
    case 'expiryMonth':
      return I18n.t(ext('checkoutExpiryMonth'));
    case 'expiryYear':
      return I18n.t(ext('checkoutExpiryYear'));
    case 'cvv':
      return I18n.t(ext('checkoutSecurityCode'));
    case 'firstName':
      return I18n.t(ext('checkoutFirstName'));
    case 'lastName':
      return I18n.t(ext('checkoutLastName'));
    default:
      return '';
  }
}

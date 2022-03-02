import { I18n } from 'shoutem.i18n';
import { ext, ORDER_STATUSES } from '../const';

const MAPPED_ORDER_STATUSES = {
  [ORDER_STATUSES.NEW]: 'orderStatusNew',
  [ORDER_STATUSES.DRIVER_LOADING]: 'orderStatusDelivering',
  [ORDER_STATUSES.DELIVERING]: 'orderStatusDelivering',
  [ORDER_STATUSES.ARRIVED]: 'orderStatusDone',
  [ORDER_STATUSES.DONE]: 'orderStatusDone',
  [ORDER_STATUSES.CANCELED]: 'orderStatusCanceled',
};

export function formatOrderStatus(order) {
  return I18n.t(ext(MAPPED_ORDER_STATUSES[order.status]));
}

export function isCancellable(order) {
  return order.status === ORDER_STATUSES.NEW;
}

import { ext } from '../const';
import { createRSAAStatusTypes } from '../services';

export const INVENTORY_ACTION_TYPES = createRSAAStatusTypes(
  ext('LOAD_INVENTORY'),
);
export const LOAD_CART_ACTION_TYPES = createRSAAStatusTypes(ext('LOAD_CART'));
export const LOAD_DELIVERY_TIMES_ACTION_TYPES = createRSAAStatusTypes(
  ext('LOAD_DELIVERY_TIMES'),
);
export const LOAD_ORDERS_ACTION_TYPES = createRSAAStatusTypes(
  ext('LOAD_ORDERS'),
);
export const CREATE_ORDER_ACTION_TYPES = createRSAAStatusTypes(
  ext('CREATE_ORDER'),
);
export const UPDATE_ORDER_ACTION_TYPES = createRSAAStatusTypes(
  ext('UPDATE_ORDER'),
);
export const SEND_OTP_ACTION_TYPES = createRSAAStatusTypes(ext('SEND_OTP'));
export const VERIFY_OTP_ACTION_TYPES = createRSAAStatusTypes(ext('VERIFY_OTP'));
export const CREATE_CUSTOMER_ACTION_TYPES = createRSAAStatusTypes(
  ext('CREATE_CUSTOMER_ACTION_TYPES'),
);
export const CANCEL_ORDER_ACTION_TYPES = createRSAAStatusTypes(
  ext('CANCEL_ORDER'),
);
export const REFRESH_CART_ACTION_TYPES = createRSAAStatusTypes(
  ext('REFRESH_CART'),
);

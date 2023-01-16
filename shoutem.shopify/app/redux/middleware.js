import _ from 'lodash';
import {
  CREATE_SUCCESS,
  LOAD_SUCCESS,
  UPDATE_SUCCESS,
} from '@shoutem/redux-io';
import { Toast } from '@shoutem/ui';
import { LOGOUT, USER_SCHEMA } from 'shoutem.auth';
import MBBridge from '../MBBridge';
import { decodeFromBase64 } from '../services';
import {
  cancelAbandonedCartTrigger,
  createCustomer,
  getCustomer,
  login,
  updateCustomer,
} from './actionCreators';
import {
  CHECKOUT_COMPLETED,
  CUSTOMER_ERROR,
  CUSTOMER_LOGIN_SUCCESS,
  SET_ORDERS_ERROR,
} from './actionTypes';

const AUTH_TOKEN_SCHEMA = 'shoutem.auth.tokens';

export const postPurchaseMidleware = store => next => action => {
  const actionType = _.get(action, 'type');

  if (actionType === CHECKOUT_COMPLETED) {
    store.dispatch(cancelAbandonedCartTrigger());
  }

  return next(action);
};

export const loginMiddleware = store => next => action => {
  // Login with email
  if (
    action.type === CREATE_SUCCESS &&
    action?.meta?.schema === AUTH_TOKEN_SCHEMA
  ) {
    const meta = _.get(action, 'meta.options');

    if (!_.isEmpty(meta)) {
      const decodedCredentials = decodeFromBase64(meta);

      const [email, password] = decodedCredentials.split(':');

      if (email && !_.isEmpty(email.match(/.*@.*/g)) && password) {
        store
          .dispatch(login(email, password))
          .catch(() => store.dispatch(createCustomer({ email, password })));
      }
    }
  }

  // Login with username
  if (action.type === LOAD_SUCCESS && action?.meta?.schema === USER_SCHEMA) {
    const meta = _.get(action, 'meta.options');

    if (!_.isEmpty(meta)) {
      const decodedCredentials = decodeFromBase64(meta);

      const email = action.payload.data.attributes.username;
      const [, password] = decodedCredentials.split(':');

      if (email && password) {
        store
          .dispatch(login(email, password))
          .catch(() => store.dispatch(createCustomer({ email, password })));
      }
    }
  }

  return next(action);
};

export const customerMiddleware = store => next => action => {
  if (action.type === CUSTOMER_LOGIN_SUCCESS) {
    store.dispatch(getCustomer());
  }

  return next(action);
};

export const errorMiddleware = store => next => action => {
  if (action.type === SET_ORDERS_ERROR || action.type === CUSTOMER_ERROR) {
    const { title, message } = action.payload;

    Toast.showError({
      title,
      message,
      visibilityTime: 8000,
    });
  }

  return next(action);
};

export const updateProfileMiddleware = store => next => action => {
  if (action.type === UPDATE_SUCCESS && action?.meta?.schema === USER_SCHEMA) {
    const profile = _.get(action.payload, 'data.attributes.profile');

    return store.dispatch(updateCustomer(profile)).finally(() => next(action));
  }

  // TODO: Update Shoutem profile when Shopify profile has changes

  return next(action);
};

export const logoutMiddleware = store => next => action => {
  if (action.type === LOGOUT) {
    return MBBridge.logout().finally(() => next(action));
  }

  return next(action);
};

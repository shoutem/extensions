import _ from 'lodash';
import { CHECKOUT_COMPLETED } from './actionTypes';
import { cancelAbandonedCartTrigger } from './actionCreators';

export const postPurchaseMidleware =
  store => next => action => {
    const actionType = _.get(action, 'type');

    if (actionType === CHECKOUT_COMPLETED) {
      store.dispatch(cancelAbandonedCartTrigger());
    }

    return next(action);
  };

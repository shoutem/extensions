import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import { preventStateRehydration } from 'shoutem.redux';
import { ext } from '../const';
import { createStatusReducer } from '../services';
import {
  SET_CUSTOMER_PROFILE,
  SET_LOGIN_SCREEN_SHOWN,
  SET_VERIFICATION_COMPLETED,
} from './actions';
import {
  INVENTORY_ACTION_TYPES,
  LOAD_CART_ACTION_TYPES,
  LOAD_DELIVERY_TIMES_ACTION_TYPES,
  LOAD_ORDERS_ACTION_TYPES,
} from './const';

function customerProfileReducer(state = {}, action) {
  const { type } = action;

  if (type === SET_CUSTOMER_PROFILE) {
    return { ...state, ...action.payload };
  }

  return state;
}

function ageVerificationReducer(state = { completed: false }, action) {
  const { type } = action;

  if (action.type === REHYDRATE) {
    return { ...action?.payload?.[ext()]?.ageVerification };
  }

  if (type === SET_VERIFICATION_COMPLETED) {
    return { ...state, completed: true };
  }

  return state;
}

function initialLoginScreenReducer(state = { shown: false }, action) {
  const { type } = action;

  if (type === REHYDRATE) {
    return { ...action?.payload?.[ext()]?.initialLoginScreen };
  }

  if (type === SET_LOGIN_SCREEN_SHOWN) {
    return { shown: true };
  }

  return state;
}

export default combineReducers({
  ageVerification: ageVerificationReducer,
  initialLoginScreen: initialLoginScreenReducer,
  customerProfile: preventStateRehydration(customerProfileReducer),
  inventory: preventStateRehydration(
    createStatusReducer(INVENTORY_ACTION_TYPES),
  ),
  cart: preventStateRehydration(createStatusReducer(LOAD_CART_ACTION_TYPES)),
  deliveryTimes: preventStateRehydration(
    createStatusReducer(LOAD_DELIVERY_TIMES_ACTION_TYPES),
  ),
  orders: preventStateRehydration(
    createStatusReducer(LOAD_ORDERS_ACTION_TYPES),
  ),
});

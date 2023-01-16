import * as actions from './actionCreators';
import {
  customerMiddleware,
  errorMiddleware,
  loginMiddleware,
  logoutMiddleware,
  postPurchaseMidleware,
  updateProfileMiddleware,
} from './middleware';
import reducer from './reducers';
import * as selectors from './selectors';

export { ABANDONED_CART_TRIGGER } from './actionTypes';

export const middleware = [
  customerMiddleware,
  errorMiddleware,
  loginMiddleware,
  logoutMiddleware,
  postPurchaseMidleware,
  updateProfileMiddleware,
];

export { actions, reducer, selectors };

import I18n from 'i18n-js';
import moment from 'moment';
import { SET_LOCALE } from './actions';

// eslint-disable-next-line no-unused-vars
export const changeLocaleMiddleware = store => next => (action) => {
  if (action.type === SET_LOCALE) {
    I18n.locale = action.payload;

    moment.locale(action.payload);
    return next(action);
  }

  return next(action);
};

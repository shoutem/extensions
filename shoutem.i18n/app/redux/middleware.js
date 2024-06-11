import I18n from 'i18n-js';
import moment from 'moment';
import { LOCALE_CHANGED, SET_LOCALE } from './actions';

/**
 * Factory for creating middleware reacting to locale change.
 * This is executed **after** redux state has been updated with new locale.
 * Notice different actions in middlewares below.
 */
export const createLocaleChangedMiddleware = callbackFn => {
  return store => next => action => {
    if (action.type === LOCALE_CHANGED) {
      callbackFn(store, action);
    }

    return next(action);
  };
};

/**
 * This middleware is executed **before** state has been updated with new locale.
 */
// eslint-disable-next-line no-unused-vars
export const changeLocaleMiddleware = _store => next => action => {
  if (action.type === SET_LOCALE) {
    I18n.locale = action.payload;
    moment.locale(action.payload);
  }

  return next(action);
};

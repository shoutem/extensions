import { combineReducers } from 'redux';
import {
  CLEAR_APP_ANALYTICS_DATA,
  SAVE_ANALYTICS_DATA,
  SET_CURRENT_FILTER,
  SET_LOADING,
  SET_PAGE_VIEWS_DATA,
} from './actions';

export const APP_ANALYTICS_DEFAULT_STATE = {
  data: {},
  categories: {},
  loading: false,
  pageViews: [],
  // Used for formatting X Axis labels
  period: 'day',
};

function appAnalyticsReducer(state = APP_ANALYTICS_DEFAULT_STATE, action) {
  if (action.type === SAVE_ANALYTICS_DATA) {
    return { ...state, ...action.payload };
  }

  if (action.type === SET_PAGE_VIEWS_DATA) {
    return { ...state, pageViews: action.payload };
  }

  if (action.type === SET_LOADING) {
    return { ...state, loading: action.payload };
  }

  if (action.type === SET_CURRENT_FILTER) {
    return { ...state, ...action.payload };
  }

  if (action.type === CLEAR_APP_ANALYTICS_DATA) {
    return APP_ANALYTICS_DEFAULT_STATE;
  }

  return state;
}

export default combineReducers({
  app: appAnalyticsReducer,
});

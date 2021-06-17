import { combineReducers } from 'redux';
import {
  ADD_RECENT_SEARCH,
  CLEAR_GOOGLE_PLACE_DETAILS,
  CLEAR_GOOGLE_PLACES,
  CLEAR_NEW_FORECAST,
  GOOGLE_PLACES_API_FAILED,
  GOOGLE_PLACE_DETAILS_LOADED,
  NO_GOOGLE_PLACE_DETAILS_FOUND,
  NO_GOOGLE_PLACES_FOUND,
  GOOGLE_PLACES_LOADED,
  LIVE_FORECAST_LOADED,
  LIVE_SERVICE_NOT_FOUND,
  NEW_FORECAST_LOADED,
  NEW_SERVICE_NOT_FOUND,
  NO_DATA_FOUND,
  NO_DATA_FOUND_ERROR,
  NO_LIVE_DATA_FOUND,
  NO_LIVE_DATA_FOUND_ERROR,
} from '../const';

const googlePlaceDetails = (state = null, action) => {
  if (action.type === NO_GOOGLE_PLACE_DETAILS_FOUND) {
    return { error: true };
  }

  if (action.type === GOOGLE_PLACE_DETAILS_LOADED) {
    return action.payload;
  }

  if (action.type === CLEAR_GOOGLE_PLACE_DETAILS) {
    return null;
  }

  return state;
};

const googlePlaces = (state = [], action) => {
  if (action.type === GOOGLE_PLACES_API_FAILED) {
    return [];
  }

  if (action.type === NO_GOOGLE_PLACES_FOUND) {
    return { error: 'ZERO_RESULTS' };
  }

  if (action.type === GOOGLE_PLACES_LOADED) {
    return action.payload;
  }

  if (action.type === CLEAR_GOOGLE_PLACES) {
    return [];
  }

  return state;
};

const liveForecast = (state = null, action) => {
  if (action.type === CLEAR_NEW_FORECAST) {
    return null;
  }

  if (action.type === LIVE_FORECAST_LOADED) {
    if (action.payload.status !== 'OK') {
      return null;
    }

    return action.payload;
  }

  if (action.type === LIVE_SERVICE_NOT_FOUND) {
    return { unavailable: true };
  }

  if (action.type === NO_LIVE_DATA_FOUND) {
    return { error: NO_LIVE_DATA_FOUND_ERROR };
  }

  return state;
};

const newForecast = (state = null, action) => {
  if (action.type === CLEAR_NEW_FORECAST) {
    return null;
  }

  if (action.type === NEW_FORECAST_LOADED) {
    return action.payload;
  }

  if (action.type === NEW_SERVICE_NOT_FOUND) {
    return { unavailable: true };
  }

  if (action.type === NO_DATA_FOUND) {
    return { error: NO_DATA_FOUND_ERROR };
  }

  return state;
};

const recentSearches = (state = [], action) => {
  if (action.type === ADD_RECENT_SEARCH) {
    if (state.indexOf(action.payload) !== -1) {
      return state;
    }

    if (state.length === 5) {
      state.pop();
      state.unshift(action.payload);

      return state;
    }

    state.unshift(action.payload);
    return state;
  }

  return state;
};

export default combineReducers({
  googlePlaceDetails,
  googlePlaces,
  liveForecast,
  newForecast,
  recentSearches,
});

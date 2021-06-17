import { find } from '@shoutem/redux-io';
import {
  ADD_RECENT_SEARCH,
  CLEAR_GOOGLE_PLACE_DETAILS,
  CLEAR_GOOGLE_PLACES,
  CLEAR_LIVE_FORECAST,
  CLEAR_NEW_FORECAST,
  GOOGLE_PLACE_DETAILS_LOADED,
  GOOGLE_PLACES_API_FAILED,
  GOOGLE_PLACES_LOADED,
  GOOGLE_PLACES_SCHEMA,
  LIVE_FORECAST_LOADED,
  LIVE_FORECAST_SCHEMA,
  LIVE_SERVICE_NOT_FOUND,
  NEW_FORECAST_LOADED,
  NEW_FORECAST_SCHEMA,
  NEW_SERVICE_NOT_FOUND,
  NO_DATA_FOUND,
  NO_GOOGLE_PLACE_DETAILS_FOUND,
  NO_GOOGLE_PLACES_FOUND,
  NO_LIVE_DATA_FOUND,
} from '../const';
import { bestTime, googlePlaces } from '../services';

const NO_LIVE_DATA_MESSAGE =
  'No live data available for this venue at this moment.';

export function addRecentSearch(place) {
  return { type: ADD_RECENT_SEARCH, payload: place };
}

export function clearGooglePlaces() {
  return { type: CLEAR_GOOGLE_PLACES };
}

export function clearGooglePlaceDetails() {
  return { type: CLEAR_GOOGLE_PLACE_DETAILS };
}

export function clearLiveForecast() {
  return { type: CLEAR_LIVE_FORECAST };
}

export function clearNewForecast() {
  return { type: CLEAR_NEW_FORECAST };
}

export function fetchGooglePlaceDetails(placeId) {
  const endpoint = googlePlaces.buildDetailsUrl(placeId);

  const config = {
    schema: GOOGLE_PLACE_DETAILS_LOADED,
    request: {
      endpoint,
      resourceType: 'json',
    },
  };

  return dispatch =>
    dispatch(find(config))
      .then(({ payload: { result, status } }) => {
        if (status !== 'OK') {
          return dispatch({ type: NO_GOOGLE_PLACE_DETAILS_FOUND });
        }

        return dispatch({ type: GOOGLE_PLACE_DETAILS_LOADED, payload: result });
      })
      .catch(() => {
        return dispatch({ type: NO_GOOGLE_PLACE_DETAILS_FOUND });
      });
}

export function fetchGooglePlaces(input, location = null, radius) {
  const endpoint = googlePlaces.buildAutocompleteUrl(input, location, radius);

  const config = {
    schema: GOOGLE_PLACES_SCHEMA,
    request: {
      endpoint,
      resourceType: 'json',
    },
  };

  return dispatch =>
    dispatch(find(config))
      .then(({ payload: { status, predictions } }) => {
        if (status === 'ZERO_RESULTS') {
          return dispatch({ type: NO_GOOGLE_PLACES_FOUND });
        }

        if (status !== 'OK') {
          return dispatch({ type: GOOGLE_PLACES_API_FAILED });
        }

        return dispatch({ type: GOOGLE_PLACES_LOADED, payload: predictions });
      })
      .catch(() => {
        return dispatch({ type: GOOGLE_PLACES_API_FAILED });
      });
}

export function fetchLiveForecast(place) {
  if (!place) {
    return { type: NO_LIVE_DATA_FOUND };
  }

  const endpoint = bestTime.buildLiveForecastUrl(place);

  const config = {
    schema: LIVE_FORECAST_SCHEMA,
    request: {
      endpoint,
      resourceType: 'json',
      method: 'POST',
    },
  };

  return dispatch =>
    dispatch(find(config))
      .then(({ payload }) => {
        if (payload.message === NO_LIVE_DATA_MESSAGE) {
          return dispatch({ type: NO_LIVE_DATA_FOUND });
        }

        return dispatch({ type: LIVE_FORECAST_LOADED, payload });
      })
      .catch(error => {
        if (error.payload.message.startsWith('404')) {
          return dispatch({ type: NO_LIVE_DATA_FOUND });
        }

        return dispatch({ type: LIVE_SERVICE_NOT_FOUND });
      });
}

export function fetchNewForecast(place) {
  if (!place) {
    return { type: NO_DATA_FOUND };
  }

  const endpoint = bestTime.buildNewForecastUrl(place);

  const config = {
    schema: NEW_FORECAST_SCHEMA,
    request: {
      endpoint,
      resourceType: 'json',
      method: 'POST',
    },
  };

  return dispatch =>
    dispatch(find(config))
      .then(({ payload }) => {
        return dispatch({ type: NEW_FORECAST_LOADED, payload });
      })
      .catch(error => {
        if (error.payload.message.startsWith('404')) {
          return dispatch({ type: NO_DATA_FOUND });
        }

        return dispatch({ type: NEW_SERVICE_NOT_FOUND });
      });
}

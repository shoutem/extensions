import pack from './package.json';

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

// Google Places API actions
export const ADD_RECENT_SEARCH = ext('ADD_RECENT_SEARCH');
export const CLEAR_GOOGLE_PLACE_DETAILS = ext('CLEAR_GOOGLE_PLACE_DETAILS');
export const CLEAR_GOOGLE_PLACES = ext('CLEAR_GOOGLE_PLACES');
export const GOOGLE_PLACE_DETAILS_LOADED = ext('GOOGLE_PLACE_DETAILS_LOADED');
export const GOOGLE_PLACES_API_FAILED = ext('GOOGLE_PLACES_API_FAILED');
export const GOOGLE_PLACES_LOADED = ext('GOOGLE_PLACES_LOADED');
export const NO_GOOGLE_PLACE_DETAILS_FOUND = ext(
  'NO_GOOGLE_PLACE_DETAILS_FOUND',
);
export const NO_GOOGLE_PLACES_FOUND = ext('NO_GOOGLE_PLACES_FOUND');

// BestTime.app API actions
export const CLEAR_LIVE_FORECAST = ext('CLEAR_LIVE_FORECAST');
export const CLEAR_NEW_FORECAST = ext('CLEAR_NEW_FORECAST');
export const LIVE_FORECAST_LOADED = ext('LIVE_FORECAST_LOADED');
export const LIVE_SERVICE_NOT_FOUND = ext('LIVE_SERVICE_NOT_FOUND');
export const NEW_FORECAST_LOADED = ext('NEW_FORECAST_LOADED');
export const NEW_SERVICE_NOT_FOUND = ext('NEW_SERVICE_NOT_FOUND');
export const NO_DATA_FOUND = ext('NO_DATA_FOUND');
export const NO_LIVE_DATA_FOUND = ext('NO_LIVE_DATA_FOUND');

export const GOOGLE_PLACES_SCHEMA = ext('GOOGLE_PLACES_SCHEMA');
export const GOOGLE_PLACE_DETAILS_SCHEMA = ext('GOOGLE_PLACE_DETAILS_SCHEMA');
export const LIVE_FORECAST_SCHEMA = ext('LIVE_FORECAST_SCHEMA');
export const NEW_FORECAST_SCHEMA = ext('NEW_FORECAST_SCHEMA');

// Descriptive errors for BestTime.app API
export const NO_DATA_FOUND_ERROR = 'NO_DATA_FOUND_ERROR';
export const NO_LIVE_DATA_FOUND_ERROR = 'NO_LIVE_DATA_FOUND_ERROR';

// Fallback and necessary data for graph
export const EMPTY_LIVE_FORECAST = Array(24).fill(0);
export const EMPTY_LIVE_FORECAST_BUSYNESS = 2;
export const EMPTY_RAW_DAY_FORECAST = Array(24).fill(1);
export const EMPTY_RAW_DAY_FORECAST_BUSYNESS = 1;
export const SHOWN_X_INDEXES = [2, 5, 8, 11, 14, 17, 20, 23];
export const X_AXIS_DATA = [...Array(24).keys()];

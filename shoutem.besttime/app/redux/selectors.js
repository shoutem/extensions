import {
  EMPTY_LIVE_FORECAST,
  EMPTY_LIVE_FORECAST_BUSYNESS,
  EMPTY_RAW_DAY_FORECAST,
  EMPTY_RAW_DAY_FORECAST_BUSYNESS,
  ext,
} from '../const';
import { getCurrentBestTimeDay, getCurrentHour } from '../services';

export function getGooglePlaceDetails(state) {
  return state[ext()].googlePlaceDetails;
}

export function getGooglePlaces(state) {
  return state[ext()].googlePlaces;
}

export function getLiveForecast(state) {
  return state[ext()].liveForecast;
}

export function getLiveBusyness(state) {
  const liveForecast = getLiveForecast(state);
  const liveBusyness =
    !liveForecast || liveForecast.error || liveForecast.unavailable
      ? EMPTY_LIVE_FORECAST_BUSYNESS
      : liveForecast.analysis.venue_live_busyness;

  return liveBusyness;
}

export function getNewForecast(state) {
  return state[ext()].newForecast;
}

export function getRawLiveForecast(state) {
  const liveBusyness = getLiveBusyness(state);
  const currentHour = getCurrentHour();
  const rawLiveForecast = EMPTY_LIVE_FORECAST;
  rawLiveForecast[currentHour] = liveBusyness;

  return rawLiveForecast;
}

export function getRawDayForecast(state) {
  const newForecast = getNewForecast(state);

  if (!newForecast || newForecast.error || newForecast.unavailable) {
    return EMPTY_RAW_DAY_FORECAST;
  }

  const currentDay = getCurrentBestTimeDay();
  const rawDayForecast = newForecast.analysis[currentDay].day_raw;
  const resolvedRawDayForecast = [];

  // BestTime.app API raw day info starts at 6AM and ends 5AM next day:
  // https://documentation.besttime.app/#forecast-day-window-and-weekdays
  rawDayForecast.forEach((hour, index) => {
    const adjustedIndex = index + 6;
    const resolvedIndex =
      adjustedIndex > 23 ? adjustedIndex - 24 : adjustedIndex;

    resolvedRawDayForecast[resolvedIndex] =
      hour === 0 ? EMPTY_RAW_DAY_FORECAST_BUSYNESS : hour;
  });

  return resolvedRawDayForecast;
}

export function getRecentSearches(state) {
  return state[ext()].recentSearches;
}

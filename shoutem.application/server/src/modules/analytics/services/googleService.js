import { cloneDeep, forEach, get, map, reduce } from 'lodash';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import {
  PLATFORM,
  resolveAnalyticsFilters,
  resolveAppAnalyticsTabs,
} from '../const';
import { formatXAxisLabels } from './graphService';

const moment = extendMoment(Moment);

const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_HOUR_FORMAT = 'YYYYMMDDHH';

// Keys are used for creating objects in store
const ANALYTICS_TABS = resolveAppAnalyticsTabs();

export const ANALYTICS = reduce(
  ANALYTICS_TABS,
  (result, value, key) => ({
    ...result,
    [key]: value.key,
  }),
  {},
);

export function formatDatetimeParams(filter) {
  const ANALYTICS_FILTERS = resolveAnalyticsFilters();
  const todayStart = moment().startOf('day');
  const todayEnd = moment(todayStart).add(1, 'day');

  if (filter === ANALYTICS_FILTERS.YESTERDAY) {
    return {
      startDate: moment(todayStart).subtract(1, 'day'),
      endDate: todayStart,
    };
  }

  if (filter === ANALYTICS_FILTERS.LAST_7_DAYS) {
    return {
      startDate: moment(todayStart).subtract(7, 'day'),
      endDate: todayEnd,
    };
  }

  if (filter === ANALYTICS_FILTERS.LAST_30_DAYS) {
    return {
      startDate: moment(todayStart).subtract(30, 'day'),
      endDate: todayEnd,
    };
  }

  return {
    startDate: todayStart,
    endDate: todayEnd,
  };
}

/**
 * Function used for formatting and combining Google analytics response data.
 * We should combine data for both iOS & Android and format by date.
 * @param {Array} data Data fetched from Google
 * @param {Object} accumulator Either empty object, or already existing data
 * @returns {Object} Analytics data
 */
function formatDataByDay(data, accumulator) {
  return reduce(
    data,
    (result, value) => {
      const dateTime = get(value, 'dimensionValues[0].value');
      const platform =
        get(value, 'dimensionValues[1].value') === 'iOS'
          ? PLATFORM.IOS
          : PLATFORM.ANDROID;

      const activeDevices = parseInt(get(value, 'metricValues[0].value', 0));
      const sessions = parseInt(get(value, 'metricValues[1].value', 0));
      const newDevices = parseInt(get(value, 'metricValues[2].value', 0));
      const occurrences = parseInt(get(value, 'metricValues[3].value', 0));

      const dateFormat =
        result.period === 'hour' ? DATE_HOUR_FORMAT : DATE_FORMAT;
      const date = moment(dateTime, dateFormat).format();

      // Each analytics category should have iOS, Android & total number
      const categories = {
        [ANALYTICS.DOWNLOADS]: {
          ...result.categories?.[ANALYTICS.DOWNLOADS],
          [platform]:
            get(result, ['categories', ANALYTICS.DOWNLOADS, platform], 0) +
            newDevices,
          total:
            get(result, ['categories', ANALYTICS.DOWNLOADS, 'total'], 0) +
            newDevices,
        },
        [ANALYTICS.SESSIONS]: {
          ...result.categories?.[ANALYTICS.SESSIONS],
          [platform]:
            get(result, ['categories', ANALYTICS.SESSIONS, platform], 0) +
            sessions,
          total:
            get(result, ['categories', ANALYTICS.SESSIONS, 'total'], 0) +
            sessions,
        },
        [ANALYTICS.ACTIVE_USERS]: {
          ...result.categories?.[ANALYTICS.ACTIVE_USERS],
          [platform]:
            get(result, ['categories', ANALYTICS.ACTIVE_USERS, platform], 0) +
            activeDevices,
          total:
            get(result, ['categories', ANALYTICS.ACTIVE_USERS, 'total'], 0) +
            activeDevices,
        },
        [ANALYTICS.PAGE_VIEWS]: {
          ...result.categories?.[ANALYTICS.PAGE_VIEWS],
          [platform]:
            get(result, ['categories', ANALYTICS.PAGE_VIEWS, platform], 0) +
            occurrences,
          total:
            get(result, ['categories', ANALYTICS.PAGE_VIEWS, 'total'], 0) +
            occurrences,
        },
      };

      const { period } = result;

      // If given date already exists, add new values to existing values
      // Otherwise, add new date to data object
      if (Object.keys(result.data).includes(date)) {
        const currentData = result.data[date];

        return {
          ...result,
          categories,
          data: {
            ...result.data,
            [date]: {
              date,
              xAxisLabel: formatXAxisLabels(date, period),
              [ANALYTICS.DOWNLOADS]:
                get(currentData, 'downloads', 0) + newDevices,
              [ANALYTICS.SESSIONS]: get(currentData, 'sessions', 0) + sessions,
              [ANALYTICS.ACTIVE_USERS]:
                get(currentData, 'activeUsers', 0) + activeDevices,
              [ANALYTICS.PAGE_VIEWS]:
                get(currentData, 'pageViews', 0) + occurrences,
            },
          },
        };
      }

      return {
        ...result,
        categories,
        data: {
          ...result.data,
          [date]: {
            date,
            xAxisLabel: formatXAxisLabels(date, period),
            [ANALYTICS.ACTIVE_USERS]: activeDevices,
            [ANALYTICS.DOWNLOADS]: newDevices,
            [ANALYTICS.SESSIONS]: sessions,
            [ANALYTICS.PAGE_VIEWS]: occurrences,
          },
        },
      };
    },
    accumulator,
  );
}

function formatTopPageViews(data) {
  const result = map(data, item => {
    const screenName = get(item, 'dimensionValues[0].value');
    const count = get(item, 'metricValues[0].value');

    return { [screenName]: count };
  });

  return result;
}

export function formatPageViewResponseData(response) {
  return formatTopPageViews(response?.rows);
}

export function formatResponseData(response, existingData) {
  const data = cloneDeep(existingData);
  const snappedRange = moment
    .range(data.startDate, data.endDate)
    .snapTo(data.period);
  const ranges = Array.from(snappedRange.by(data.period));

  const dateFormat = data.period === 'hour' ? DATE_HOUR_FORMAT : DATE_FORMAT;

  // google analytics API is returning only the dates that have events
  // so we are prepopulating data to have also dates with zero events
  forEach(ranges, dateTime => {
    const date = moment(dateTime, dateFormat).format();

    data.data = {
      ...data.data,
      [date]: {
        date,
        xAxisLabel: formatXAxisLabels(date, data.period),
        [ANALYTICS.ACTIVE_USERS]: 0,
        [ANALYTICS.DOWNLOADS]: 0,
        [ANALYTICS.SESSIONS]: 0,
        [ANALYTICS.PAGE_VIEWS]: 0,
      },
    };
  });

  return formatDataByDay(response?.rows, data);
}

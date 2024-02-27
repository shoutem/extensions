import i18next from 'i18next';
import LOCALIZATION from './localization';

export const moduleName = 'analytics';

// Keys used for adding values in store
export const PLATFORM = {
  IOS: 'ios',
  ANDROID: 'android',
};

export const INTERVALS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export function resolveAppAnalyticsTabs() {
  return {
    DOWNLOADS: {
      key: 'downloads',
      title: i18next.t(LOCALIZATION.CONSTANTS.DOWNLOADS),
    },
    SESSIONS: {
      key: 'sessions',
      title: i18next.t(LOCALIZATION.CONSTANTS.SESSIONS),
    },
    ACTIVE_USERS: {
      key: 'activeUsers',
      title: i18next.t(LOCALIZATION.CONSTANTS.ACTIVE_USERS),
    },
    PAGE_VIEWS: {
      key: 'pageViews',
      title: i18next.t(LOCALIZATION.CONSTANTS.PAGE_VIEWS),
    },
  };
}

export function resolveAnalyticsFilters() {
  return {
    TODAY: i18next.t(LOCALIZATION.CONSTANTS.TODAY),
    YESTERDAY: i18next.t(LOCALIZATION.CONSTANTS.YESTERDAY),
    LAST_7_DAYS: i18next.t(LOCALIZATION.CONSTANTS.LAST_7_DAYS),
    LAST_30_DAYS: i18next.t(LOCALIZATION.CONSTANTS.LAST_30_DAYS),
    CUSTOM_RANGE: i18next.t(LOCALIZATION.CONSTANTS.CUSTOM_RANGE),
  };
}

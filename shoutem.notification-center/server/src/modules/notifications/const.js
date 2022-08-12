import ext from '../../const';

export const moduleName = 'notifications';
export const NOTIFICATIONS = 'shoutem.legacy.notifications';

export const DISPLAY_DATE_FORMAT = 'DD MMMM YYYY';
export const DISPLAY_TIME_FORMAT = 'HH:mm';
export const DISPLAY_DATE_TIME_FORMAT = 'DD MMM YYYY HH:mm';

export const RECURRING_FEATURE = ext('recurring-push');

export const TARGET_TYPES = {
  APP: 'none',
  URL: 'url',
  SCREEN: 'screen',
};

export const AUDIENCE_TYPES = {
  ALL: 'broadcast',
  GROUP: 'group',
};

export const DELIVERY_TYPES = {
  NOW: 'now',
  SCHEDULED: 'scheduled',
  USER_SCHEDULED: 'user-scheduled',
};

export const RECURRING_PERIOD_TYPES = {
  NONE: 'none',
  EVERY_DAY: 'everyDay',
  EVERY_7_DAYS: 'every7Days',
  EVERY_30_DAYS: 'every30Days',
};

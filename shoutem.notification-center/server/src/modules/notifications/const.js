export const moduleName = 'notifications';
export const NOTIFICATIONS = 'shoutem.legacy.notifications';

export const DISPLAY_DATE_FORMAT = 'DD MMM YYYY';
export const DISPLAY_TIME_FORMAT = 'hh:mm';
export const DISPLAY_DATE_TIME_FORMAT = 'DD MMM YYYY hh:mm';

export const TARGET_TYPES = {
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
};

export const TARGET_OPTIONS = [
  { value: TARGET_TYPES.URL, label: 'URL' },
  { value: TARGET_TYPES.SCREEN, label: 'Screen' },
];

export const AUDIENCE_OPTIONS = [
  { value: AUDIENCE_TYPES.ALL, label: 'All' },
  { value: AUDIENCE_TYPES.GROUP, label: 'Group' },
];

export const DELIVERY_OPTIONS = [
  { value: DELIVERY_TYPES.NOW, label: 'Now' },
  { value: DELIVERY_TYPES.SCHEDULED, label: 'Scheduled' },
];

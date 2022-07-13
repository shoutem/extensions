export const moduleName = 'notification-journeys';

export const TARGET_VALUES = {
  URL: 'url',
  SCREEN: 'screen',
};

export const DEFAULT_JOURNEY_NOTIFICATION = {
  body: '',
  contentUrl: '',
  shortcutId: '',
  delay: 1,
  action: '',
  target: { value: TARGET_VALUES.URL },
  title: '',
};

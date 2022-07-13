import i18next from 'i18next';
import { TARGET_VALUES } from '../../const';
import LOCALIZATION from './localization';

export function getDelayOptions() {
  return [
    {
      label: `1 ${i18next.t(LOCALIZATION.NOTIFICATION_INPUT_MINUTE_LABEL)}`,
      value: 1,
    },
    {
      label: `5 ${i18next.t(LOCALIZATION.NOTIFICATION_INPUT_MINUTES_LABEL)}`,
      value: 5,
    },
    {
      label: `15 ${i18next.t(LOCALIZATION.NOTIFICATION_INPUT_MINUTES_LABEL)}`,
      value: 15,
    },
    {
      label: `30 ${i18next.t(LOCALIZATION.NOTIFICATION_INPUT_MINUTES_LABEL)}`,
      value: 30,
    },
    {
      label: `1 ${i18next.t(LOCALIZATION.NOTIFICATION_INPUT_HOUR_LABEL)}`,
      value: 60,
    },
    {
      label: `1 ${i18next.t(LOCALIZATION.NOTIFICATION_INPUT_DAY_LABEL)}`,
      value: 60 * 24,
    },
    {
      label: `7 ${i18next.t(LOCALIZATION.NOTIFICATION_INPUT_DAYS_LABEL)}`,
      value: 60 * 24 * 7,
    },
    {
      label: `30 ${i18next.t(LOCALIZATION.NOTIFICATION_INPUT_DAYS_LABEL)}`,
      value: 60 * 24 * 30,
    },
  ];
}

export function getTargetOptions() {
  return [
    {
      value: TARGET_VALUES.URL,
      label: i18next.t(LOCALIZATION.NOTIFICATION_INPUT_TARGET_URL),
    },
    {
      value: TARGET_VALUES.SCREEN,
      label: i18next.t(LOCALIZATION.NOTIFICATION_INPUT_TARGET_SCREEN),
    },
  ];
}

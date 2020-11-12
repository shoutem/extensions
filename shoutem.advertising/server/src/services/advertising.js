import i18next from 'i18next';
import LOCALIZATION from './localization';

export function getBannerPlacementOptions() {
  return [
    {
      value: 'Top',
      label: i18next.t(LOCALIZATION.BANNER_PLACEMENT_TOP_TITLE),
    },
    {
      value: 'Bottom',
      label: i18next.t(LOCALIZATION.BANNER_PLACEMENT_BOTTOM_TITLE),
    },
  ];
}

export function getAdContentRatings() {
  return [
    {
      value: 'G',
      label: i18next.t(LOCALIZATION.AD_CONTENT_RATING_GENERAL_AUDIENCES_TITLE),
    },
    {
      value: 'MA',
      label: i18next.t(LOCALIZATION.AD_CONTENT_RATING_MATURE_AUDIENCES_TITLE),
    },
    {
      value: 'PG',
      label: i18next.t(LOCALIZATION.AD_CONTENT_RATING_PARENTAL_GUIDANCE_TITLE),
    },
    {
      value: 'T',
      label: i18next.t(LOCALIZATION.AD_CONTENT_RATING_TEEN_TITLE),
    },
  ];
}

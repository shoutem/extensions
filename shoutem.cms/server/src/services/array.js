import _ from 'lodash';
import i18next from 'i18next';
import LOCALIZATION from './localization';

const MAX_VISIBLE_LABELS = 2;

export function getArrayDisplayLabel(
  labels,
  maxVisibleLabels = MAX_VISIBLE_LABELS,
) {
  const visibleCategories = _.slice(labels, 0, maxVisibleLabels);
  if (labels.length > maxVisibleLabels) {
    visibleCategories.push(
      i18next.t(LOCALIZATION.MORE_CATEGORIES, {
        count: labels.length - maxVisibleLabels,
      }),
    );
  }

  return visibleCategories.join(', ');
}

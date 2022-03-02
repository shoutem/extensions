import _ from 'lodash';
import i18next from 'i18next';
import LOCALIZATION from './localization';

export const ALL_CATEGORIES_OPTION_KEY = 'all';

export function getAllCategoriesOption() {
  return {
    key: ALL_CATEGORIES_OPTION_KEY,
    label: i18next.t(LOCALIZATION.ALL_CATEGORIES),
  };
}

export function isAllCategoriesSelected(selectedCategories) {
  return _.includes(selectedCategories, ALL_CATEGORIES_OPTION_KEY);
}

export function getAllCategoryName() {
  return i18next.t(LOCALIZATION.ALL_CATEGORY);
}

export function getCategoryName(category) {
  return _.get(category, 'name');
}

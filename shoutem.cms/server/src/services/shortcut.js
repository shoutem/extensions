import _ from 'lodash';
import { data } from 'context';

export function getSortFieldProperty() {
  return _.get(data, ['params', 'sortFieldProperty']) || 'sortField';
}

export function getSortOrderProperty() {
  return _.get(data, ['params', 'sortOrderProperty']) || 'sortOrder';
}

/**
 * Resolves sort options object from shortcut settings
 */
export function getSortOptions(shortcut) {
  const sortFieldProperty = getSortFieldProperty();
  const sortOrderProperty = getSortOrderProperty();

  const field = _.get(shortcut, `settings.${sortFieldProperty}`);
  const order = _.get(shortcut, `settings.${sortOrderProperty}`);

  // we consider sort settings set if they have value
  const hasSortSettings = !!field && !!order;
  if (!hasSortSettings) {
    return null;
  }

  return {
    field,
    order,
  };
}

export function getParentCategoryProperty() {
  return _.get(data, ['params', 'parentCategoryProperty']) || 'parentCategory';
}

export function getParentCategoryId(shortcut) {
  const parentCategoryProperty = getParentCategoryProperty();
  return _.get(shortcut, `settings.${parentCategoryProperty}.id`);
}

export function getVisibleCategoryIds(shortcut) {
  const visibleCategories = _.get(shortcut, 'settings.visibleCategories', []);
  return _.map(visibleCategories, 'id');
}

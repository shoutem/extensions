import _ from 'lodash';
import { data } from 'context';
import { SORT_OPTIONS } from '../const';

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

export function isManualSorting(shortcut) {
  const sortFieldProperty = getSortFieldProperty();
  const field = _.get(shortcut, `settings.${sortFieldProperty}`);

  return field === SORT_OPTIONS.MANUAL;
}

export function getParentCategoryProperty() {
  return _.get(data, ['params', 'parentCategoryProperty']) || 'parentCategory';
}

export function getOriginParentCategoryProperty() {
  return (
    _.get(data, ['params', 'originParentCategoryProperty']) ||
    'originParentCategory'
  );
}

export function getParentCategoryId(shortcut) {
  const parentCategoryProperty = getParentCategoryProperty();
  return _.get(shortcut, `settings.${parentCategoryProperty}.id`);
}

export function getOriginParentCategoryId(shortcut) {
  const originParentCategoryProperty = getOriginParentCategoryProperty();
  return _.get(shortcut, `settings.${originParentCategoryProperty}.id`);
}

export function getVisibleCategoryIds(shortcut) {
  const visibleCategories = _.get(shortcut, 'settings.visibleCategories', []);
  return _.map(visibleCategories, 'id');
}

export function getShortcutTitle(shortcut) {
  return _.get(shortcut, 'title');
}

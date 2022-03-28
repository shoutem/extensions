import _ from 'lodash';
import { invalidate } from '@shoutem/redux-io';
import { updateShortcutSettings } from '../builder-sdk';
import {
  getParentCategoryProperty,
  getOriginParentCategoryProperty,
  getSortFieldProperty,
  getSortOrderProperty,
} from '../services';
import { CATEGORIES, CURRENT_SCHEMA } from '../types';

export function initializeShortcutCategories(
  shortcut,
  parentCategoryId,
  visibleCategoryIds = [],
  schema = CURRENT_SCHEMA,
) {
  const visibleCategories = _.map(visibleCategoryIds, categoryId => ({
    type: CATEGORIES,
    id: categoryId,
  }));

  const parentCategoryProperty = getParentCategoryProperty();
  const originParentCategoryProperty = getOriginParentCategoryProperty();

  return dispatch => {
    const patch = {
      [parentCategoryProperty]: {
        type: CATEGORIES,
        id: parentCategoryId,
      },
      [originParentCategoryProperty]: {
        type: CATEGORIES,
        id: parentCategoryId,
      },
      visibleCategories,
    };

    return dispatch(updateShortcutSettings(shortcut, patch)).then(() => {
      dispatch(invalidate(CATEGORIES));
      dispatch(invalidate(schema));
    });
  };
}

export function updateShortcutCategories(
  shortcut,
  parentCategoryId,
  visibleCategoryIds = [],
  schema = CURRENT_SCHEMA,
) {
  const visibleCategories = _.map(visibleCategoryIds, categoryId => ({
    type: CATEGORIES,
    id: categoryId,
  }));

  const parentCategoryProperty = getParentCategoryProperty();

  return dispatch => {
    const patch = {
      [parentCategoryProperty]: {
        type: CATEGORIES,
        id: parentCategoryId,
      },
      visibleCategories,
    };

    return dispatch(updateShortcutSettings(shortcut, patch)).then(() => {
      dispatch(invalidate(CATEGORIES));
      dispatch(invalidate(schema));
    });
  };
}

export function updateShortcutSortOptions(
  shortcut,
  sortOptions,
  schema = CURRENT_SCHEMA,
) {
  const sortFieldProperty = getSortFieldProperty();
  const sortOrderProperty = getSortOrderProperty();

  return dispatch => {
    const patch = {
      [sortFieldProperty]: _.get(sortOptions, 'sortField'),
      [sortOrderProperty]: _.get(sortOptions, 'sortOrder'),
    };

    return dispatch(updateShortcutSettings(shortcut, patch)).then(() => {
      dispatch(invalidate(schema));
    });
  };
}

import { appId, url } from 'environment';
import _ from 'lodash';
import Uri from 'urijs';
import { invalidate, update } from '@shoutem/redux-io';
import { updateShortcutSettings } from '../builder-sdk';
import {
  getOriginParentCategoryProperty,
  getParentCategoryProperty,
  getSortFieldProperty,
  getSortOrderProperty,
} from '../services';
import { CATEGORIES, CURRENT_SCHEMA } from '../types';

const SHORTCUTS = 'shoutem.core.shortcuts';

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

export function updateShortcut(shortcut) {
  const uri = new Uri()
    .protocol('')
    .host(url.apps)
    .segment(['v1', 'apps', appId, 'shortcuts', shortcut.id])
    .toString();

  const config = {
    schema: SHORTCUTS,
    request: {
      endpoint: uri,
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  return update(config, {
    type: SHORTCUTS,
    ...shortcut,
  });
}

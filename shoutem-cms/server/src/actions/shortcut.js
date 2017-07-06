import _ from 'lodash';
import { updateShortcutSettings } from '../builder-sdk';
import { CATEGORIES } from '../types';

export function updateParentCategory(shortcut, parentCategoryId) {
  const patch = {
    parentCategory: {
      type: CATEGORIES,
      id: _.toString(parentCategoryId),
    },
  };

  return updateShortcutSettings(shortcut, patch);
}

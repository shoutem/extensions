import _ from 'lodash';
import { CATEGORIES } from '../modules/categories';

const ARROW_UNICODE = '\u2192';

function buildParentTitles(parentShortcutId, shortcuts, result = []) {
  const parentShortcut = _.find(shortcuts, { id: parentShortcutId });

  if (parentShortcut) {
    if (parentShortcut.parentShortcutId) {
      buildParentTitles(parentShortcut.parentShortcutId, shortcuts, result);
    }

    result.push(parentShortcut.title);
  }

  return result;
}

function flattenShortcuts(shortcuts, parentShortcutId = null) {
  return _.reduce(
    shortcuts,
    (result, shortcut) => {
      result.push({
        id: shortcut.id,
        title: shortcut.title,
        settings: shortcut.settings,
        parentShortcutId,
      });

      if (!_.isEmpty(shortcut.children)) {
        const childShortcuts = flattenShortcuts(shortcut.children, shortcut.id);
        return _.concat(result, childShortcuts);
      }

      return result;
    },
    [],
  );
}

export function buildShortcutCategoryTree(rawShortcuts, categories) {
  const tree = [];
  const shortcuts = flattenShortcuts(rawShortcuts);

  const cmsShortcuts = _.filter(shortcuts, shortcut => {
    const type = shortcut?.settings?.parentCategory?.type;
    const id = shortcut?.settings?.parentCategory?.id;

    return type === CATEGORIES && id;
  });

  _.forEach(cmsShortcuts, cmsShortcut => {
    const item = {
      id: cmsShortcut.id,
      title: cmsShortcut.title,
    };

    const shorcutCategories = _.filter(categories, category => {
      const parentCategoryId = cmsShortcut?.settings?.parentCategory?.id;
      return parentCategoryId === category?.parent?.id;
    });

    item.categories = _.map(shorcutCategories, item => {
      return { id: item.id, name: item.name };
    });

    const parentTitles = buildParentTitles(cmsShortcut.id, shortcuts);
    item.subtitle = _.join(parentTitles, ` ${ARROW_UNICODE} `);

    tree.push(item);
  });

  return tree;
}

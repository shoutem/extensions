import _ from 'lodash';

// Formatting for shortcut dropdowns
export function mapShortcutToView(shortcut) {
  return {
    id: shortcut.id,
    title: _.get(shortcut, 'title', ''),
  };
}

export function generateShortcutTree(rootShortcuts, shortcutTree, level = 0) {
  if (_.isEmpty(rootShortcuts)) {
    return undefined;
  }

  _.map(rootShortcuts, shortcut => {
    shortcutTree.push({ ...mapShortcutToView(shortcut), level });

    return generateShortcutTree(shortcut.children, shortcutTree, level + 1);
  });

  return shortcutTree;
}

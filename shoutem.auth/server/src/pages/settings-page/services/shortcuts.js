import _ from 'lodash';

export function buildShortcutTree(shortcuts, level = 0) {
  return _.reduce(shortcuts, (result, shortcut) => {
    result.push({ shortcut, level });

    if (shortcut.children) {
      const childShortcuts = buildShortcutTree(shortcut.children, level + 1);
      return [
        ...result,
        ...childShortcuts,
      ];
    }

    return result;
  }, []);
}

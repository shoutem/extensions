import _ from 'lodash';

/**
 * Resolves sort options object from shortcut settings
 */
export function getSortOptions(shortcut) {
  const field = _.get(shortcut, 'settings.sortField');
  const order = _.get(shortcut, 'settings.sortOrder');

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

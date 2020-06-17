import _ from 'lodash';

export function createOptions(
  items,
  valueProp = 'id',
  labelProp = 'name',
  extraProps = [],
) {
  if (_.isEmpty(items)) {
    return [];
  }

  return _.reduce(
    items,
    (result, item) => {
      const value = _.toString(_.get(item, valueProp));
      const label = _.get(item, labelProp);

      if (value && label) {
        const option = { value, label };

        _.forEach(extraProps, prop => {
          const propValue = _.get(item, prop);
          _.set(option, prop, propValue);
        });

        result.push(option);
      }

      return result;
    },
    [],
  );
}

export function buildShortcutTree(shortcuts, level = 0) {
  return _.reduce(
    shortcuts,
    (result, shortcut) => {
      result.push({ shortcut, level });

      if (shortcut.children) {
        const childShortcuts = buildShortcutTree(shortcut.children, level + 1);
        return _.concat(result, childShortcuts);
      }

      return result;
    },
    [],
  );
}

import _ from 'lodash';

export function getExtensionNameByScreenName(screenName) {
  const extensionName = _.split(screenName, '.');

  return `${extensionName[0]}.${extensionName[1]}`;
}

export function collectShortcutScreens(shortcut, screens) {
  const shortcutCanonicalName = _.get(shortcut, 'canonicalName');
  const extension = getExtensionNameByScreenName(shortcutCanonicalName);

  const collectedScreens = _.reduce(
    screens,
    (result, screen, name) => {
      const ownerExtension = getExtensionNameByScreenName(name);

      if (ownerExtension === extension) {
        result.push({ name, component: screen });
      }

      return result;
    },
    [],
  );

  const shortcutScreens = _.get(shortcut, 'screens');
  const resolvedShortcutScreens = _.reduce(
    shortcutScreens,
    (result, screen) => {
      const screenName = screen.canonicalName;

      result.push({
        name: screen.canonicalName,
        component: screens[screenName],
      });
      return result;
    },
    [],
  );

  return _.compact(
    _.uniqBy([...collectedScreens, ...resolvedShortcutScreens], 'name'),
  );
}

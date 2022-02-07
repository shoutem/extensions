import _ from 'lodash';

export function getExtensionNameByScreenName(screenName) {
  const extensionName = _.split(screenName, '.');

  return `${extensionName[0]}.${extensionName[1]}`;
}

export function collectShortcutScreens(shortcut, screens) {
  const shortcutCanonicalName = _.get(shortcut, 'canonicalName');
  const extension = getExtensionNameByScreenName(shortcutCanonicalName);

  const shortcutScreenName = _.get(shortcut, 'screens[0].canonicalName');
  const shortcutScreen = screens[shortcutScreenName];

  const resolvedShortcutScreen = shortcutScreenName
    ? { name: shortcutScreenName, component: shortcutScreen }
    : null;

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

  return _.compact(
    _.uniqBy([...collectedScreens, resolvedShortcutScreen], 'name'),
  );
}

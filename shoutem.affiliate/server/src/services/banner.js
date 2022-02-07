import _ from 'lodash';

export function resolveBannerLinkOptions(shortcuts) {
  return _.reduce(
    shortcuts,
    (result, shortcut) => {
      const resolvedShortcut = {
        id: shortcut.key,
        title: shortcut.title,
      };

      // Skip navigation shortcuts
      if (shortcut.children.length === 0) {
        result.push(resolvedShortcut);
      }

      if (shortcut.children.length > 0) {
        const childShortcuts = resolveBannerLinkOptions(shortcut.children);

        return _.concat(result, childShortcuts);
      }

      return result;
    },
    [],
  );
}

export function resolveBannerConfig(showBanner) {
  if (showBanner) {
    return {
      bannerConfig: { showBanner: true },
    };
  }

  return {
    bannerConfig: {
      showBanner: false,
      description: null,
      imageUrl: null,
      bannerLink: null,
      title: null,
    },
  };
}

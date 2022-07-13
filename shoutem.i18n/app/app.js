import React from 'react';
import I18n from 'i18n-js';
import _ from 'lodash';
import moment from 'moment';
import { AppInitQueue, setQueueTargetComplete } from 'shoutem.application';
import { getExtensionSettings } from 'shoutem.application/redux';
import { after, priorities, setPriority } from 'shoutem-core';
// Load locale data into moment
import 'moment/min/locales';
import { ext } from './const';
import { LocalizationProvider } from './providers';
import { actions, selectors } from './redux';
import customTranslations from './translations';

const runtimeTranslations = {};
const translationsNotDownloaded =
  customTranslations === 'TRANSLATIONS_NOT_DOWNLOADED';

AppInitQueue.addExtension(ext());

/**
 * Merges all translations found in `translationsToAdd` into
 * `targetTranslations`. The translations from `translationsToAdd`
 * will override the translations from `targetTranslations` in case
 * the same translation keys exist in both.
 *
 * Both arguments should be maps where the key is the locale, and
 * the value is the translations object, e.g.:
 * ```
 * {
 *   'en-GB': {
 *     namespace: {
 *       key1: 'Translation string 1',
 *       key2: 'Translation string 2'
 *     },
 *     namespace2: {
 *       key3: 'Translation string 3'
 *     }
 *   }
 * }
 * ```
 */
const mergeTranslations = (targetTranslations, translationsToAdd) => {
  for (const language of _.keys(translationsToAdd)) {
    // eslint-disable-next-line no-param-reassign

    targetTranslations[language] = _.merge(
      targetTranslations[language] || {},
      translationsToAdd[language],
    );
  }
};

// Load all translations exported from other extensions, extensions can export
// their own translations under the `shoutem.i18n` key, for example:
// ```
// export const shoutem = {
//   i18n: {
//     translations: {
//       en: { <translations object> }
//     }
//   }
// }
// ```
const getTranslationsFromExtensions = extensions => {
  const i18nExtension = ext();

  const allTranslations = _.reduce(
    _.values(extensions),
    (translations, extension) => {
      const extTranslations = _.get(extension, `${i18nExtension}.translations`);
      mergeTranslations(translations, extTranslations);
      return translations;
    },
    {},
  );

  return allTranslations;
};

// Fetches translation object from URL
const getTranslationObjects = (url, language) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(translation => resolve({ language, translation }))
      .catch(error => reject(error));
  });
};

export const appWillMount = setPriority(async app => {
  const extensions = app.getExtensions();
  const store = app.getStore();
  const state = app.getState();

  const { dispatch } = store;

  // Load all translations provided by the extensions themselves
  const translations = getTranslationsFromExtensions(extensions);

  // If translation files don't exist try to generate them on the app launch
  if (translationsNotDownloaded) {
    const settings = getExtensionSettings(state, 'shoutem.i18n');
    const customLanguages = _.get(settings, 'translations', {});
    const shortcutTranslations = _.get(settings, 'shortcuts', {});
    const currentlySelectedLocale = selectors.getSelectedLocale(state);
    const locale = _.get(settings, 'locale', 'en');
    const customLanguageKeys = _.keys(customLanguages);
    const translationObjectPromises = _.map(customLanguageKeys, language =>
      getTranslationObjects(customLanguages[language], language),
    );

    const translationObjects = await Promise.all(translationObjectPromises);

    // Create translation object for each language
    _.forEach(translationObjects, translationObject => {
      const { language, translation } = translationObject;

      const shortcuts = _.reduce(
        _.keys(shortcutTranslations),
        (result, shortcut) => {
          const value = shortcutTranslations[shortcut][language];

          if (_.isEmpty(value)) {
            return result;
          }

          return _.merge({}, result, {
            [shortcut]: value,
          });
        },
        {},
      );

      // Merge shortcut translations into translation object
      const resolvedTranslation = _.merge({}, translation, {
        shoutem: {
          navigation: {
            shortcuts,
          },
        },
      });

      // Save translation object
      _.assign(runtimeTranslations, { [language]: resolvedTranslation });
    });

    // Set locale if the user changes default language in extension settings
    if (currentlySelectedLocale !== locale) {
      dispatch(actions.setLocale(locale));
    }
  }

  // Hide the launch screen
  dispatch(setQueueTargetComplete(ext()));

  // Add custom translations configured on the server, those are the
  // translations configured by the app owner on the server
  const resolvedTranslations = translationsNotDownloaded
    ? runtimeTranslations
    : customTranslations;

  mergeTranslations(translations, resolvedTranslations);

  I18n.translations = {
    ...I18n.translations,
    ...translations,
  };
}, after(priorities.INIT));

export const appDidMount = app => {
  // Load the current locale from extension settings
  const state = app.getState();
  const store = app.getStore();
  const { dispatch } = store;
  const defaultLocale = 'en';
  const { locale = defaultLocale } = getExtensionSettings(state, ext());
  const currentlySelectedLocale = selectors.getSelectedLocale(state);
  const activeLocales = selectors.getActiveLocales(state);

  const hasSelectedLocale =
    !_.isEmpty(currentlySelectedLocale) &&
    _.includes(activeLocales, currentlySelectedLocale);
  const resolvedLocale = hasSelectedLocale ? currentlySelectedLocale : locale;

  if (!hasSelectedLocale) {
    dispatch(actions.setLocale(locale));
  }

  I18n.fallbacks = defaultLocale;
  I18n.defaultLocale = defaultLocale;
  I18n.locale = resolvedLocale;

  // Configure the moment library to use the same locale as the app
  moment.locale(resolvedLocale);
};

export const renderProvider = setPriority(children => {
  return <LocalizationProvider>{children}</LocalizationProvider>;
}, after(priorities.REDUX));

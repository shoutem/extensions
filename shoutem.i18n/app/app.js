import _ from 'lodash';
import I18n from 'i18n-js';

import moment from 'moment';
// Load locale data into moment
import 'moment/min/locales';

import { getExtensionSettings } from 'shoutem.application';

import { ext } from './const';
import customTranslations from './translations';

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
      translationsToAdd[language]
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

  const allTranslations = _.reduce(_.values(extensions), (translations, extension) => {
    const extTranslations = _.get(extension, `${i18nExtension}.translations`);
    mergeTranslations(translations, extTranslations);
    return translations;
  }, {});

  return allTranslations;
};

export const appWillMount = app => {
  const extensions = app.getExtensions();

  // Load all translations provided by the extensions themselves
  const translations = getTranslationsFromExtensions(extensions);

  // Add custom translations configured on the server, those are the
  // translations configured by the app owner on the server
  mergeTranslations(translations, customTranslations);

  I18n.translations = {
    ...I18n.translations,
    ...translations,
  };
};

export const appDidMount = app => {
  // Load the current locale from extension settings
  const state = app.getState();
  const defaultLocale = 'en';
  const { locale = defaultLocale } = getExtensionSettings(state, ext());

  I18n.fallbacks = defaultLocale;
  I18n.defaultLocale = defaultLocale;
  I18n.locale = locale;

  // Configure the moment library to use the same locale as the app
  moment.locale(locale);
};

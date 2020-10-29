import _ from 'lodash';
import i18next from 'i18next';
import { LANGUAGES } from 'src/services';

export function resolveTranslationRows(
  translations,
  locale,
  disabledTranslations,
) {
  return _.chain(translations)
    .mapValues((url, code) => {
      // return only if code and url exist
      // delete is only possible if language is not default(locale)
      const status = _.get(disabledTranslations, code);
      if (code && url) {
        return {
          deleteDisabled: locale === code,
          statusDisabled: locale === code,
          status: !status,
          code,
          url,
          name: i18next.t(LANGUAGES[code]),
          id: code,
        };
      }

      return null;
    })
    .values()
    .compact()
    .sortBy(['name'])
    .value();
}

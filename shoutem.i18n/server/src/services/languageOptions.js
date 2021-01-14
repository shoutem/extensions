import _ from 'lodash';
import i18next from 'i18next';
import { LANGUAGES } from 'src/services';

export function createLanguageOptions(languageCodes) {
  return _.chain(LANGUAGES)
        .mapValues((name, code) => ({ value: code, label: i18next.t(name) }))
        .values()
        .filter(
          languageOption =>
            _.isEmpty(languageCodes) ||
            _.includes(languageCodes, languageOption.value),
        )
        .sortBy(['label'])
        .value();
}

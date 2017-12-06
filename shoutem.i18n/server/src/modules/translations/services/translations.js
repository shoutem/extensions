import _ from 'lodash';
import { LANGUAGES } from 'src/services';

export function prepareTranslations(translations) {
  return _.chain(translations)
    .mapValues((url, code) => (
      {
        code,
        url,
        name: LANGUAGES[code],
        id: code,
      }
    ))
    .values()
    .sortBy(['name'])
    .value();
}

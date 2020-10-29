import i18next from 'i18next';
import { readFileAsText } from './readFileAsText';
import LOCALIZATION from './localization';

export function validateJson(file) {
  return readFileAsText(file).then(fileText => {
    try {
      JSON.parse(fileText);
    } catch (e) {
      throw new Error(i18next.t(LOCALIZATION.ERROR_INVALID_FILE));
    }
  });
}

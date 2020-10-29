import pack from '../package.json';

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const DEFAULT_LANGUAGE_CODE = 'en';
export const DEFAULT_LANGUAGE_URL =
  'https://shoutem.github.io/static/localization/en.json';
export const DEFAULT_LANGUAGE_URL_ZIP =
  'https://shoutem.github.io/static/localization/en.json.zip';
export const LOCALIZATION_TUTORIAL_URL =
  'https://shoutem.github.io/docs/extensions/tutorials/using-localization';

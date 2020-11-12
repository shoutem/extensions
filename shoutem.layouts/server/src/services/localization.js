import i18next from 'i18next';

export function translateExt18n(extCanonicalName, key) {
  if (!key) {
    return null;
  }

  const translationKey = `${extCanonicalName}:${key}`;
  const translation = i18next.t(translationKey);

  return translation;
}

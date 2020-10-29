import i18next from 'i18next';
import LOCALIZATION from './localization';

function validateRequiredField(fieldValue) {
  if (!fieldValue) {
    return i18next.t(LOCALIZATION.VALUE_REQUIRED_TEXT);
  }

  return null;
}

export function validateGroup(group) {
  const { name, imageUrl } = group;

  return {
    name: validateRequiredField(name),
    imageUrl: validateRequiredField(imageUrl),
  };
}

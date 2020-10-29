import i18next from 'i18next';
import LOCALIZATION from './localization';

export function nonEmptyField(value) {
  if (!value) {
    return i18next.t(LOCALIZATION.VALUE_REQUIRED);
  }
  return null;
}

export default function validateFirebaseConfig(values) {
  const errors = {};

  errors.projectName = nonEmptyField(values.projectName);
  errors.serverKey = nonEmptyField(values.serverKey);

  if (!values.googleServicesJson && !values.googleServiceInfoPlist) {
    const message = i18next.t(LOCALIZATION.GOOGLE_SERVICES_REQUIRED);
    errors.googleServicesJson = message;
    errors.googleServiceInfoPlist = message;
  }

  return errors;
}

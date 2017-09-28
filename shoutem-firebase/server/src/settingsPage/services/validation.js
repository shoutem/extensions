export function nonEmptyField(value) {
  if (!value) {
    return 'Value is required';
  }
  return null;
}

export default function validateFirebaseConfig(values) {
  const errors = {};

  errors.projectName = nonEmptyField(values.projectName);
  errors.serverKey = nonEmptyField(values.serverKey);

  if (!values.googleServicesJson && !values.googleServiceInfoPlist) {
    const message = 'Either google-services.json or GoogleService-Info.plist must be populated';
    errors.googleServicesJson = message;
    errors.googleServiceInfoPlist = message;
  }

  return errors;
}

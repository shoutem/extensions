const ERROR_CODES = {
  DUPLICATE_USERNAME: 'legacy_resource_conflict_default',
  DUPLICATE_EMAIL: 'legacy_authentication_conflict_usernameNotAvailable',
};

export function getErrorMessage(errorCode) {
  if (errorCode === ERROR_CODES.DUPLICATE_USERNAME) {
    return { nick: 'User with this username already exists' };
  }

  if (errorCode === ERROR_CODES.DUPLICATE_EMAIL) {
    return { email: 'User with this email already exists.' };
  }

  return { _error: 'Something went wrong, please try again' };
}

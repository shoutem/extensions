const ERROR_CODES = {
  DUPLICATE_USERNAME: 'auth_auth_validation_usernameTaken',
  DUPLICATE_EMAIL: 'auth_auth_validation_usernameTaken',
};

export function getErrorMessage(errorCode) {
  if (errorCode === ERROR_CODES.DUPLICATE_USERNAME) {
    return { nick: 'User with this username already exists' };
  }

  if (errorCode === ERROR_CODES.DUPLICATE_EMAIL) {
    return { username: 'User with this email already exists.' };
  }

  return { _error: 'Something went wrong, please try again' };
}

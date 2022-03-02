import _ from 'lodash';

function resolveErrorMessage(errorMessage) {
  if (_.isArray(errorMessage)) {
    return _.upperFirst(_.head(errorMessage));
  }

  if (_.isString(errorMessage)) {
    return errorMessage;
  }

  return null;
}

export function handleGingerError(error) {
  if (error.response) {
    const response = error?.response;

    if (response.message) {
      return resolveErrorMessage(response.message);
    }

    if (response.error.messages) {
      return resolveErrorMessage(response.error.messages);
    }
  }

  return null;
}

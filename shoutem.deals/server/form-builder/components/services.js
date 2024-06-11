import _ from 'lodash';

const AWS_PREFIX = 's3.amazonaws.com/';

export function fieldInError(formField) {
  return formField.touched && formField.error;
}

export function resolveCdnUrl(url) {
  if (_.isEmpty(url)) {
    return url;
  }

  return _.replace(url, AWS_PREFIX, '');
}

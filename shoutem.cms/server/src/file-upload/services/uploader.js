import _ from 'lodash';

const AWS_PREFIX = 's3.amazonaws.com/';

export function resolveCdnUrl(url) {
  if (_.isEmpty(url)) {
    return url;
  }

  return _.replace(url, AWS_PREFIX, '');
}

import _ from 'lodash';

function getPublishStatus(applicationStatus) {
  if (_.isObject(applicationStatus)) {
    return _.get(applicationStatus, 'publish.status');
  }
  return null;
}

export function isPublished(applicationStatus) {
  const publishStatus =
    getPublishStatus(applicationStatus) || applicationStatus;
  return publishStatus === 'published';
}

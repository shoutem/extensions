import _ from 'lodash';

/**
 * Returns the lead image URL from the provided RSS resource
 *
 * @param resource The RSS resource.
 * @returns {string} The image URL or undefined.
 */
export function getLeadImageUrl(resource) {
  return _.get(resource, 'imageAttachments[0].src');
}

/**
 * Returns the lead image URL from the provided RSS resource
 *
 * @param resource The RSS resource.
 * @returns {string} The image URL or undefined.
 */
export function getAttachments(resource) {
  // We don't want to show the lead image in the attachments
  const images = _.reject(resource.imageAttachments, { src: getLeadImageUrl(resource) });

  return {
    images,
    videos: resource.videoAttachments,
    audios: resource.audioAttachments,
  };
}

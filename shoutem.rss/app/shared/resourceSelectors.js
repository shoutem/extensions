import _ from 'lodash';

export function getAttachments(resource, type) {
  return _.get(resource, `${type}Attachments`);
}

export function getLeadAttachment(resource, type) {
  return _.get(resource, `${type}Attachments[0]`);
}

/**
 * Returns the lead image URL from the provided RSS resource
 *
 * @param resource The RSS resource.
 * @returns {string} The image URL or undefined.
 */
export function getLeadImageUrl(resource) {
  return _.get(getLeadAttachment(resource, 'image'), 'src');
}

export function isLeadAttachment(resource, attachmentId, type) {
  const leadAttachment = getLeadAttachment(resource, type);
  return leadAttachment && leadAttachment.id === attachmentId;
}

/**
 * Returns all image attachments without lead image
 */
export function getImageAttachments(resource) {
  const imageAttachments = getAttachments(resource, 'image');

  return _.reject(imageAttachments, attachment =>
    isLeadAttachment(resource, attachment.id, 'image'),
  );
}

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import SeGallery from './SeGallery';

/**
 * Shoutem attachments can have prop names in both camelCase and snake_case.
 * This function standardizes them to always be camelCase.
 * @param attachment
 * @returns {*}
 */
function formatAttachmentPropNames(attachment) {
  return _.reduce(
    attachment,
    (result, val, key) => {
      const formattedKey = _.camelCase(key);
      return {
        ...result,
        [formattedKey]: val,
      };
    },
    {},
  );
}

function resolveAttributes(element, resource) {
  if (!resource) {
    return formatAttachmentPropNames(element.attributes);
  }

  const { type, id } = element.attributes;

  const attachments = _.get(resource, `${type}Attachments`);
  const attachment = _.find(attachments, { id });

  return {
    ...formatAttachmentPropNames(attachment),
    ...element.attributes,
  };
}

/**
 * Handle Shoutem attachment elements. Entry point for all
 * Shoutem attachments, depending on type appropriate Shoutem
 * component will be passed to handle html data. Transform
 * attachments into the RN components.
 *
 * Both se-attachment and attachment element (created by Shoutem)
 * have the same behaviour. They can have the resource data parsed
 * in the Html or stored in the object outside the parsed html.
 *
 * @param element Html attachment element
 * @param resource (optional)
 *  Currently rendered item that includes current attachment.
 *  Attachment types: video, audio (not supported), image, gallery.
 *
 *  The item shape:
 *    {
 *      string: type,
 *      array: ${type}Attachments,
 *      ...options
 *    }
 *
 *  For example:
 *    {
 *      type: 'image',
 *      imageAttachments: [image1, image2]
 *    }
 *
 *  The attachment shape:
 *    {
 *      string: id, // Required
 *      ...options // Attachment attribute (source, thumbnail, width, height, etc.)
 *    }
 *
 * @param renderElement
 * @param style
 */
export default function SeAttachment(props) {
  const { element, renderElement, resource, style } = props;
  const { type } = element.attributes;

  const attributes = resolveAttributes(element, resource);
  const el = {
    ...element,
    attributes,
  };

  if (type === 'gallery') {
    return <SeGallery {...props} element={el} style={style.gallery} />;
  }

  if (type === 'video') {
    return renderElement({ ...el, tag: 'video' });
  }

  if (type === 'image') {
    return renderElement({ ...el, tag: 'img' });
  }

  if (type === 'audio') {
    return renderElement({ ...el, tag: 'audio' });
  }

  // eslint-disable-next-line no-console
  console.error('Unhandled SeAttachment type: ', type);
  return null;
}

SeAttachment.propTypes = {
  element: PropTypes.object,
  resource: PropTypes.object,
  style: PropTypes.object,
  renderElement: PropTypes.func,
};

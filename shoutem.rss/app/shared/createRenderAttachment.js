import React from 'react';
import _ from 'lodash';

import { SeAttachment } from 'shoutem.application/html';
import { isLeadAttachment } from './resourceSelectors';

export default (resource, leadingAttachmentType) => (element, style, renderElement) => {
  const { tag } = element;
  const id = _.get(element, 'attributes.id');

  if (tag === 'attachment' && id) {
    if (isLeadAttachment(resource, id, leadingAttachmentType)) {
      // Skip the leading attachment because it's shown in the header.
      return null;
    }

    return (
      <SeAttachment
        element={element}
        style={style}
        renderElement={renderElement}
        resource={resource}
      />
    );
  }
}

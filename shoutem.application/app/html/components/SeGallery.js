import React from 'react';
import PropTypes from 'prop-types';

import { Gallery, combineMappers, mapElementProps } from '@shoutem/ui/html';

function createDataFromchildElements(childElements) {
  return childElements.reduce((data, element) => {
    const { attributes } = element;
    if (attributes.src) {
      // The element can be a text node, just an EOL or similar.
      // Skipping those for the SeGallery.
      data.push({ source: { uri: attributes.src } });
    }
    return data;
  }, []);
}

/**
 * Render "gallery" type Shoutem Attachment.
 * Transform Shoutem gallery html data to RN component with props.
 */
function SeGallery(props) {
  const data = createDataFromchildElements(props.childElements);

  return <Gallery {...props} data={data} />;
}

SeGallery.propTypes = {
  childElements: PropTypes.array,
};

export default combineMappers(mapElementProps)(SeGallery);

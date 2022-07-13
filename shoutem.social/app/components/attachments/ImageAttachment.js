import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Lightbox } from '@shoutem/ui';
import { ext } from '../../const';

function ImageAttachment({ enableImagePreview, isComment, source, style }) {
  const resolvedStyle = useMemo(
    () => (isComment ? style.commentAttachment : style.statusAttachment),
    [isComment, style.commentAttachment, style.statusAttachment],
  );

  if (!source?.uri) {
    return null;
  }

  if (enableImagePreview) {
    return (
      <Lightbox activeProps={{ styleName: 'preview' }}>
        <Image source={source} style={resolvedStyle} />
      </Lightbox>
    );
  }

  return <Image source={source} style={resolvedStyle} />;
}

ImageAttachment.propTypes = {
  enableImagePreview: PropTypes.bool.isRequired,
  isComment: PropTypes.bool.isRequired,
  source: PropTypes.object,
  style: PropTypes.object,
};

ImageAttachment.defaultProps = {
  source: null,
  style: {},
};

export default connectStyle(ext('ImageAttachment'))(ImageAttachment);

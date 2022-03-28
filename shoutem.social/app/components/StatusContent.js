import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Lightbox, SimpleHtml } from '@shoutem/ui';
import { ext } from '../const';

function StatusContent({
  enableImageFullScreen,
  text,
  leadAttachmentUrl,
  style,
}) {
  return (
    <>
      <SimpleHtml body={text} />
      {leadAttachmentUrl && enableImageFullScreen && (
        <Lightbox activeProps={{ styleName: 'preview' }}>
          <Image
            styleName="large-wide"
            style={style.image}
            resizeMode="contain"
            source={{ uri: leadAttachmentUrl }}
          />
        </Lightbox>
      )}
      {leadAttachmentUrl && !enableImageFullScreen && (
        <Image
          styleName="large-wide"
          style={style.image}
          resizeMode="contain"
          source={{ uri: leadAttachmentUrl }}
        />
      )}
    </>
  );
}

StatusContent.propTypes = {
  text: PropTypes.string.isRequired,
  enableImageFullScreen: PropTypes.bool,
  leadAttachmentUrl: PropTypes.string,
  style: PropTypes.object,
};

StatusContent.defaultProps = {
  enableImageFullScreen: false,
  leadAttachmentUrl: undefined,
  style: {},
};

export default connectStyle(ext('StatusContent'))(StatusContent);

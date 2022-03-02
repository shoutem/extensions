import React from 'react';
import { Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Lightbox, SimpleHtml } from '@shoutem/ui';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';

function StatusContent({
  enableComments,
  enableImageFullScreen,
  enableInteractions,
  enablePhotoAttachments,
  text,
  leadAttachmentUrl,
  statusId,
  style,
}) {
  function handleOpenDetails() {
    navigateTo(ext('StatusDetailsScreen'), {
      statusId,
      enableComments,
      enableInteractions,
      enablePhotoAttachments,
    });
  }

  return (
    <Pressable onPress={handleOpenDetails}>
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
    </Pressable>
  );
}

StatusContent.propTypes = {
  enableComments: PropTypes.bool.isRequired,
  enableInteractions: PropTypes.bool.isRequired,
  enablePhotoAttachments: PropTypes.bool.isRequired,
  statusId: PropTypes.number.isRequired,
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

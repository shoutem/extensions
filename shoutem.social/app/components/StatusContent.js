/* eslint-disable camelcase */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { SimpleHtml, View } from '@shoutem/ui';
import { ext } from '../const';
import { AttachmentResolver } from '../fragments';
import { convertToHtml } from '../services';

// enableImageFullScreen: true for status details screen - full screen image preview available
// enableImageFullScreen: false for SocialWallScreen
function StatusContent({ attachments, enableImageFullScreen, style, text }) {
  const statusHtml = useMemo(() => convertToHtml(text), [text]);
  // Keeping shoutem_attachments[0]?.url_large for backwards compatibility
  const userAttachment = attachments[0] || {};

  return (
    <View styleName="md-gutter-horizontal">
      <SimpleHtml body={statusHtml} style={style.statusText} />
      <AttachmentResolver
        enableImagePreview={enableImageFullScreen}
        statusText={text}
        userAttachment={{ uri: userAttachment.url || userAttachment.url_large }}
      />
    </View>
  );
}

StatusContent.propTypes = {
  attachments: PropTypes.array.isRequired,
  enableImageFullScreen: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};

StatusContent.defaultProps = {
  style: {},
};

export default connectStyle(ext('StatusContent'))(StatusContent);

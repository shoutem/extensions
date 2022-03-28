import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Text, Touchable } from '@shoutem/ui';
import { ext } from '../../../const';

export function EmptyImagesView({ icon, onUploadPress, uploadMessage, style }) {
  return (
    <Touchable style={style.uploadContainer} onPress={onUploadPress}>
      <Icon name={icon} style={style.icon} />
      <Text style={style.uploadMessage}>{uploadMessage}</Text>
    </Touchable>
  );
}

EmptyImagesView.propTypes = {
  uploadMessage: PropTypes.string.isRequired,
  onUploadPress: PropTypes.func.isRequired,
  icon: PropTypes.string,
  style: PropTypes.object,
};

EmptyImagesView.defaultProps = {
  icon: 'attach-media',
  style: {},
};

export default connectStyle(ext('EmptyImagesView'))(EmptyImagesView);

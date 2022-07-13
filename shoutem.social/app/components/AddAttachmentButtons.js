import React, { useCallback } from 'react';
import { Alert, Keyboard as RNKeyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { attachmentService } from '../services';

function AddAttachmentButtons({ onAttachmentSelected, style }) {
  const handleCameraPress = useCallback(() => {
    RNKeyboard.dismiss();

    return attachmentService.openCamera(handleImageSelected);
  }, [handleImageSelected]);

  const handleGalleryPress = useCallback(() => {
    RNKeyboard.dismiss();

    return attachmentService.openImageGallery(handleImageSelected);
  }, [handleImageSelected]);

  const handleImageSelected = useCallback(
    image => {
      if (image.size > attachmentService.MAX_IMAGE_SIZE) {
        Alert.alert(
          I18n.t(ext('imageSizeWarning'), {
            maxSize: attachmentService.MAX_IMAGE_SIZE / (1024 * 1024),
          }),
        );

        return null;
      }

      return onAttachmentSelected({
        uri: image.path,
        // Only iOS has filename property. For Android, we get the last segment of file path
        fileName:
          image.filename ||
          image.path.substring(image.path.lastIndexOf('/') + 1),
      });
    },
    [onAttachmentSelected],
  );

  return (
    <View style={style.attachmentsContainer}>
      <TouchableOpacity onPress={handleCameraPress} style={style.button}>
        <Icon name="camera" style={style.attachmentIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGalleryPress} style={style.button}>
        <Icon name="gallery" style={style.attachmentIcon} />
      </TouchableOpacity>
    </View>
  );
}

AddAttachmentButtons.propTypes = {
  onAttachmentSelected: PropTypes.func.isRequired,
  style: PropTypes.object,
};

AddAttachmentButtons.defaultProps = {
  style: {},
};

export default connectStyle(ext('AddAttachmentButtons'))(AddAttachmentButtons);

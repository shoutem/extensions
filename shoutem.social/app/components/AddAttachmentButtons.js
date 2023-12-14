import React, { useState } from 'react';
import { Alert, Keyboard as RNKeyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Text, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { attachmentService } from '../services';
import GiphyPicker from './GiphyPicker';

const AddAttachmentButtons = ({
  onAttachmentSelected,
  enableGifAttachments,
  enablePhotoAttachments,
  giphyApiKey,
  style,
}) => {
  const [giphyPickerVisible, setGiphyPickerVisible] = useState(false);

  const handleCameraPress = () => {
    RNKeyboard.dismiss();

    return attachmentService.openCamera(handleAttachmentSelected);
  };

  const handleGalleryPress = () => {
    RNKeyboard.dismiss();

    return attachmentService.openImageGallery(handleAttachmentSelected);
  };

  const handleAttachmentSelected = attachment => {
    setGiphyPickerVisible(false);

    if (attachment.size > attachmentService.MAX_ATTACHMENT_SIZE) {
      Alert.alert(
        I18n.t(ext('imageSizeWarning'), {
          maxSize: attachmentService.MAX_ATTACHMENT_SIZE / (1024 * 1024),
        }),
      );

      return null;
    }

    return onAttachmentSelected(attachment);
  };

  if (!enableGifAttachments && !enablePhotoAttachments) {
    return null;
  }

  return (
    <View style={style.attachmentsContainer}>
      {enablePhotoAttachments && (
        <>
          <TouchableOpacity onPress={handleCameraPress} style={style.button}>
            <Icon name="camera" style={style.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGalleryPress} style={style.button}>
            <Icon name="gallery" style={style.icon} />
          </TouchableOpacity>
        </>
      )}
      {enableGifAttachments && (
        <>
          <TouchableOpacity
            onPress={() => setGiphyPickerVisible(true)}
            style={style.button}
          >
            <Text style={style.buttonText}>GIF</Text>
          </TouchableOpacity>
          <GiphyPicker
            apiKey={giphyApiKey}
            isVisible={giphyPickerVisible}
            onGifSelected={handleAttachmentSelected}
            onClose={() => setGiphyPickerVisible(false)}
          />
        </>
      )}
    </View>
  );
};

AddAttachmentButtons.propTypes = {
  giphyApiKey: PropTypes.string.isRequired,
  onAttachmentSelected: PropTypes.func.isRequired,
  enableGifAttachments: PropTypes.bool,
  enablePhotoAttachments: PropTypes.bool,
  style: PropTypes.object,
};

AddAttachmentButtons.defaultProps = {
  enableGifAttachments: true,
  enablePhotoAttachments: true,
  style: {},
};

export default connectStyle(ext('AddAttachmentButtons'))(AddAttachmentButtons);

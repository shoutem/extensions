import React, { useCallback, useMemo, useState } from 'react';
import { Keyboard as RNKeyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, LoadingContainer, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../const';
import { attachmentService, createResizedImage } from '../services';
import RecentImages from './RecentImages';

function NewStatusFooter({ enablePhotoAttachments, onImageSelected, style }) {
  const [isResizingImage, setResizingImage] = useState(false);

  function handleCameraSelectPress() {
    RNKeyboard.dismiss();

    return attachmentService.openCamera(onImageSelected);
  }

  function handleGallerySelectPress() {
    RNKeyboard.dismiss();

    return attachmentService.openImageGallery(onImageSelected);
  }

  const handleImageSelected = useCallback(
    (image, shouldResizeImage = false) => {
      if (shouldResizeImage) {
        setResizingImage(true);

        return createResizedImage(image.uri)
          .then(resizedImage => {
            return onImageSelected({
              path: resizedImage.uri,
              size: resizedImage.size,
              filename: resizedImage.name,
            });
          })
          .catch(() => {
            // eslint-disable-next-line no-console
            return console.warn('Failed to resize image');
          })
          .finally(() => setResizingImage(false));
      }

      return onImageSelected({
        path: image.uri,
        size: image.fileSize,
        filename: image.filename,
      });
    },
    [onImageSelected],
  );

  const galleryPermissionsGranted = useMemo(
    () => attachmentService.hasGalleryPermissions(),
    [],
  );

  const showAttachmentSection = useMemo(
    () => enablePhotoAttachments && !isResizingImage,
    [enablePhotoAttachments, isResizingImage],
  );

  return (
    <LoadingContainer loading={isResizingImage}>
      <View style={style.container}>
        {showAttachmentSection && (
          <>
            <TouchableOpacity
              onPress={handleCameraSelectPress}
              style={[style.button, style.cameraButton]}
            >
              <Icon name="camera" style={style.attachmentIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGallerySelectPress}
              style={[style.button, style.galleryButton]}
            >
              <Icon name="gallery" style={style.attachmentIcon} />
            </TouchableOpacity>
            {galleryPermissionsGranted && (
              <RecentImages onImageSelected={handleImageSelected} />
            )}
          </>
        )}
      </View>
    </LoadingContainer>
  );
}

NewStatusFooter.propTypes = {
  enablePhotoAttachments: PropTypes.bool.isRequired,
  onImageSelected: PropTypes.func.isRequired,
  style: PropTypes.object,
};

NewStatusFooter.defaultProps = {
  style: {},
};

export default connectStyle(ext('NewStatusFooter'))(NewStatusFooter);

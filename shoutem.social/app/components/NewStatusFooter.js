import React, { useCallback, useMemo, useState } from 'react';
import { LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  Icon,
  LoadingContainer,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { ATTACHMENT_TYPE, ext } from '../const';
import { attachmentService, createResizedImage } from '../services';
import AddAttachmentButtons from './AddAttachmentButtons';
import RecentImages from './RecentImages';

const NewStatusFooter = ({
  onAttachmentSelected,
  enableGifAttachments,
  enablePhotoAttachments,
  giphyApiKey,
  style,
}) => {
  const [isResizingImage, setResizingImage] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const galleryPermissionsGranted = useMemo(
    async () => attachmentService.hasGalleryPermissions(),
    [],
  );

  const handleAttachmentSelected = useCallback(
    (attachment, shouldResizeImage = false) => {
      const { path, type, size } = attachment;

      if (type !== ATTACHMENT_TYPE.IMAGE || !shouldResizeImage) {
        return onAttachmentSelected({
          path,
          type,
          size,
        });
      }

      // Resize image before uploading it
      setResizingImage(true);

      return createResizedImage(path)
        .then(resizedImage => {
          return onAttachmentSelected({
            path: resizedImage.uri,
            type,
            size: resizedImage.size,
          });
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          return console.warn('Failed to resize image');
        })
        .finally(() => setResizingImage(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleExpandButtonPress = () => {
    LayoutAnimation.easeInEaseOut();
    setExpanded(!expanded);
  };

  if (
    !enableGifAttachments &&
    !enablePhotoAttachments &&
    !enableGifAttachments
  ) {
    return null;
  }

  return (
    <>
      <Divider styleName={expanded ? 'line' : 'line md-gutter-bottom'} />
      <LoadingContainer loading={isResizingImage}>
        {!isResizingImage && (
          <>
            {expanded && (
              <View styleName="md-gutter-left">
                <AddAttachmentButtons
                  onAttachmentSelected={handleAttachmentSelected}
                  enableGifAttachments={enableGifAttachments}
                  enablePhotoAttachments={enablePhotoAttachments}
                  giphyApiKey={giphyApiKey}
                />
                <Divider styleName="line md-gutter-bottom" />
              </View>
            )}
            <View style={style.container}>
              <TouchableOpacity
                onPress={handleExpandButtonPress}
                style={style.expandButton}
              >
                <Icon
                  name="plus-button"
                  style={expanded ? style.plusIconRotated : {}}
                />
              </TouchableOpacity>
              {galleryPermissionsGranted && (
                <RecentImages onImageSelected={handleAttachmentSelected} />
              )}
            </View>
          </>
        )}
      </LoadingContainer>
    </>
  );
};

NewStatusFooter.propTypes = {
  giphyApiKey: PropTypes.string.isRequired,
  onAttachmentSelected: PropTypes.func.isRequired,
  enableGifAttachments: PropTypes.bool,
  enablePhotoAttachments: PropTypes.bool,
  style: PropTypes.object,
};

NewStatusFooter.defaultProps = {
  enableGifAttachments: true,
  enablePhotoAttachments: true,
  style: {},
};

export default connectStyle(ext('NewStatusFooter'))(NewStatusFooter);

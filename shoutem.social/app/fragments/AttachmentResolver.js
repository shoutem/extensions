/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutAnimation, Linking } from 'react-native';
import { getLinkPreview } from 'link-preview-js';
import PropTypes from 'prop-types';
import Uri from 'urijs';
import { View } from '@shoutem/ui';
import {
  AudioAttachment,
  ImageAttachment,
  VideoAttachment,
  WebsiteAttachment,
} from '../components/attachments';
import { attachmentService } from '../services';

function AttachmentResolver({
  enableImagePreview,
  isComment,
  userAttachment,
  statusText,
}) {
  const [urlMetadata, setUrlMetadata] = useState(null);

  useEffect(() => {
    getLinkPreview(statusText)
      .then(metadata => {
        const {
          mediaType,
          description,
          favicons,
          images,
          title,
          url,
        } = metadata;

        if (!metadata) {
          return;
        }

        const host = new Uri(metadata.url).host().toString();

        LayoutAnimation.easeInEaseOut();

        // Youtube videos have web type. Make it a video type -> fetch YT custom metadata,s
        // resolve first frame and title

        if (attachmentService.YOUTUBE_URL_REGEX.test(url)) {
          attachmentService
            .resolveYoutubeUrlMetadata(metadata)
            .then(youtubeMetadata => {
              setUrlMetadata({ ...youtubeMetadata, host });
            });

          return;
        }

        setUrlMetadata({
          mediaType,
          description,
          favicon: favicons?.[0],
          host,
          image: images?.[0],
          title,
          url,
        });
      })
      .catch(error => {
        // link-preview-js returns warning if no URL was found inside status/comment text
        // Most of the posts won't have URL, so we'll hide these warnings
        if (
          error.message === attachmentService.INVALID_OR_NO_URL_ERROR ||
          error.message === attachmentService.INVALID_TEXT_ERROR
        ) {
          return;
        }

        // eslint-disable-next-line no-console
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenLink = useCallback(() => {
    Linking.openURL(urlMetadata?.url);
  }, [urlMetadata?.url]);

  const containerStyleName = useMemo(
    () =>
      statusText && (userAttachment.uri || !!urlMetadata)
        ? 'md-gutter-top'
        : '',
    [statusText, urlMetadata, userAttachment.uri],
  );

  const metadataAttachmentStyleName = useMemo(
    () => (userAttachment.uri ? 'md-gutter-top' : ''),
    [userAttachment.uri],
  );

  if (!urlMetadata && !userAttachment) {
    return null;
  }

  const mediaType = urlMetadata?.mediaType || null;

  return (
    <View styleName={containerStyleName}>
      {userAttachment && (
        <ImageAttachment
          enableImagePreview={enableImagePreview}
          isComment
          source={userAttachment}
        />
      )}
      <View styleName={metadataAttachmentStyleName}>
        {mediaType === attachmentService.MEDIA_TYPE.IMAGE && (
          <ImageAttachment
            enableImagePreview={enableImagePreview}
            isComment={isComment}
            source={{ uri: urlMetadata?.url }}
          />
        )}
        {(mediaType === attachmentService.MEDIA_TYPE.WEB ||
          mediaType === attachmentService.MEDIA_TYPE.OBJECT) && (
          <WebsiteAttachment metadata={urlMetadata} onPress={handleOpenLink} />
        )}
        {mediaType === attachmentService.MEDIA_TYPE.AUDIO && (
          <AudioAttachment
            audioUrl={urlMetadata?.url}
            onPress={handleOpenLink}
          />
        )}
        {(mediaType === attachmentService.MEDIA_TYPE.VIDEO ||
          mediaType === attachmentService.MEDIA_TYPE.VIDEO_OTHER ||
          mediaType === attachmentService.MEDIA_TYPE.MUSIC_SONG) && (
          // lint complains about wrong indentation, then after it's applied, it complains to delete indentation
          // eslint-disable-next-line react/jsx-indent
          <VideoAttachment metadata={urlMetadata} onPress={handleOpenLink} />
        )}
      </View>
    </View>
  );
}

AttachmentResolver.propTypes = {
  enableImagePreview: PropTypes.bool.isRequired,
  statusText: PropTypes.string.isRequired,
  isComment: PropTypes.bool,
  userAttachment: PropTypes.object,
};

AttachmentResolver.defaultProps = {
  isComment: false,
  userAttachment: null,
};

export default React.memo(AttachmentResolver);

/* eslint-disable camelcase */
import React, { useCallback, useMemo, useState } from 'react';
import { LayoutAnimation, Pressable } from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Image,
  Row,
  SimpleHtml,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { images } from '../assets';
import { ext } from '../const';
import { adaptSocialUserForProfileScreen, convertToHtml } from '../services';
import { comment as commentShape } from './shapes';

function CommentView({
  comment,
  openProfile,
  deleteComment,
  onImagePress,
  style,
}) {
  const dispatch = useDispatch();

  const [isDeleted, setDeleted] = useState(false);

  const handleClickOnUser = useCallback(() => {
    const { user } = comment;

    openProfile(dispatch)(adaptSocialUserForProfileScreen(user));
  }, [comment, dispatch, openProfile]);

  const showActionSheet = useCallback(() => {
    if (_.get(comment, 'deletable') !== 'yes') {
      return;
    }

    ActionSheet.showActionSheetWithOptions(
      {
        options: [
          I18n.t(ext('deleteCommentOption')),
          I18n.t(ext('cancelCommentSelectionOption')),
        ],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      index => {
        if (index === 0) {
          // TODO: fetch status or statues after delete, we need comment count in
          // Interactions component updated after deletion
          deleteComment(comment);

          LayoutAnimation.easeInEaseOut();
          setDeleted(true);
        }
      },
    );
  }, [comment, deleteComment]);

  const { user, created_at, text } = comment;
  const { shoutem_attachments } = comment;
  const { profile_image_url, name: userName } = user;

  const timeAgo = useMemo(() => moment(created_at).fromNow(), [created_at]);

  const resolvedProfileAvatar = useMemo(
    () =>
      profile_image_url
        ? { uri: profile_image_url }
        : images.defaultProfileAvatar,
    [profile_image_url],
  );

  const commentHtml = useMemo(() => convertToHtml(text), [text]);
  // Before, we used image (base64) attachments when creating post.
  // Now we'll use link as an attachment when creating post.
  // Keeping shoutem_attachments[0]?.url_large for backwards compatibility.
  const attachmentSource = useMemo(
    () => ({
      uri: shoutem_attachments?.[0]?.url || shoutem_attachments?.[0]?.url_large,
    }),
    [shoutem_attachments],
  );

  const resolvedAttachmentStyle = useMemo(
    () => [style.attachment, !!commentHtml && style.attachmentMargin],
    [commentHtml, style.attachment, style.attachmentMargin],
  );

  const handleImagePress = useCallback(() => {
    const imageGalleryData = [
      {
        source: attachmentSource,
      },
    ];

    onImagePress(imageGalleryData);
  }, [attachmentSource, onImagePress]);

  if (isDeleted) {
    return null;
  }

  return (
    <View style={style.container}>
      <TouchableOpacity onPress={handleClickOnUser} style={style.profileImage}>
        <Image
          styleName="small-avatar placeholder"
          source={resolvedProfileAvatar}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onLongPress={showActionSheet}
        style={style.contentContainer}
      >
        <Row style={style.row}>
          <View style={style.contentInnerContainer}>
            <View styleName="horizontal space-between">
              <Subtitle style={style.username}>{userName}</Subtitle>
              <Caption style={style.timeAgo}>{timeAgo}</Caption>
            </View>
            <SimpleHtml body={commentHtml} style={style.comment} />
            {!!attachmentSource.uri && (
              <Pressable onPress={handleImagePress}>
                <Image
                  style={resolvedAttachmentStyle}
                  source={attachmentSource}
                />
              </Pressable>
            )}
          </View>
        </Row>
      </TouchableOpacity>
    </View>
  );
}

CommentView.propTypes = {
  comment: commentShape.isRequired,
  deleteComment: PropTypes.func.isRequired,
  openProfile: PropTypes.func.isRequired,
  onImagePress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

CommentView.defaultProps = {
  style: {},
};

export default connectStyle(ext('CommentView'))(CommentView);

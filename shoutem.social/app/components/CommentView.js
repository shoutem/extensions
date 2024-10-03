/* eslint-disable camelcase */
import React, { useCallback, useMemo, useState } from 'react';
import { LayoutAnimation } from 'react-native';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  ActionSheet,
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
import { AttachmentResolver } from '../fragments';
import { loadStatus } from '../redux';
import { convertToHtml } from '../services';
import { comment as commentShape } from './shapes';

function CommentView({
  comment,
  deleteComment,
  onUserAvatarPress,
  statusId,
  style,
}) {
  const dispatch = useDispatch();
  const [actionSheetOpen, setActionSheetOpen] = useState(false);

  const handleUserAvatarPress = () => onUserAvatarPress(comment);

  const handleLongPress = useCallback(() => {
    if (_.get(comment, 'deletable') !== 'yes') {
      return;
    }

    setActionSheetOpen(true);
  }, [comment]);

  const handleDeleteCommentPress = useCallback(() => {
    // We have to load statuses to fetch updated state after deleting comment
    dispatch(deleteComment(comment)).then(() => {
      setActionSheetOpen(false);
      dispatch(loadStatus(statusId));
    });

    LayoutAnimation.easeInEaseOut();
  }, [comment, deleteComment, dispatch, statusId]);

  const actionSheetOptions = useMemo(() => {
    const cancelOptions = [
      {
        title: I18n.t(ext('cancelCommentSelectionOption')),
        onPress: () => setActionSheetOpen(false),
      },
    ];

    const confirmOptions = [
      {
        title: I18n.t(ext('deleteCommentOption')),
        onPress: handleDeleteCommentPress,
      },
    ];

    return {
      cancelOptions,
      confirmOptions,
    };
  }, [handleDeleteCommentPress]);

  const { user, created_at, shoutem_attachments, html_text: text } = comment;
  const { profile_image_url, name: userName } = user;

  const timeAgo = moment(created_at).fromNow();

  const resolvedProfileAvatar = profile_image_url
    ? { uri: profile_image_url }
    : images.defaultProfileAvatar;

  const commentHtml = useMemo(() => convertToHtml(text), [text]);

  const userAttachment = shoutem_attachments[0] || {};

  return (
    <View style={style.container}>
      <TouchableOpacity
        onPress={handleUserAvatarPress}
        style={style.profileImage}
      >
        <Image
          styleName="small-avatar placeholder"
          source={resolvedProfileAvatar}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onLongPress={handleLongPress}
        style={style.contentContainer}
      >
        <Row style={style.row}>
          <View style={style.contentInnerContainer}>
            <View styleName="horizontal space-between">
              <Subtitle style={style.username}>{userName}</Subtitle>
              <Caption style={style.timeAgo}>{timeAgo}</Caption>
            </View>
            <SimpleHtml body={commentHtml} style={style.comment} />
            <AttachmentResolver
              enableImagePreview
              statusText={text}
              userAttachment={{
                uri: userAttachment.url || userAttachment.url_large,
              }}
            />
          </View>
        </Row>
      </TouchableOpacity>
      <ActionSheet
        active={actionSheetOpen}
        cancelOptions={actionSheetOptions.cancelOptions}
        confirmOptions={actionSheetOptions.confirmOptions}
        onDismiss={() => setActionSheetOpen(false)}
        style={style.actionSheet}
      />
    </View>
  );
}

CommentView.propTypes = {
  comment: commentShape.isRequired,
  deleteComment: PropTypes.func.isRequired,
  statusId: PropTypes.number.isRequired,
  onUserAvatarPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

CommentView.defaultProps = {
  style: {},
};

export default connectStyle(ext('CommentView'))(CommentView);

/* eslint-disable camelcase */
import React, { useMemo } from 'react';
import { LayoutAnimation } from 'react-native';
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

  const handleUserAvatarPress = () => onUserAvatarPress(comment);

  const showActionSheet = () => {
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
          // We have to load statuses to fetch updated state after deleting comment
          dispatch(deleteComment(comment)).then(() =>
            dispatch(loadStatus(statusId)),
          );

          LayoutAnimation.easeInEaseOut();
        }
      },
    );
  };

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

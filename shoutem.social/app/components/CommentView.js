/* eslint-disable camelcase */
import React, { useCallback, useMemo } from 'react';
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
import { adaptSocialUserForProfileScreen, convertToHtml } from '../services';
import { comment as commentShape } from './shapes';

function CommentView({ comment, deleteComment, openProfile, statusId, style }) {
  const dispatch = useDispatch();

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
          // We have to load statuses to fetch updated state after deleting comment
          dispatch(deleteComment(comment)).then(() =>
            dispatch(loadStatus(statusId)),
          );

          LayoutAnimation.easeInEaseOut();
        }
      },
    );
  }, [comment, deleteComment, dispatch]);

  const { user, created_at, shoutem_attachments, text } = comment;
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

  const userAttachment = useMemo(() => shoutem_attachments[0] || {}, [
    shoutem_attachments,
  ]);

  const resolvedUserAttachment = useMemo(
    () => ({ uri: userAttachment.url || userAttachment.url_large }),
    [userAttachment],
  );

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
            <AttachmentResolver
              enableImagePreview
              isComment
              statusText={text}
              userAttachment={resolvedUserAttachment}
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
  openProfile: PropTypes.func.isRequired,
  statusId: PropTypes.number.isRequired,
  style: PropTypes.object,
};

CommentView.defaultProps = {
  style: {},
};

export default connectStyle(ext('CommentView'))(CommentView);

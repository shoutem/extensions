/* eslint-disable camelcase */
import React, { useMemo, useState } from 'react';
import { LayoutAnimation } from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Image,
  Lightbox,
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

function CommentView({ comment, openProfile, deleteComment, style }) {
  const [isDeleted, setDeleted] = useState(false);

  function handleClickOnUser() {
    const { user } = comment;

    openProfile(adaptSocialUserForProfileScreen(user));
  }

  function showActionSheet() {
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
  }

  const { user, created_at, text } = comment;
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

  const { shoutem_attachments: attachments } = comment;
  const hasPicture = _.get(attachments, [0, 'type']) === 'picture';

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
          <View styleName="vertical" style={style.contentInnerContainer}>
            <View styleName="horizontal space-between">
              <Subtitle style={style.username}>{userName}</Subtitle>
              <Caption style={style.timeAgo}>{timeAgo}</Caption>
            </View>
            <SimpleHtml body={commentHtml} style={style.comment} />
            {hasPicture && (
              <Lightbox activeProps={{ styleName: 'preview' }}>
                <Image
                  style={style.attachment}
                  source={{ uri: attachments[0].url_large }}
                />
              </Lightbox>
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
  style: PropTypes.object,
};

CommentView.defaultProps = {
  style: {},
};

export default connectStyle(ext('CommentView'))(CommentView);

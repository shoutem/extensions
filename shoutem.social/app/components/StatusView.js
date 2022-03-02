/* eslint-disable camelcase */
import React from 'react';
import { Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';
import Interactions from './Interactions';
import StatusContent from './StatusContent';
import StatusHeader from './StatusHeader';

function StatusView({
  status,
  enableComments,
  enableImageFullScreen,
  enableInteractions,
  enablePhotoAttachments,
  goBackAfterBlock,
  showNewCommentInput,
  style,
}) {
  if (!status) {
    return null;
  }

  const {
    id,
    created_at,
    liked,
    shoutem_attachments,
    shoutem_favorited_by,
    shoutem_reply_count,
    text,
    user,
  } = status;
  const {
    id: userId,
    first_name,
    last_name,
    profile_image_url,
    screen_name,
  } = user;

  function handleOpenDetails() {
    navigateTo(ext('StatusDetailsScreen'), {
      statusId: id,
      enableComments,
      enableInteractions,
      enablePhotoAttachments,
      focusAddCommentInput: true,
    });
  }

  const resolvedShowNewCommentInput = enableComments && showNewCommentInput;

  return (
    <View style={style.container}>
      <StatusHeader
        createdAt={created_at}
        firstName={first_name}
        goBackAfterBlock={goBackAfterBlock}
        lastName={last_name}
        profileImageUrl={profile_image_url}
        screenName={screen_name}
        userId={userId}
      />
      <StatusContent
        enableComments={enableComments}
        enableImageFullScreen={enableImageFullScreen}
        enableInteractions={enableInteractions}
        enablePhotoAttachments={enablePhotoAttachments}
        text={text}
        leadAttachmentUrl={shoutem_attachments[0]?.url_large}
        statusId={id}
      />
      <Interactions
        commentCount={shoutem_reply_count}
        enableComments={enableComments}
        enableInteractions={enableInteractions}
        enablePhotoAttachments={enablePhotoAttachments}
        statusId={id}
        statusLiked={liked}
        usersWhoLiked={shoutem_favorited_by.users}
        likedCount={shoutem_favorited_by.count}
      />
      {resolvedShowNewCommentInput && (
        <Pressable style={style.newComment} onPress={handleOpenDetails}>
          <Text style={style.placeholderText}>
            {I18n.t(ext('newCommentPlaceholder'))}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

StatusView.propTypes = {
  enableComments: PropTypes.bool.isRequired,
  enableInteractions: PropTypes.bool.isRequired,
  enablePhotoAttachments: PropTypes.bool.isRequired,
  enableImageFullScreen: PropTypes.bool,
  goBackAfterBlock: PropTypes.bool,
  showNewCommentInput: PropTypes.bool,
  status: PropTypes.shape({
    created_at: PropTypes.string,
    id: PropTypes.number,
    liked: PropTypes.bool,
    shoutem_attachments: PropTypes.array,
    shoutem_favorited_by: PropTypes.object,
    shoutem_reply_count: PropTypes.number,
    text: PropTypes.string,
    user: PropTypes.object,
  }),
  style: PropTypes.object,
};

StatusView.defaultProps = {
  enableImageFullScreen: false,
  goBackAfterBlock: false,
  showNewCommentInput: true,
  status: undefined,
  style: {},
};

export default connectStyle(ext('StatusView'))(StatusView);

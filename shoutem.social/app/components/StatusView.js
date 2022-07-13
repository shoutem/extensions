/* eslint-disable camelcase */
import React, { useMemo } from 'react';
import { Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '@shoutem/ui';
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
  maxStatusLength,
  style,
}) {
  // status can be undefined if we're deleting it
  const shoutem_attachments = useMemo(() => status?.shoutem_attachments, [
    status,
  ]);

  const resolvedShowNewCommentInput = useMemo(
    () => enableComments && showNewCommentInput,
    [enableComments, showNewCommentInput],
  );

  if (!status) {
    return null;
  }

  const {
    id,
    created_at,
    liked,
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
      maxStatusLength,
    });
  }

  function handleOpenDetailsAndFocusInput() {
    navigateTo(ext('StatusDetailsScreen'), {
      statusId: id,
      enableComments,
      enableInteractions,
      enablePhotoAttachments,
      focusAddCommentInput: true,
      maxStatusLength,
    });
  }

  return (
    <Pressable style={style.container} onPress={handleOpenDetails}>
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
        enableImageFullScreen={enableImageFullScreen}
        text={text}
        attachments={shoutem_attachments}
      />
      <Interactions
        commentCount={shoutem_reply_count}
        enableComments={enableComments}
        enableInteractions={enableInteractions}
        statusId={id}
        statusLiked={liked}
        usersWhoLiked={shoutem_favorited_by.users}
        likedCount={shoutem_favorited_by.count}
      />
      {resolvedShowNewCommentInput && (
        <Pressable
          style={style.newComment}
          onPress={handleOpenDetailsAndFocusInput}
        >
          <Text style={style.placeholderText}>
            {I18n.t(ext('newCommentPlaceholder'))}
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
}

StatusView.propTypes = {
  enableComments: PropTypes.bool.isRequired,
  enableInteractions: PropTypes.bool.isRequired,
  enablePhotoAttachments: PropTypes.bool.isRequired,
  maxStatusLength: PropTypes.number.isRequired,
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

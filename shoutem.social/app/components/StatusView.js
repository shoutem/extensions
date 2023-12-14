/* eslint-disable camelcase */
import React from 'react';
import { Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';
import InteractionActions from './InteractionActions';
import Interactions from './Interactions';
import StatusContent from './StatusContent';
import StatusHeader from './StatusHeader';

function StatusView({
  status,
  enableComments,
  enableInteractions,
  enableImageFullScreen,
  goBackAfterBlock,
  maxStatusLength,
  addCommentInputRef,
  style,
}) {
  // status can be undefined if we're deleting it
  if (!status) {
    return null;
  }

  const { shoutem_attachments } = status;

  const {
    id,
    created_at,
    liked,
    shoutem_favorited_by,
    shoutem_reply_count,
    html_text,
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
        text={html_text}
        attachments={shoutem_attachments}
      />
      <Interactions
        enableComments={enableComments}
        enableInteractions={enableInteractions}
        commentCount={shoutem_reply_count}
        statusLiked={liked}
        usersWhoLiked={shoutem_favorited_by.users}
        likedCount={shoutem_favorited_by.count}
      />
      <InteractionActions
        statusId={id}
        statusLiked={liked}
        maxStatusLength={maxStatusLength}
        addCommentInputRef={addCommentInputRef}
      />
    </Pressable>
  );
}

StatusView.propTypes = {
  maxStatusLength: PropTypes.number.isRequired,
  addCommentInputRef: PropTypes.object,
  enableComments: PropTypes.bool,
  enableImageFullScreen: PropTypes.bool,
  enableInteractions: PropTypes.bool,
  goBackAfterBlock: PropTypes.bool,
  status: PropTypes.shape({
    created_at: PropTypes.string,
    html_text: PropTypes.string,
    id: PropTypes.number,
    liked: PropTypes.bool,
    shoutem_attachments: PropTypes.array,
    shoutem_favorited_by: PropTypes.object,
    shoutem_reply_count: PropTypes.number,
    user: PropTypes.object,
  }),
  style: PropTypes.object,
};

StatusView.defaultProps = {
  addCommentInputRef: { current: {} },
  enableComments: true,
  enableInteractions: true,
  enableImageFullScreen: false,
  goBackAfterBlock: false,
  status: undefined,
  style: {},
};

export default connectStyle(ext('StatusView'))(StatusView);

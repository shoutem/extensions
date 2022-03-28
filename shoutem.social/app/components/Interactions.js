import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Icon, TouchableOpacity, View } from '@shoutem/ui';
import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';
import { likeStatus, unlikeStatus } from '../redux';
import Like from './Like';

function Interactions({
  commentCount,
  enableComments,
  enableInteractions,
  statusId,
  statusLiked,
  usersWhoLiked,
  likedCount,
  style,
}) {
  const dispatch = useDispatch();

  const likeCountText =
    likedCount === 0
      ? I18n.t(ext('noLikes'))
      : I18n.t(ext('numberOfLikes'), { count: likedCount });

  function handleOpenUserLikes() {
    if (likedCount === 0) {
      return;
    }

    const routeParams = {
      title: I18n.t(ext('viewStatusLikes')),
      users: usersWhoLiked,
    };

    navigateTo(ext('MembersScreen'), routeParams);
  }

  const toggleLikeStatus = useCallback(() => {
    if (!statusLiked) {
      dispatch(authenticate(() => dispatch(likeStatus(statusId))));
    } else {
      dispatch(unlikeStatus(statusId));
    }
  }, [dispatch, statusId, statusLiked]);

  const commentsCountText = I18n.t(ext('numberOfComments'), {
    count: commentCount,
  });

  if (!enableInteractions && !enableComments) {
    return null;
  }

  return (
    <View styleName="horizontal v-center md-gutter">
      {enableInteractions && (
        <TouchableOpacity
          onPress={handleOpenUserLikes}
          style={[style.button, style.likeButtonWidth]}
        >
          <Like onPress={toggleLikeStatus} statusLiked={statusLiked} />
          <Caption numberOfLines={1} style={style.iconText}>
            {likeCountText}
          </Caption>
        </TouchableOpacity>
      )}
      {enableComments && (
        <View style={[style.button, style.commentsButtonWidth]}>
          <Icon name="comments" style={style.icon} />
          <Caption numberOfLines={1} style={style.iconText}>
            {commentsCountText}
          </Caption>
        </View>
      )}
    </View>
  );
}

Interactions.propTypes = {
  commentCount: PropTypes.number.isRequired,
  enableComments: PropTypes.bool.isRequired,
  enableInteractions: PropTypes.bool.isRequired,
  likedCount: PropTypes.number.isRequired,
  statusId: PropTypes.number.isRequired,
  statusLiked: PropTypes.bool.isRequired,
  style: PropTypes.object,
  usersWhoLiked: PropTypes.array,
};

Interactions.defaultProps = {
  style: {},
  usersWhoLiked: [],
};

export default connectStyle(ext('Interactions'))(Interactions);

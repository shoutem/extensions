import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Icon, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';
import { adaptSocialUserForProfileScreen } from '../services/user';

const Interactions = ({
  enableInteractions,
  enableComments,
  commentCount,
  usersWhoLiked,
  likedCount,
  style,
}) => {
  const likeCountText =
    likedCount === 0
      ? I18n.t(ext('noLikes'))
      : I18n.t(ext('numberOfLikes'), { count: likedCount });

  const handleOpenUserLikes = () => {
    const routeParams = {
      title: I18n.t(ext('viewStatusLikes')),
      users: _.map(usersWhoLiked, adaptSocialUserForProfileScreen),
    };

    navigateTo(ext('MembersScreen'), routeParams);
  };

  const commentsCountText = I18n.t(ext('numberOfComments'), {
    count: commentCount,
  });

  if (!enableInteractions && !enableComments) {
    return null;
  }

  return (
    <View styleName="horizontal v-center md-gutter">
      {enableInteractions && (
        <TouchableOpacity onPress={handleOpenUserLikes} style={style.button}>
          <Icon name="like-heart" style={style.heartIcon} />
          <Caption numberOfLines={1} style={style.iconText}>
            {likeCountText}
          </Caption>
        </TouchableOpacity>
      )}
      {enableComments && (
        <View style={style.button}>
          <Icon name="comments" style={style.icon} />
          <Caption numberOfLines={1} style={style.iconText}>
            {commentsCountText}
          </Caption>
        </View>
      )}
    </View>
  );
};

Interactions.propTypes = {
  commentCount: PropTypes.number.isRequired,
  likedCount: PropTypes.number.isRequired,
  enableComments: PropTypes.bool,
  enableInteractions: PropTypes.bool,
  style: PropTypes.object,
  usersWhoLiked: PropTypes.array,
};

Interactions.defaultProps = {
  style: {},
  usersWhoLiked: [],
  enableInteractions: true,
  enableComments: true,
};

export default connectStyle(ext('Interactions'))(Interactions);

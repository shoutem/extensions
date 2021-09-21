import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import { Button, Icon, Text } from '@shoutem/ui';
import { ext } from '../const';
import { post as postShape } from './shapes';

export default function LikeButton({ status, onLikeAction }) {
  const handleLikeStatus = () => {
    onLikeAction(status);
  };

  // If user has not liked a post, text color inside like button
  // is inherited from "secondary" button style, otherwise is set to black
  const likeButtonStyle = !status?.liked ? undefined : { color: 'black' };

  return (
    <Button
      styleName="full-width medium-height secondary"
      onPress={handleLikeStatus}
    >
      <Icon name="like" style={likeButtonStyle} />
      <Text style={likeButtonStyle}>
        {!status?.liked
          ? I18n.t(ext('likeButton'))
          : I18n.t(ext('unlikeButton'))}
      </Text>
    </Button>
  );
}

LikeButton.propTypes = {
  status: postShape.isRequired,
  onLikeAction: PropTypes.func.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import { Button, Icon, Text } from '@shoutem/ui';
import { ext } from '../const';
import { post as postShape } from './shapes';

export default function CommentButton({ status, addComment }) {
  const handleAddCommentPress = () => {
    addComment(status.id);
  };

  return (
    <Button
      styleName="full-width medium-height secondary"
      onPress={handleAddCommentPress}
    >
      <Icon name="comment" />
      <Text>{I18n.t(ext('commentButton'))}</Text>
    </Button>
  );
}

CommentButton.propTypes = {
  status: postShape.isRequired,
  addComment: PropTypes.func.isRequired,
};

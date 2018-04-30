import PropTypes from 'prop-types';
import React from 'react';

import {
  Button,
  Icon,
  Text,
} from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';

import { post as postShape } from './shapes';
import { ext } from '../const';

const { func } = PropTypes;

export default class CommentButton extends React.Component {
  static propTypes = {
    status: postShape.isRequired,
    addComment: func.isRequired,
  };

  constructor(props) {
    super(props);
    this.commentStatus = this.commentStatus.bind(this);
  }

  commentStatus() {
    const { status, addComment } = this.props;
    addComment(status.id);
  }

  render() {
    return (
      <Button
        styleName="full-width medium-height secondary"
        onPress={this.commentStatus}
      >
        <Icon name="comment" />
        <Text>{I18n.t(ext('commentButton'))}</Text>
      </Button>
    );
  }
}

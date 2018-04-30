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

export default class LikeButton extends React.Component {
  static propTypes = {
    status: postShape.isRequired,
    onLikeAction: func.isRequired,
  };

  constructor(props) {
    super(props);
    this.likeStatus = this.likeStatus.bind(this);
  }

  likeStatus() {
    const { status, onLikeAction } = this.props;
    onLikeAction(status);
  }

  render() {
    const { status } = this.props;
    // If user has not liked a post, text color inside like button
    // is inherited from "secondary" button style, otherwise is set to black
    const likeButtonStyle = !status.liked ? undefined : { color: 'black' };

    return (
      <Button
        styleName="full-width medium-height secondary"
        onPress={this.likeStatus}
      >
        <Icon name="like" style={likeButtonStyle} />
        <Text style={likeButtonStyle}>
          {!status.liked ? I18n.t(ext('likeButton')) : I18n.t(ext('unlikeButton'))}
        </Text>
      </Button>
    );
  }
}

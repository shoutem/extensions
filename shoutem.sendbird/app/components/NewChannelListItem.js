import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Image, Row, Text, TouchableOpacity } from '@shoutem/ui';
import { images } from '../assets';

export default class NewChannelListItem extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleUserPress() {
    const { onPress, user } = this.props;

    if (onPress) {
      onPress(user);
    }
  }

  render() {
    const { user } = this.props;

    const profileImage = _.get(user, 'profile.image');
    const name = _.get(user, 'profile.name') || _.get(user, 'profile.nick');
    const source = profileImage ? { uri: profileImage } : images.avatar;

    return (
      <TouchableOpacity onPress={this.handleUserPress}>
        <Row styleName="small">
          <Image source={source} styleName="small-avatar" />
          <Text>{name}</Text>
        </Row>
      </TouchableOpacity>
    );
  }
}

NewChannelListItem.propTypes = {
  user: PropTypes.object.isRequired,
  onPress: PropTypes.func,
};

NewChannelListItem.defaultProps = {
  onPress: null,
};

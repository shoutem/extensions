import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import {
  Row,
  Image,
  Text,
  TouchableOpacity,
} from '@shoutem/ui';
import { images } from '../assets';

export default class NewChannelListItem extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    onPress: PropTypes.func,
  };

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
          <Image
            source={source}
            styleName="small-avatar"
          />
          <Text>{name}</Text>
        </Row>
      </TouchableOpacity>
    );
  }
}

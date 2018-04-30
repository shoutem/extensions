import PropTypes from 'prop-types';
import React, { Component } from 'react';

import moment from 'moment';

import {
  TouchableOpacity,
  Row,
  Image,
  Subtitle,
  Caption,
  Divider,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

import { notificationShape } from './shapes';

const { func } = PropTypes;

export class NotificationView extends Component {
  static propTypes = {
    // Called when notification is pressed
    onPress: func,
    // The notification
    notification: notificationShape,
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const { notification, onPress } = this.props;

    onPress(notification);
  }

  render() {
    const { notification } = this.props;
    const { id, imageUrl, read, summary, timestamp } = notification;

    return (
      <TouchableOpacity key={id} onPress={this.onPress}>
        <Row>
          <Image
            styleName="small rounded-corners"
            source={{ uri: imageUrl }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{summary}</Subtitle>
            <Caption>{moment(timestamp).fromNow()}</Caption>
          </View>
          {!read && <View styleName="notification-dot" />}
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('NotificationRow'))(NotificationView);

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import autoBind from 'auto-bind';
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

export class NotificationView extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    notification: notificationShape,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBind(this);
  }

  handlePress() {
    const { notification, onPress } = this.props;

    onPress(notification);
  }

  render() {
    const {
      notification: {
        id, imageUrl, read, summary, timestamp,
      },
      style,
    } = this.props;

    return (
      <TouchableOpacity key={id} onPress={this.handlePress}>
        <Row>
          <Image
            source={{ uri: imageUrl }}
            styleName="small rounded-corners"
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2} style={style.message}>{summary}</Subtitle>
            <Caption style={style.timestamp}>{moment(timestamp).fromNow()}</Caption>
          </View>
          {!read && <View styleName="notification-dot" />}
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('NotificationRow'))(NotificationView);

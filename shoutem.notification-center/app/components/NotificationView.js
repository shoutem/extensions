import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { ext, notificationShape } from '../const';

class NotificationView extends PureComponent {
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
      notification: { id, imageUrl, read, timestamp, title },
      style,
    } = this.props;

    return (
      <TouchableOpacity key={id} onPress={this.handlePress}>
        <Row>
          <Image source={{ uri: imageUrl }} styleName="small rounded-corners" />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2} style={style.title}>
              {title}
            </Subtitle>
            <Caption style={style.timestamp}>
              {moment(timestamp).fromNow()}
            </Caption>
          </View>
          {!read && <View styleName="notification-dot" />}
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('NotificationRow'))(NotificationView);

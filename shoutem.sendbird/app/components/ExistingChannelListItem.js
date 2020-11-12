import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import {
  Row,
  Image,
  ImageBackground,
  Text,
  View,
  Subtitle,
  TouchableOpacity,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ext, CONNECTION_STATUSES } from '../const';
import { images } from '../assets';
import { formatMessageDate, SendBird } from '../services';

class ExistingChannelListItem extends PureComponent {
  static propTypes = {
    channel: PropTypes.object,
    onPress: PropTypes.func,
    currentUser: PropTypes.object,
    style: PropTypes.shape({
      row: Row.propTypes.style,
      image: Image.propTypes.style,
      indicator: Image.propTypes.style,
    }),
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleUserPress() {
    const { onPress, channel } = this.props;

    if (onPress) {
      onPress(channel.channel.url);
    }
  }

  render() {
    const { channel, currentUser, style } = this.props;
    const { lastMessage, unreadMessageCount } = channel.channel;

    const message = _.get(lastMessage, 'message', '');
    const createdAt = _.get(lastMessage, 'createdAt');
    const name = _.get(lastMessage, 'name');

    const member = SendBird.getChannelPartner(channel.channel, currentUser);
    const onlineStatus = _.get(member, 'connectionStatus', CONNECTION_STATUSES.OFFLINE);
    const isOnline = onlineStatus === CONNECTION_STATUSES.ONLINE;

    const profileImage = _.get(member, 'profileUrl') || _.get(channel, 'channel.coverUrl');
    const memberName = _.get(member, 'nickname');
    const timeStamp = formatMessageDate(createdAt);
    const hasUnreadMessages = unreadMessageCount > 0;

    return (
      <TouchableOpacity onPress={this.handleUserPress}>
        <Row style={style.row}>
          <ImageBackground
            imageStyle={style.image}
            source={{ uri: profileImage }}
            style={style.image}
            styleName="small"
          >
            {isOnline && (
              <Image
                source={images.indicator}
                style={style.indicator}
              />
            )}
          </ImageBackground>
          <View styleName="vertical v-start">
            <View styleName="horizontal space-between v-center">
              <Subtitle
                style={[style.text, style.nickname, hasUnreadMessages && style.unreadText]}
              >
                {memberName}
              </Subtitle>
              <Text style={[style.text, style.date]}>{timeStamp}</Text>
            </View>
            <View styleName="horizontal space-between v-center">
              <Text
                numberOfLines={1}
                style={[style.text, hasUnreadMessages && style.unreadText]}
              >
                {message || name}
              </Text>
              {hasUnreadMessages && (
                <View style={style.unreadCountContainer}>
                  <Text style={[style.text, style.unreadCountText]}>{unreadMessageCount}</Text>
                </View>
              )}
            </View>
          </View>
        </Row>
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('ExistingChannelListItem'))(ExistingChannelListItem);

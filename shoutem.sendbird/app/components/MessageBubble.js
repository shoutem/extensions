import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import Autolink from 'react-native-autolink';
import { connectStyle } from '@shoutem/theme';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
} from '@shoutem/ui';
import { ext } from '../const';
import { formatMessageDate } from '../services';
import NewMessagesLabel from './NewMessagesLabel';

const AnimatedView = Animated.createAnimatedComponent(View);

function resolveProfileImage(senderImage, defaultImage) {
  if (!senderImage || _.isEmpty(senderImage)) {
    return defaultImage;
  }

  return senderImage;
}

class MessageBubble extends PureComponent {
  static propTypes = {
    message: PropTypes.object,
    currentUserId: PropTypes.string,
    style: PropTypes.object,
    showTimeStamp: PropTypes.bool,
    showNewLabel: PropTypes.bool,
    firstMessage: PropTypes.bool,
    defaultProfileImage: PropTypes.string,
    onFileMessagePress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.appearValue = new Animated.Value(0);

    autoBindReact(this);
  }

  componentDidMount() {
    this.animateOpacity();
  }

  handlePhotoPress() {
    const { message, onFileMessagePress } = this.props;

    const photo = {
      source: { uri: _.get(message, 'url') },
      name: _.get(message, 'name'),
    };

    onFileMessagePress(photo);
  }

  animateOpacity() {
    Animated.timing(this.appearValue, {
      duration: 500,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }

  renderText(text) {
    const {
      message,
      currentUserId,
      style,
    } = this.props;

    const { _sender } = message;
    const isOwnMessage = currentUserId === _sender.userId;

    return (
      <Text style={[style.text, !isOwnMessage && style.secondaryText]}>
        {text}
      </Text>
    );
  }

  render() {
    const {
      message,
      currentUserId,
      style,
      showNewLabel,
      showTimeStamp,
      firstMessage,
      defaultProfileImage,
    } = this.props;

    const { message: messageText, createdAt, _sender } = message;
    const profileImage = resolveProfileImage(_.get(_sender, 'profileUrl'), defaultProfileImage);
    const isOwnMessage = currentUserId === _sender.userId;
    const isFileMessage = _.get(message, 'messageType') === 'file';
    const containerStyleName = isOwnMessage ? 'vertical h-end sm-gutter-bottom' : 'vertical h-start sm-gutter-bottom';
    const translateYtransform = this.appearValue.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });
    const showProfileImage = !isOwnMessage && firstMessage;

    return (
      <TouchableOpacity
        disabled={!isFileMessage}
        onPress={this.handlePhotoPress}
      >
        <AnimatedView
          style={{
            opacity: this.appearValue,
            transform: [{ translateY: translateYtransform }],
          }}
          styleName={containerStyleName}
        >
          {showNewLabel && <NewMessagesLabel />}
          <View styleName="horizontal v-start">
            {showProfileImage && <Image source={{ uri: profileImage }} style={style.profileImage} />}
            <View style={[
              style.container,
              !isOwnMessage && style.secondaryContainer,
              firstMessage && isOwnMessage && style.firstMessage,
              firstMessage && !isOwnMessage && style.firstMessageSecondary,
              isFileMessage && style.fileMessage,
              showProfileImage && style.withProfileImage,
            ]}
            >
              {!isFileMessage && (
                <Autolink
                  text={messageText}
                  component={View}
                  renderText={this.renderText}
                  linkProps={{ style: [style.text, style.linkText] }}
                />
              )}
              {isFileMessage && (
                <Image resizeMode="cover" source={{ uri: message.url }} style={style.docImage} />
              )}
            </View>
          </View>
          {showTimeStamp && <Text style={[style.date, !isOwnMessage && style.dateSecondary]}>{formatMessageDate(createdAt)}</Text>}
        </AnimatedView>
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('MessageBubble'))(MessageBubble);

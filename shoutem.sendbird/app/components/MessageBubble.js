import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import Autolink from 'react-native-autolink';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Text, TouchableOpacity, View } from '@shoutem/ui';
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
    const { message, currentUserId, style } = this.props;
    const sender = _.get(message, '_sender', 'admin');
    const isOwnMessage = currentUserId === sender.userId;

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

    const { message: messageText, createdAt } = message;
    const sender = _.get(message, '_sender', 'admin');

    const profileImage = resolveProfileImage(
      _.get(sender, 'profileUrl'),
      defaultProfileImage,
    );
    const isOwnMessage = currentUserId === sender.userId;
    const isFileMessage = _.get(message, 'messageType') === 'file';
    const containerStyleName = isOwnMessage
      ? 'vertical h-end sm-gutter-bottom'
      : 'vertical h-start sm-gutter-bottom';
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
            {showProfileImage && (
              <Image
                source={{ uri: profileImage }}
                style={style.profileImage}
              />
            )}
            <View
              style={[
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
                <Image
                  resizeMode="cover"
                  source={{ uri: message.url }}
                  style={style.docImage}
                />
              )}
            </View>
          </View>
          {showTimeStamp && (
            <Text style={[style.date, !isOwnMessage && style.dateSecondary]}>
              {formatMessageDate(createdAt)}
            </Text>
          )}
        </AnimatedView>
      </TouchableOpacity>
    );
  }
}

MessageBubble.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  defaultProfileImage: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
  showNewLabel: PropTypes.bool.isRequired,
  showTimeStamp: PropTypes.bool.isRequired,
  onFileMessagePress: PropTypes.func.isRequired,
  firstMessage: PropTypes.bool,
  style: PropTypes.object,
};

MessageBubble.defaultProps = {
  firstMessage: false,
  style: {},
};

export default connectStyle(ext('MessageBubble'))(MessageBubble);

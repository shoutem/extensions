import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LayoutAnimation, TextInput, Platform, Keyboard } from 'react-native';
import { connectStyle } from '@shoutem/theme';
import { View, TouchableOpacity, Image, Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { images } from '../assets';
import { ext } from '../const';
import ProgressBar from './ProgressBar';

class ChatInputBox extends PureComponent {
  static propTypes = {
    style: View.propTypes.style,
    onAttachmentPress: PropTypes.func,
    onSendPress: PropTypes.func,
    onTypingStatusChange: PropTypes.func,
    uploadProgress: PropTypes.number,
    typing: PropTypes.any,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      message: '',
      showUploadProgress: false,
    };

    Keyboard.addListener('keyboardDidShow', this.handleFocus);
  }

  componentDidUpdate(prevProps) {
    const { uploadProgress: prevUploadProgress } = prevProps;
    const { uploadProgress } = this.props;

    if (prevUploadProgress !== 100 && uploadProgress === 100) {
      LayoutAnimation.easeInEaseOut();
      _.delay(() => this.setState({ showUploadProgress: false }), 1000);
    }

    if (prevUploadProgress === 100 && uploadProgress !== 100) {
      LayoutAnimation.easeInEaseOut();
      this.setState({ showUploadProgress: true });
    }
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this.handleFocus);
  }

  handleTextChange(message) {
    const { message: oldMessage } = this.state;

    if (_.isEmpty(message) && !_.isEmpty(oldMessage)) {
      this.handleTypingStatusChanged(false);
    }

    if (!_.isEmpty(message) && _.isEmpty(oldMessage)) {
      this.handleTypingStatusChanged(true);
    }

    this.setState({ message });
  }

  handleSendPress() {
    const { message } = this.state;
    const { onSendPress } = this.props;

    if (onSendPress) {
      onSendPress(message);
      this.handleTextChange('');
    }
  }

  // KeyboardAvoidingView behaves incorrectly for the combination of TextInput and
  // ScrollView / FlatList. After the textinput value changes, next rerender handles
  // this properly, so we force this by manually resetting the vlue on textInput.
  // This should be fixed with the new RN versions at which point we can remove this hack.
  // This functions properly for iOS
  handleFocus() {
    const { message } = this.state;

    if (Platform.OS === 'ios') {
      return;
    }

    this.setState({ message: `${message} ` }, () => this.setState({ message }));
  }

  handleTypingStatusChanged(typing) {
    const { onTypingStatusChange } = this.props;

    if (onTypingStatusChange) {
      onTypingStatusChange(typing);
    }
  }

  handleAttachPress() {
    const { onAttachmentPress } = this.props;

    if (onAttachmentPress) {
      onAttachmentPress();
    }
  }

  render() {
    const { style, typing, uploadProgress, ...props } = this.props;
    const { message, showUploadProgress } = this.state;

    return (
      <>
        {typing && (
          <Text styleName="sm-gutter-bottom sm-gutter-left">
            {typing}
            {I18n.t(ext('isTypingSuffix'))}
          </Text>
        )}
        <ProgressBar progress={uploadProgress} visible={showUploadProgress} />
        <View style={style.container} styleName="horizontal v-center">
          <TouchableOpacity
            onPress={this.handleAttachPress}
            style={style.attachIcon.wrapper}
          >
            <Image source={images.add} style={style.attachIcon.icon} />
          </TouchableOpacity>
          <TextInput
            blurOnSubmit
            multiline
            placeholder={I18n.t(ext('textInputPlaceholder'))}
            returnKeyType="send"
            style={style.input}
            {...props}
            onChangeText={this.handleTextChange}
            onSubmitEditing={this.handleSendPress}
            value={message}
          />
          <TouchableOpacity
            onPress={this.handleSendPress}
            style={style.sendIcon.wrapper}
          >
            <Image source={images.send} style={style.sendIcon.icon} />
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

export default connectStyle(ext('ChatInputBox'))(ChatInputBox);

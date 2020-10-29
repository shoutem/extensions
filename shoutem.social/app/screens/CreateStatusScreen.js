import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert, KeyboardAvoidingView, TextInput } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import {
  Screen,
  Row,
  Text,
  Image,
  ImageBackground,
  Button,
  View,
  Divider,
  Caption,
  Icon,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from '@shoutem/ui';

import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { NavigationBar } from 'shoutem.navigation';

import { user as userShape } from '../components/shapes';
import { ext } from '../const';

const { string, func, number, bool } = PropTypes;

export class CreateStatusScreen extends PureComponent {
  static propTypes = {
    user: userShape.isRequired,
    onStatusCreated: func.isRequired,
    enablePhotoAttachments: bool,
    placeholder: string,
    statusMaxLength: number,
    title: string,
  };

  static defaultProps = {
    enablePhotoAttachments: true,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      text: '',
      numOfCharacters: props.statusMaxLength,
      postingDisabled: true,
      imageData: undefined,
    };
  }

  handleTextChange(text) {
    const { statusMaxLength } = this.props;

    this.setState({
      text,
      numOfCharacters: statusMaxLength - text.length,
      postingDisabled: text.length === 0,
    });
  }

  addNewStatus() {
    const { authenticate, onStatusCreated } = this.props;
    const { imageData, postingDisabled, text } = this.state;

    if (postingDisabled) {
      Alert.alert(I18n.t(ext('blankPostWarning')));
    } else {
      authenticate(() => onStatusCreated(text, imageData));
    }
  }

  appendImage() {
    const options = {
      allowsEditing: true,
      maxHeight: 1024,
      maxWidth: 1024,
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        Alert.alert(response.error);
      } else if (!response.didCancel) {
        this.setState({ imageData: response });
      }
    });
  }

  removeImage() {
    this.setState({ imageData: undefined });
  }

  renderRightComponent() {
    return (
      <View styleName="container" virtual>
        <Button
          styleName="clear"
          onPress={this.addNewStatus}
        >
          <Text>{I18n.t(ext('postCommentButton'))}</Text>
        </Button>
      </View>
    );
  }

  renderHeader() {
    const { user } = this.props;

    const name = _.get(user, 'profile.name');
    const profile_image_url = _.get(user, 'profile.image');

    return (
      <View>
        <Row styleName="small">
          <Image
            styleName="small-avatar"
            source={{ uri: profile_image_url }}
          />
          <Text>{name}</Text>
        </Row>
      </View>
    );
  }

  renderTextInput() {
    const { text } = this.state;
    const { placeholder, statusMaxLength, style } = this.props;

    return (
      <View styleName="flexible">
        <TextInput
          style={style.textInput}
          multiline
          maxLength={statusMaxLength}
          placeholder={placeholder}
          onChangeText={this.handleTextChange}
          value={text}
          returnKeyType="next"
        />
        {this.renderAttachedImage()}
      </View>
    );
  }

  renderAttachedImage() {
    const { imageData } = this.state;

    if (!imageData) {
      return null;
    }

    return (
      <View styleName="md-gutter-vertical">
        <ImageBackground
          source={{ uri: `data:image/png;base64,${imageData.data}` }}
          styleName="large-wide"
        >
          <View styleName="fill-parent horizontal v-start h-end sm-gutter-right sm-gutter-top">
            <Button styleName="tight clear" onPress={this.removeImage}>
              <Icon name="close" />
            </Button>
          </View>
        </ImageBackground>
      </View>
    );
  }

  renderFooter() {
    const { enablePhotoAttachments, style } = this.props;
    const { numOfCharacters } = this.state;

    const keyboardOffset = Keyboard.calculateKeyboardOffset();
    const addPhotoButton = enablePhotoAttachments && (
      <TouchableOpacity onPress={this.appendImage}>
        <Icon name="take-a-photo" />
      </TouchableOpacity>
    );

    return (
      <KeyboardAvoidingView
        behavior='padding'
        keyboardVerticalOffset={keyboardOffset}
      >
        <Divider styleName="line" />
        <View
          styleName="horizontal space-between md-gutter"
          style={style.footer}
        >
          {addPhotoButton}
          <Caption>{numOfCharacters} characters left</Caption>
        </View>
      </KeyboardAvoidingView>
    );
  }

  render() {
    const { title } = this.props;

    return (
      <Screen styleName="paper with-notch-padding">
        <NavigationBar
          title={title}
          renderRightComponent={this.renderRightComponent}
        />
        <Divider styleName="line" />
        {this.renderHeader()}
        <ScrollView>
          {this.renderTextInput()}
        </ScrollView>
        {this.renderFooter()}
      </Screen>
    );
  }
}

export default connect(undefined, { authenticate })(
  connectStyle(ext('CreateStatusScreen'))(CreateStatusScreen),
);

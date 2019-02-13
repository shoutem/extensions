import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Alert, KeyboardAvoidingView } from 'react-native';

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
  ScrollView,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';
import { ImagePicker } from '@shoutem/ui-addons';

import { loginRequired } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';

import { user as userShape } from '../components/shapes';
import AutoGrowTextInput from '../components/AutoGrowTextInput';
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

    this.renderRightComponent = this.renderRightComponent.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.addNewStatus = this.addNewStatus.bind(this);
    this.appendImage = this.appendImage.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderTextInput = this.renderTextInput.bind(this);
    this.renderAttachedImage = this.renderAttachedImage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);

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
    const { onStatusCreated } = this.props;
    const { postingDisabled } = this.state;

    if (postingDisabled) {
      Alert.alert(I18n.t(ext('blankPostWarning')));
    } else {
      onStatusCreated(this.state.text, this.state.imageData);
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
    const { profile_image_url, name } = user;

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
    const { placeholder, statusMaxLength } = this.props;

    return (
      <View styleName="flexible">
        <AutoGrowTextInput
          multiline
          maxLength={statusMaxLength}
          placeholder={placeholder}
          autoFocus
          onTextChanged={this.handleTextChange}
          value={text}
        />
        {this.renderAttachedImage()}
      </View>
    );
  }

  renderAttachedImage() {
    if (!this.state.imageData) return null;

    return (
      <View>
        <ImageBackground
          source={{ uri: `data:image/png;base64,${this.state.imageData.data}` }}
          styleName="large-wide"
        >
          <View styleName="fill-parent horizontal v-start h-end">
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

    const addPhotoButton = enablePhotoAttachments ?
      <TouchableOpacity onPress={this.appendImage}>
        <Icon name="take-a-photo" />
      </TouchableOpacity> : null;

    return (
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-64}>
        <Divider styleName="line" />
        <View
          styleName="sm-gutter-top md-gutter-horizontal horizontal v-end space-between"
          style={style.footer}
        >
          {addPhotoButton}
          <Caption>{this.state.numOfCharacters} characters left</Caption>
        </View>
      </KeyboardAvoidingView>
    );
  }

  render() {
    const { title } = this.props;

    return (
      <Screen styleName="paper">
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

export default loginRequired(connectStyle(ext('CreateStatusScreen'))(CreateStatusScreen), true);

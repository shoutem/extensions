import React, {
  Component,
} from 'react';

import { Alert, KeyboardAvoidingView } from 'react-native';
import _ from 'lodash';

import {
  Screen,
  TextInput,
  Row,
  Text,
  Image,
  Button,
  View,
  Divider,
  Caption,
  Icon,
  TouchableOpacity,
  ScrollView,
} from '@shoutem/ui';

import { NavigationBar } from '@shoutem/ui/navigation';
import { ImagePicker } from '@shoutem/ui-addons';

import { loginRequired } from 'shoutem.auth';

import { user as userShape } from '../components/shapes';
import { ext } from '../const';

const { string, func, number, object, bool } = React.PropTypes;

export class CreateStatusScreen extends Component {
  static propTypes = {
    user: userShape.isRequired,
    onStatusCreated: func.isRequired,
    enablePhotoAttachments: bool,
    placeholder: string,
    statusMaxLength: number,
    title: string,
  };

  static defaultProps = {
    placeholder: '',
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
    this.handleContentSizeChange = this.handleContentSizeChange.bind(this);

    this.state = {
      text: '',
      numOfCharacters: props.statusMaxLength,
      postingDisabled: true,
      imageData: undefined,
      height: 25,
    };
  }

  handleTextChange(text) {
    const { statusMaxLength } = this.props;

    this.setState({
      text,
      numOfCharacters: statusMaxLength - text.length,
    });

    this.setState({ postingDisabled: text.length === 0 });
  }

  addNewStatus() {
    const { onStatusCreated } = this.props;
    const { postingDisabled } = this.state;
    if (postingDisabled) {
      Alert.alert('This post appears to be blank. Please write something.');
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
          <Text>Post</Text>
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

  handleContentSizeChange(event) {
    this.setState({ height: event.nativeEvent.contentSize.height });
  }

  renderTextInput() {
    const { placeholder, statusMaxLength } = this.props;

    return (
      <View styleName="flexible">
        <TextInput
          multiline
          maxLength={statusMaxLength}
          placeholder={placeholder}
          autoFocus
          onContentSizeChange={this.handleContentSizeChange}
          onChangeText={this.handleTextChange}
          style={{
            height: Math.max(25, this.state.height),
            paddingTop: 0,
          }}
        />
        {this.renderAttachedImage()}
      </View>
    );
  }

  renderAttachedImage() {
    if (!this.state.imageData) return null;

    return (
      <View>
        <Image
          source={{ uri: `data:image/png;base64,${this.state.imageData.data}` }}
          styleName="large-wide"
        >
          <View styleName="fill-parent horizontal v-start h-end">
            <Button styleName="tight clear" onPress={this.removeImage}>
              <Icon name="close" />
            </Button>
          </View>
        </Image>
      </View>
    );
  }

  renderFooter() {
    const { enablePhotoAttachments } = this.props;
    const addPhotoButton = enablePhotoAttachments ?
      <TouchableOpacity onPress={this.appendImage}>
        <Icon name="take-a-photo" />
      </TouchableOpacity> : null;

    return (
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-64}>
        <Divider styleName="line" />
        <View
          styleName="sm-gutter-vertical md-gutter-horizontal horizontal v-end space-between"
          style={{ backgroundColor: 'white' }}
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

export default loginRequired(CreateStatusScreen, true);

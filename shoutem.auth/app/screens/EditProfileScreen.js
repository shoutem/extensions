import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { connect } from 'react-redux';
import _ from 'lodash';
import { isBusy } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  FormGroup,
  Keyboard,
  Screen,
  ScrollView,
  Spinner,
  TextInput,
  View,
  ActionSheet,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { HeaderTextButton } from 'shoutem.navigation';
import {
  requestPermissions,
  PERMISSION_TYPES,
  RESULTS,
} from 'shoutem.permissions';
import ProfileImage from '../components/ProfileImage';
import { user as userShape } from '../components/shapes';
import { getUser, updateProfile } from '../redux';
import { ext } from '../const';

const { func } = PropTypes;

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_CAMERA,
  default: PERMISSION_TYPES.ANDROID_CAMERA,
});

const IMAGE_PICKER_OPTIONS = {
  mediaType: 'photo',
  allowsEditing: true,
  includeBase64: true,
  saveToPhotos: false,
  maxHeight: 500,
  maxWidth: 500,
};

const renderSavingChangesMessage = () => (
  <View styleName="xl-gutter-top">
    <Spinner />
  </View>
);

/**
 * A component that lets the user edit their profile.
 */
class EditProfileScreen extends PureComponent {
  static propTypes = {
    // Dispatched with new user information when updating the profile
    updateProfile: func.isRequired,
    // User that's editing his profile
    user: userShape,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = { ..._.get(props.user, 'profile', {}), pickerActive: false };

    this.fields = {
      name: I18n.t(ext('userNameAndSurname')),
      location: I18n.t(ext('userLocation')),
      url: I18n.t(ext('userWebsite')),
      description: I18n.t(ext('userBioTitle')),
    };

    this.fieldOptions = {
      url: {
        autoCapitalize: 'none',
      },
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({
      ...this.getNavbarProps(),
    });
  }

  handleFinish() {
    const { navigation } = this.props;

    navigation.goBack();
  }

  handlePickerClosePress() {
    this.setState({ pickerActive: false });
  }

  onDone() {
    const { updateProfile, user } = this.props;
    const { updatedImage } = this.state;
    const image = _.get(updatedImage, 'data');

    const updates = {
      ..._.mapValues(this.fields, (value, key) => this.state[key]),
      image,
    };

    const hasChanges = _.some(
      _.keys(updates),
      key => user[key] !== updates[key],
    );
    if (!hasChanges) {
      return this.handleFinish();
    }

    const newUser = {
      ...user,
      profile: { ...updates },
    };
    delete newUser.userGroups;

    return updateProfile(newUser)
      .then(this.handleFinish)
      .catch(() => {
        Alert.alert(
          I18n.t(ext('profileUpdatingErrorTitle')),
          I18n.t(ext('profileUpdatingErrorMessage')),
        );
      });
  }

  getNavbarProps() {
    return {
      headerRight: props => (
        <HeaderTextButton
          title={I18n.t(ext('doneNavBarButton'))}
          onPress={this.onDone}
          {...props}
        />
      ),
      title: I18n.t(ext('editProfileNavBarTitle')),
    };
  }

  handleImagePickerResponse(response) {
    if (response.errorCode) {
      Alert.alert(
        I18n.t(ext('imageSelectErrorMessage')),
        response.errorMessage,
      );
      return;
    }

    if (response.didCancel) {
      this.setState({ pickerActive: false });
      return;
    }

    const { assets } = response;
    const updatedImage = {
      uri: `data:image/jpeg;base64,${assets[0].base64}`,
      data: assets[0].base64,
    };

    this.setState({ updatedImage, pickerActive: false });
  }

  handleCameraPickerPress() {
    requestPermissions(CAMERA_PERMISSION).then(result => {
      if (result[CAMERA_PERMISSION] === RESULTS.GRANTED) {
        return launchCamera(
          IMAGE_PICKER_OPTIONS,
          this.handleImagePickerResponse,
        );
      }
    });
  }

  handleGalleryPickerPress() {
    launchImageLibrary(IMAGE_PICKER_OPTIONS, this.handleImagePickerResponse);
  }

  handleChangeProfileImagePress() {
    this.setState({ pickerActive: true });
  }

  renderInput(name, label, options) {
    const isTextArea = name === 'description';

    return (
      <FormGroup key={name}>
        <Caption>{label.toUpperCase()}</Caption>
        <TextInput
          placeholder={label}
          autoCorrect={false}
          keyboardAppearance="dark"
          onChangeText={text => this.setState({ [name]: text })}
          returnKeyType="done"
          style={isTextArea ? { height: 90 } : {}}
          maxLength={160}
          multiline={isTextArea}
          numberOfLines={4}
          textTransform={'none'}
          value={this.state[name] || ''}
          {...options}
        />
        <Divider styleName="line sm-gutter-bottom" />
      </FormGroup>
    );
  }

  renderForm() {
    return _.map(_.keys(this.fields), key =>
      this.renderInput(key, this.fields[key], this.fieldOptions[key]),
    );
  }

  renderContent() {
    const { user } = this.props;
    const { updatedImage } = this.state;

    if (isBusy(user)) {
      return renderSavingChangesMessage();
    }

    const username = _.get(user, 'profile.nick');
    // updated image takes precedence, it will be set if user is currently
    // editing profile and changed the image
    const image = _.get(updatedImage, 'uri') || _.get(user, 'profile.image');

    return (
      <ScrollView>
        <ProfileImage
          isEditable
          onPress={this.handleChangeProfileImagePress}
          uri={image}
        />
        {this.renderForm()}
        <Caption styleName="h-center">
          {I18n.t(ext('loggedInUserInfo'), { username })}
        </Caption>
      </ScrollView>
    );
  }

  render() {
    const { pickerActive } = this.state;
    const keyboardOffset =
      Platform.OS === 'ios' ? Keyboard.calculateKeyboardOffset() : 0;
    const pickerOptions = [
      {
        title: I18n.t(ext('imagePickerCameraOption')),
        onPress: this.handleCameraPickerPress,
      },
      {
        title: I18n.t(ext('imagePickerGalleryOption')),
        onPress: this.handleGalleryPickerPress,
      },
    ];

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardOffset}
        style={{ flex: 1 }}
      >
        <Screen>{this.renderContent()}</Screen>
        <ActionSheet
          confirmOptions={pickerOptions}
          active={pickerActive}
          onDismiss={this.handlePickerClosePress}
        />
      </KeyboardAvoidingView>
    );
  }
}

export const mapStateToProps = state => ({
  user: getUser(state),
});

export const mapDispatchToProps = { updateProfile };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EditProfileScreen'))(EditProfileScreen));

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Button,
  Caption,
  Divider,
  ScrollView,
  FormGroup,
  Screen,
  Spinner,
  Subtitle,
  TextInput,
  View,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';
import { ImagePicker } from '@shoutem/ui-addons';
import { connectStyle } from '@shoutem/theme';
import { isBusy } from '@shoutem/redux-io';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';
import {
  getUser,
  updateProfile,
} from '../redux';
import { user as userShape } from '../components/shapes';
import ProfileImage from '../components/ProfileImage';

const { func } = PropTypes;

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
    // Called when updating the profile is cancelled or done
    onClose: func.isRequired,
    // Dispatched with new user information when updating the profile
    updateProfile: func.isRequired,
    // User that's editing his profile
    user: userShape,
  };

  constructor(props) {
    super(props);

    this.changeProfileImage = this.changeProfileImage.bind(this);
    this.onDone = this.onDone.bind(this);

    this.state = { ..._.get(props.user, 'profile', {}) };

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

  onDone() {
    const { onClose, updateProfile, user } = this.props;
    const { updatedImage } = this.state;
    const image = _.get(updatedImage, 'data');

    const updates = {
      ..._.mapValues(this.fields, (value, key) => this.state[key]),
      image,
    };

    const hasChanges = _.some(_.keys(updates), key => user[key] !== updates[key]);
    if (!hasChanges) {
      return onClose();
    }

    const newUser = {
      ...user,
      profile: { ...updates },
    };
    delete newUser.userGroups;

    return updateProfile(newUser)
      .then(onClose)
      .catch((error) => {
        console.log(error);
        Alert.alert(
          I18n.t(ext('profileUpdatingErrorTitle')),
          I18n.t(ext('profileUpdatingErrorMessage'))
        );
      });
  }

  getNavbarProps() {
    return {
      renderRightComponent: () => (
        <View
          styleName="container"
          virtual
        >
          <Button onPress={this.onDone}>
            <Subtitle>{I18n.t(ext('doneNavBarButton'))}</Subtitle>
          </Button>
        </View>
      ),
      title: I18n.t(ext('editProfileNavBarTitle')),
    };
  }

  changeProfileImage() {
    const options = {
      allowsEditing: true,
      maxHeight: 500,
      maxWidth: 500,
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        Alert.alert(I18n.t(ext('imageSelectErrorMessage')), response.error);
      } else if (!response.didCancel) {
        const { data } = response;
        const updatedImage = {
          uri: `data:image/jpeg;base64,${data}`,
          data,
        };
        this.setState({ updatedImage });
      }
    });
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
    return _.map(
      _.keys(this.fields),
      key => this.renderInput(key, this.fields[key], this.fieldOptions[key]),
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
    const keyboardViewBehavior = Platform.OS === 'ios' ? 'position' : null;

    return (
      <ScrollView>
        <KeyboardAvoidingView behavior={keyboardViewBehavior}>
          <ProfileImage
            isEditable
            onPress={this.changeProfileImage}
            uri={image}
          />
          {this.renderForm()}
          <Caption styleName="h-center">
            {I18n.t(ext('loggedInUserInfo'), { username })}
          </Caption>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }

  render() {
    return (
      <Screen>
        <NavigationBar {...this.getNavbarProps()} />
        {this.renderContent()}
      </Screen>
    );
  }
}

export const mapStateToProps = state => ({
  user: getUser(state),
});

export const mapDispatchToProps = { updateProfile };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('EditProfileScreen'))(EditProfileScreen),
);

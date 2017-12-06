import React, {
  Component,
} from 'react';

import { Alert } from 'react-native';

import { connect } from 'react-redux';

import _ from 'lodash';

import {
  Button,
  Caption,
  Divider,
  FormGroup,
  Screen,
  ScrollView,
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
  updateProfileImage,
} from '../redux';

import { user as userShape } from '../components/shapes';
import ProfileImage from '../components/ProfileImage';

const { func } = React.PropTypes;

const renderSavingChangesMessage = () => (
  <View styleName="xl-gutter-top">
    <Spinner />
  </View>
);

/**
 * A component that lets the user edit his profile.
 */
class EditProfileScreen extends Component {
  static propTypes = {
    // Called when updating the profile is cancelled or done
    onClose: func.isRequired,
    // Dispatched with new user information when updating the profile
    updateProfile: func.isRequired,
    // Dispatched when the user has updated his profile image
    updateProfileImage: func.isRequired,
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
  }

  onDone() {
    const { onClose, updateProfile, user } = this.props;

    const updates = _.mapValues(this.fields, (value, key) => this.state[key]);
    const hasChanges = _.some(_.keys(updates), key => user[key] !== updates[key]);
    const newUser = {
      ...user,
      profile: { ...updates }
    };

    delete newUser.userGroups;

    if (!hasChanges) {
      return onClose();
    }

    return updateProfile(newUser)
      .then(onClose)
      .catch((error) => {
        console.log(error);
        Alert.alert(I18n.t(ext('profileUpdatingErrorTitle')), I18n.t(ext('profileUpdatingErrorMessage')));
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
    const { updateProfileImage } = this.props;

    const options = {
      allowsEditing: true,
      maxHeight: 500,
      maxWidth: 500,
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        Alert.alert(I18n.t(ext('imageSelectError')), response.error);
      } else if (!response.didCancel) {
        this.setState({ image: response.data });
      }
    });
  }

  renderInput(name, label) {
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
          value={this.state[name] || ''}
        />
        <Divider styleName="line sm-gutter-bottom" />
      </FormGroup>
    );
  }

  renderForm() {
    return _.map(_.keys(this.fields), key => this.renderInput(key, this.fields[key]));
  }

  renderContent() {
    const { user } = this.props;
    const { profile, username } = user;
    const { firstName, lastName, image } = profile;

    if (isBusy(user)) {
      return renderSavingChangesMessage();
    }

    return (
      <View>
        <NavigationBar {...this.getNavbarProps()} />
        <ScrollView>
          <ProfileImage
            isEditable
            onPress={this.changeProfileImage}
            uri={image || ''}
          />
          {this.renderForm()}
          <Caption styleName="lg-gutter-vertical h-center">
            {I18n.t(ext('loggedInUserInfo'), { username })}
          </Caption>
        </ScrollView>
      </View>
    );
  }

  render() {
    return (
      <Screen>
        {this.renderContent()}
      </Screen>
    );
  }
}

export const mapStateToProps = state => ({
  user: getUser(state),
});

export const mapDispatchToProps = { updateProfile, updateProfileImage };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('EditProfileScreen'))(EditProfileScreen),
);

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-native';

import {
  Button,
  Caption,
  Icon,
  ImageGallery,
  NavigationBar as UINavigationBar,
  Screen,
  ScrollView,
  Subtitle,
  Text,
  Title,
  View,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';
import { connectStyle } from '@shoutem/theme';
import { closeModal, openInModal } from '@shoutem/core/navigation';

import { I18n } from 'shoutem.i18n';

import { user as userShape } from '../components/shapes';
import ProfileImage from '../components/ProfileImage';
import {
  getUser,
  logout,
} from '../redux';
import { ext } from '../const';

const { func } = PropTypes;

export class UserProfileScreen extends PureComponent {
  static propTypes = {
    // Closes the modal in which the edit profile screen is opened
    closeModal: func,
    // Dispatched to log the user out of the application
    logout: func,
    // Opens the modal in which the edit profile screen is opened
    openInModal: func,
    // User to which the profile belongs
    user: userShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.toggleImageGallery = this.toggleImageGallery.bind(this);
    this.openEditProfileScreen = this.openEditProfileScreen.bind(this);

    this.state = {
      shouldRenderImageGallery: false,
    };
  }

  getNavBarProps() {
    const { logout, isProfileOwner } = this.props;

    return {
      renderRightComponent: () => {
        if (isProfileOwner) {
          return (
            <View virtual styleName="container">
              <Button
                onPress={logout}
                styleName="clear"
              >
                <Subtitle>{I18n.t(ext('profileNavBarLogoutButton'))}</Subtitle>
              </Button>
            </View>
          );
        } else {
          return null;
        }
      },
      title: I18n.t(ext('profileNavBarTitle')),
    };
  }

  getImageGalleryNavbarProps() {
    const { first_name, url } = this.props.user;

    const share = {
      title: first_name,
      link: url,
    };

    return {
      styleName: 'clear',
      leftComponent: (
        <Button styleName="clear tight" onPress={this.toggleImageGallery}>
          <Icon name="close" />
        </Button>
      ),
      share,
    };
  }

  toggleImageGallery() {
    const { profile_image_url: image } = this.props.user;
    if (image) {
      this.setState({ shouldRenderImageGallery: !this.state.shouldRenderImageGallery });
    }
  }

  openEditProfileScreen() {
    const { closeModal, openInModal } = this.props;

    const route = {
      screen: ext('EditProfileScreen'),
      props: {
        onClose: closeModal,
      },
    };

    openInModal(route);
  }

  renderImageGallery() {
    const { profile_image_url: image } = this.props.user;
    const { shouldRenderImageGallery } = this.state;

    const data = [{ source: { uri: image }, title: '' }];

    return (
      <Modal
        visible={shouldRenderImageGallery}
        onRequestClose={this.toggleImageGallery}
      >
        <ImageGallery
          data={data}
          selectedIndex={0}
        />
        <UINavigationBar {...this.getImageGalleryNavbarProps()} />
      </Modal>
    );
  }

  renderEditButton() {
    const { isProfileOwner } = this.props;

    if (!isProfileOwner) {
      return null;
    }

    return (
      <Button
        styleName="secondary md-gutter-vertical"
        onPress={this.openEditProfileScreen}
      >
        <Icon name="edit" />
        <Text>{I18n.t(ext('editProfileButton'))}</Text>
      </Button>
    );
  }

  renderNickName() {
    const { nickname, nick, name } = _.get(this, ['props', 'user', 'profile']);

    // user nickname is returned under different key on different endpoints
    // ('nick' on My Profile page, 'nickname' on User Profile page... )
    const actualName = nickname || nick || name;

    if (_.isEmpty(actualName)) {
      return null;
    }

    return (
      <Title styleName="md-gutter-vertical">{actualName}</Title>
    );
  }

  renderContent() {
    const { profile } = this.props.user;

    if (_.isEmpty(profile)) {
      return null;
    }

    const {
      name,
      nick,
      image,
      location,
      url,
      description,
    } = profile;

    return (
      <View styleName="vertical h-center lg-gutter-top">
        <ProfileImage
          onPress={this.toggleImageGallery}
          uri={image}
        />
        {nick ?
          <Caption styleName="md-gutter-vertical">{`${nick}`}</Caption>
          :
          null
        }
        {name ?
          <Title styleName="md-gutter-vertical">{name}</Title>
          :
          null
        }
        {location ?
          <Caption styleName="md-gutter-vertical">{`${location}`}</Caption>
          :
          null
        }
        {url ?
          <Caption styleName="md-gutter-vertical">{`${url}`}</Caption>
          :
          null
        }
        <Text styleName="h-center">
          {description}
        </Text>
        {this.renderEditButton()}
      </View>
    );
  }

  render() {
    return (
      <Screen styleName="paper">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderContent()}
        </ScrollView>
        {this.renderImageGallery()}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const me = getUser(state);
  const isProfileOwner = !_.isEmpty(ownProps.user) ? _.get(ownProps.user, 'id') === _.get(me, 'legacyId') : !_.isEmpty(me);
  const user = isProfileOwner ? me : ownProps.user || me;

  return {
    user: user || me || {},
    isProfileOwner,
  };
};

export const mapDispatchToProps = {
  closeModal,
  logout,
  openInModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('UserProfileScreen'))(UserProfileScreen));

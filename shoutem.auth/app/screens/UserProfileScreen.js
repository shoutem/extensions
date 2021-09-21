import React, { PureComponent } from 'react';
import { Modal } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import {
  Button,
  Caption,
  Icon,
  ImageGallery,
  NavigationBar as UINavigationBar,
  Screen,
  ScrollView,
  Text,
  Title,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import {
  openInModal,
  getRouteParams,
  HeaderTextButton,
} from 'shoutem.navigation';
import { I18n } from 'shoutem.i18n';
import { user as userShape } from '../components/shapes';
import ProfileImage from '../components/ProfileImage';
import {
  getUser,
  logout,
  isSendBirdConfigured,
  isAgoraConfigured,
} from '../redux';
import { ext, SENDBIRD_SCREEN_ID, AGORA_SCREEN_ID } from '../const';

export class UserProfileScreen extends PureComponent {
  static propTypes = {
    isProfileOwner: PropTypes.bool,
    sendBirdConfigured: PropTypes.bool,
    isAgoraConfigured: PropTypes.bool,
    logout: PropTypes.func,
    user: userShape.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      shouldRenderImageGallery: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({
      ...this.getNavBarProps(),
    });
  }

  getNavBarProps() {
    const { logout, isProfileOwner } = this.props;

    return {
      headerRight: props => {
        if (isProfileOwner) {
          return (
            <HeaderTextButton
              title={I18n.t(ext('profileNavBarLogoutButton'))}
              onPress={logout}
              {...props}
            />
          );
        }

        return null;
      },
      title: I18n.t(ext('profileNavBarTitle')),
    };
  }

  getImageGalleryNavbarProps() {
    const {
      // eslint-disable-next-line camelcase
      user: { first_name, url },
    } = this.props;

    const share = {
      title: first_name,
      link: url,
    };

    return {
      styleName: 'clear',
      leftComponent: (
        <Button onPress={this.toggleImageGallery} styleName="clear tight">
          <Icon name="close" />
        </Button>
      ),
      share,
    };
  }

  toggleImageGallery() {
    const { profile_image_url: image } = this.props.user;
    if (image) {
      this.setState({
        shouldRenderImageGallery: !this.state.shouldRenderImageGallery,
      });
    }
  }

  openEditProfileScreen() {
    openInModal(ext('EditProfileScreen'));
  }

  handleChatPress() {
    const { user } = this.props;

    openInModal(SENDBIRD_SCREEN_ID, { user });
  }

  handleAgoraPress() {
    const { user } = this.props;

    openInModal(AGORA_SCREEN_ID, { user });
  }

  renderImageGallery() {
    const { profile_image_url: image } = this.props.user;
    const { shouldRenderImageGallery } = this.state;

    const data = [{ source: { uri: image }, title: '' }];

    return (
      <Modal
        onRequestClose={this.toggleImageGallery}
        visible={shouldRenderImageGallery}
      >
        <ImageGallery data={data} selectedIndex={0} />
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
        onPress={this.openEditProfileScreen}
        styleName="secondary md-gutter-vertical"
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

    return <Title styleName="md-gutter-vertical">{actualName}</Title>;
  }

  renderChatButton() {
    const { isProfileOwner, sendBirdConfigured } = this.props;

    if (!sendBirdConfigured || isProfileOwner) {
      return null;
    }

    return (
      <Button onPress={this.handleChatPress} styleName="stacked clear">
        <Icon name="activity" />
        <Text>{I18n.t(ext('chat'))}</Text>
      </Button>
    );
  }

  renderVideoChatButton() {
    const { isProfileOwner, agoraConfigured } = this.props;

    if (!agoraConfigured || isProfileOwner) {
      return null;
    }

    return (
      <Button onPress={this.handleAgoraPress} styleName="stacked clear">
        <Icon name="video-chat" />
        <Text>{I18n.t(ext('videoChat'))}</Text>
      </Button>
    );
  }

  renderContent() {
    const { profile } = this.props.user;

    if (_.isEmpty(profile)) {
      return null;
    }

    const { name, nick, image, location, url, description } = profile;

    return (
      <View styleName="vertical h-center lg-gutter-top">
        <ProfileImage onPress={this.toggleImageGallery} uri={image} />
        {nick ? (
          <Caption styleName="md-gutter-vertical">{`${nick}`}</Caption>
        ) : null}
        {name ? <Title styleName="md-gutter-vertical">{name}</Title> : null}
        {location ? (
          <Caption styleName="md-gutter-vertical">{`${location}`}</Caption>
        ) : null}
        {url ? (
          <Caption styleName="md-gutter-vertical">{`${url}`}</Caption>
        ) : null}
        <Text styleName="h-center">{description}</Text>
        {this.renderEditButton()}
        {this.renderVideoChatButton()}
        {this.renderChatButton()}
      </View>
    );
  }

  render() {
    return (
      <Screen styleName="paper">
        <ScrollView>{this.renderContent()}</ScrollView>
        {this.renderImageGallery()}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const navProps = getRouteParams(ownProps);
  const passedUser = _.get(navProps, 'user');
  const me = getUser(state);
  const isProfileOwner = !_.isEmpty(passedUser)
    ? _.get(passedUser, 'id') === _.get(me, 'id')
    : !_.isEmpty(me);
  const user = isProfileOwner ? me : passedUser || me;

  return {
    user: user || me || {},
    isProfileOwner,
    sendBirdConfigured: isSendBirdConfigured(state),
    agoraConfigured: isAgoraConfigured(state),
  };
};

export const mapDispatchToProps = { logout };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('UserProfileScreen'))(UserProfileScreen));

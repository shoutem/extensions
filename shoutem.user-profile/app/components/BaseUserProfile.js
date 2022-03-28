import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, ImageBackground, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { openInModal } from 'shoutem.navigation';
import { images } from '../assets';
import {
  AGORA_SCREEN_ID,
  ext,
  PROFILE_HEADER_FIELDS,
  SENDBIRD_SCREEN_ID,
} from '../const';
import {
  getUserProfileState,
  isAgoraConfigured,
  isSendBirdConfigured,
  isUserProfileOwner,
} from '../redux';

function BaseUserProfile({ style, user }) {
  const userProfileSchema = useSelector(getUserProfileState);

  const isProfileOwner = useSelector(state => isUserProfileOwner(state, user));

  const agoraConfigured = useSelector(isAgoraConfigured);
  const sendbirdConfigured = useSelector(isSendBirdConfigured);

  const displayBaseUserProfile = PROFILE_HEADER_FIELDS.some(headerFieldKey =>
    _.keys(userProfileSchema).includes(headerFieldKey),
  );

  if (!displayBaseUserProfile) {
    return null;
  }

  // Show only values defined in user profile schema
  const profile = _.pick(user.profile, _.keys(userProfileSchema));
  const { nick, name, image } = profile;

  function handleVideoButtonPress() {
    openInModal(AGORA_SCREEN_ID, { user });
  }

  function handleChatButtonPress() {
    openInModal(SENDBIRD_SCREEN_ID, { user });
  }

  const source = image ? { uri: image } : images.defaultAvatar;

  return (
    <View styleName="flexible vertical h-center v-center md-gutter-bottom">
      <ImageBackground
        styleName="medium-avatar placeholder md-gutter-bottom"
        source={source}
        borderRadius={style.profileImage?.borderRadius}
      />
      {!_.isEmpty(name) && <Text style={style.name}>{name}</Text>}
      {!!nick && <Text style={style.nick}>{nick}</Text>}
      {!isProfileOwner && (
        <View styleName="flexible horizontal h-center md-gutter">
          {agoraConfigured && (
            <Button onPress={handleVideoButtonPress} styleName="stacked clear">
              <Icon name="video-chat" />
              <Text>{I18n.t(ext('video'))}</Text>
            </Button>
          )}
          {sendbirdConfigured && (
            <Button onPress={handleChatButtonPress} styleName="stacked clear">
              <Icon name="activity" />
              <Text>{I18n.t(ext('chat'))}</Text>
            </Button>
          )}
        </View>
      )}
    </View>
  );
}

BaseUserProfile.propTypes = {
  user: PropTypes.shape({
    profile: PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string,
      nick: PropTypes.string,
    }),
  }).isRequired,
  style: PropTypes.object,
};

BaseUserProfile.defaultProps = {
  style: {},
};

export default connectStyle(ext('BaseUserProfile'))(BaseUserProfile);

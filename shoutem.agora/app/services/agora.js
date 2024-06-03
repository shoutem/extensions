import { Alert } from 'react-native';
import _ from 'lodash';
import { I18n } from 'shoutem.i18n';
import { images } from '../assets';
import { ext } from '../const';

export const resolveUserData = (localUser, remoteUser) => {
  // Local user data
  const localUserId = parseInt(_.get(localUser, 'legacyId'));
  const localUserProfileImage = localUser?.profile?.image
    ? { uri: localUser?.profile?.image }
    : images.emptyUserProfile;

  // Remote user data
  const remoteUserId = parseInt(remoteUser.legacyId);

  const remoteUserFullName =
    _.get(remoteUser, 'profile.name') || _.get(remoteUser, 'profile.nick', '');

  const profileImageUrl = _.get(remoteUser, 'profile.image');
  const remoteUserProfileImage = profileImageUrl
    ? { uri: profileImageUrl }
    : images.emptyUserProfile;

  return {
    localUser: { id: localUserId, profileImage: localUserProfileImage },
    remoteUser: {
      id: remoteUserId,
      fullName: remoteUserFullName,
      profileImage: remoteUserProfileImage,
    },
  };
};

export const resolveChannelName = (localUser, remoteUser) => {
  const localUserId = localUser.id;
  const remoteUserId = remoteUser.id;

  if (!localUserId || !remoteUserId) {
    return Alert.alert(
      I18n.t(ext('missingUidErrorTitle')),
      I18n.t(ext('missingUidErrorMessage')),
      [
        {
          text: 'Ok',
          style: 'cancel',
        },
        { cancelable: true },
      ],
    );
  }

  const channelName =
    localUserId > remoteUserId
      ? `${remoteUserId}${localUserId}`
      : `${localUserId}${remoteUserId}`;

  return channelName.toString();
};

export const connectionFailedAlert = onPress => {
  return Alert.alert(
    I18n.t(ext('localUserFailsToConnectTitle')),
    I18n.t(ext('localUserFailsToConnectMessage')),
    [
      {
        text: 'Ok',
        onPress,
      },
    ],
  );
};

export const authFailedAlert = () => {
  return Alert.alert(
    I18n.t(ext('userNotAuthenticatedTitle')),
    I18n.t(ext('userNotAuthenticatedMessage')),
    [
      {
        text: 'Ok',
        style: 'cancel',
      },
      { cancelable: true },
    ],
  );
};

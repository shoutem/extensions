import { Alert, NativeModules } from 'react-native';
import _ from 'lodash';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const { Agora } = NativeModules;
const {
  FPS30,
  AudioProfileDefault,
  AudioScenarioDefault,
  FixedPortrait,
} = Agora;

// states of remote user's camera
export const REMOTE_VIDEO_STATES = {
  MUTED: 0,
  STARTING: 1,
  NOT_MUTED: 2,
};

// Agora events
export const EVENTS = {
  REMOTE_USER_JOINED: 'userJoined',
  REMOTE_USER_LEFT: 'userOffline',
  LOCAL_USER_JOINED_CHANNEL: 'joinChannelSuccess',
  LOCAL_USER_LEFT_CHANNEL: 'leaveChannel',
  REMOTE_VIDEO_STATE_CHANGED: 'remoteVideoStateChanged',
};

// defines Agora stream defaults
export function getAgoraConfig(appId) {
  return {
    appid: appId,
    channelProfile: 0,
    videoEncoderConfig: {
      width: 720,
      height: 1080,
      bitrate: 1,
      frameRate: FPS30,
      orientationMode: FixedPortrait,
    },
    audioProfile: AudioProfileDefault,
    audioScenario: AudioScenarioDefault,
  };
}

export function resolveChannelName(localUser, remoteUser) {
  const localUserId = localUser.legacyId;
  const remoteUserId = remoteUser.legacyId;

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
}

export function connectionFailedAlert() {
  return Alert.alert(
    I18n.t(ext('localUserFailsToConnectTitle')),
    I18n.t(ext('localUserFailsToConnectMessage')),
    [
      {
        text: 'Ok',
        style: 'cancel',
      },
      { cancelable: true },
    ],
  );
}

export function authFailedAlert() {
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
}

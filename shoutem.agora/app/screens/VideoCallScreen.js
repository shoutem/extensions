import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RtcEngine } from 'react-native-agora';
import autoBind from 'auto-bind';
import _ from 'lodash';
import { View, Screen } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { getUser, isAuthenticated } from 'shoutem.auth';
import { getExtensionSettings } from 'shoutem.application/redux';
import {
  checkPermissions,
  openDeviceSettings,
  PERMISSION_RESULT_TYPES,
  PERMISSION_TYPES,
  requestPermissions,
} from 'shoutem.permissions';
import WaitingForPeerView from '../components/WaitingForPeerView';
import VideoCallView from '../components/VideoCallView';
import VideoCallStartingView from '../components/VideoCallStartingView';
import * as Agora from '../services/agora';
import { images } from '../assets/index';
import { ext } from '../const';

const MICROPHONE = Platform.select({
  ios: PERMISSION_TYPES.IOS_MICROPHONE,
  default: PERMISSION_TYPES.ANDROID_RECORD_AUDIO,
});

const CAMERA = Platform.select({
  ios: PERMISSION_TYPES.IOS_CAMERA,
  default: PERMISSION_TYPES.ANDROID_CAMERA,
});

const { GRANTED } = PERMISSION_RESULT_TYPES;

class VideoCallScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBind(this);

    const { localUser, channelName } = props;
    const { user } = getRouteParams(props);
    const localUserId = parseInt(_.get(localUser, 'legacyId'));

    this.state = {
      audioMute: false,
      frontCamera: true,
      connectionSuccess: false,
      peerIds: [],
      stopwatchStart: false,
      stopwatchReset: false,
      channelName: channelName || Agora.resolveChannelName(localUser, user),
      uid: localUserId || Math.floor(Math.random() * 100),
      videoMute: false,
      remoteVideoMute: false,
      remoteAudioMute: false,
      loadingLocalChannel: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ ...composeNavigationStyles(['clear']), title: '' });
    // Requesting Mic and Camera permissions
    requestPermissions(CAMERA, MICROPHONE);

    // If new user has joined
    RtcEngine.on(Agora.EVENTS.REMOTE_USER_JOINED, data => {
      const { peerIds } = this.state;

      this.toggleStopwatch();
      if (peerIds.indexOf(data.uid) === -1) {
        this.setState({
          peerIds: [...peerIds, data.uid],
        });
      }
    });

    // If remote user leaves
    RtcEngine.on(Agora.EVENTS.REMOTE_USER_LEFT, data => {
      const { peerIds } = this.state;

      this.resetStopwatch();
      this.setState({
        peerIds: peerIds.filter(uid => uid !== data.uid),
        videoMute: false,
        audioMute: false,
      });
    });

    // If Local user joins RTC channel
    RtcEngine.on(Agora.EVENTS.LOCAL_USER_JOINED_CHANNEL, () => {
      RtcEngine.startPreview();

      this.setState({
        loadingLocalChannel: false,
        connectionSuccess: true,
      });
    });

    // If Local user leaves RTC channel
    RtcEngine.on(Agora.EVENTS.LOCAL_USER_LEFT_CHANNEL, () => {
      this.resetStopwatch();
    });

    // If remote user changes video state
    RtcEngine.on(Agora.EVENTS.REMOTE_VIDEO_STATE_CHANGED, data => {
      const { state } = data;

      const newStatus = state !== Agora.REMOTE_VIDEO_STATES.NOT_MUTED;
      this.handleRemoteVideoState(newStatus);
    });

    // Initialize the RTC engine
    const { extensionSettings } = this.props;
    const appId = _.get(extensionSettings, 'appId', '');
    const agoraConfig = Agora.getAgoraConfig(appId);

    RtcEngine.init(agoraConfig);
  }

  componentWillUnmount() {
    RtcEngine.destroy();
  }

  startCall() {
    const { channelName, uid } = this.state;

    RtcEngine.joinChannel(channelName, uid)
      .then(() => {
        this.setState({ loadingLocalChannel: true });
        RtcEngine.enableAudio();
      })
      .catch(() => Agora.connectionFailedAlert());
  }

  handleEndCallPress() {
    RtcEngine.leaveChannel();
    this.setState({
      peerIds: [],
      connectionSuccess: false,
      videoMute: false,
      audioMute: false,
    });
  }

  handleAudioMutePress() {
    const { audioMute } = this.state;

    RtcEngine.muteLocalAudioStream(!audioMute);
    this.setState({
      audioMute: !audioMute,
    });
  }

  handleVideoMutePress() {
    const { videoMute } = this.state;

    RtcEngine.muteLocalVideoStream(!videoMute);
    this.setState({
      videoMute: !videoMute,
    });
  }

  handleStartCallPress() {
    const { isUserAuthenticated, localUser } = this.props;
    const localUserId = parseInt(_.get(localUser, 'legacyId'));

    if (!isUserAuthenticated && localUserId) {
      return Agora.authFailedAlert();
    }

    /* this function checks camera and microphone status and opens Settings Page
    if permissions have not been granted */
    return checkPermissions(CAMERA, MICROPHONE)
      .then(statuses => {
        const camera = statuses[CAMERA];
        const microphone = statuses[MICROPHONE];

        if (microphone === GRANTED && camera === GRANTED) {
          return true;
        }

        openDeviceSettings();
        return false;
      })
      .catch(error => {
        console.log('Check permissions failed:', error);
      })
      .then(permissionsGranted => {
        if (permissionsGranted) {
          return this.startCall();
        }

        return null;
      })
      .catch(error => {
        console.log('Start call button press failed', error);
      });
  }

  handleCameraSwitchPress() {
    const { frontCamera } = this.state;

    RtcEngine.switchCamera(!frontCamera);
    this.setState({
      frontCamera: !frontCamera,
    });
  }

  toggleStopwatch() {
    const { stopwatchStart } = this.state;

    this.setState({
      stopwatchStart: !stopwatchStart,
      stopwatchReset: false,
    });
  }

  resetStopwatch() {
    this.setState({ stopwatchStart: false, stopwatchReset: true });
  }

  handleRemoteVideoState(newStatus) {
    this.setState({
      remoteVideoMute: newStatus,
    });
  }

  render() {
    const {
      connectionSuccess,
      peerIds,
      audioMute,
      videoMute,
      stopwatchReset,
      stopwatchStart,
      remoteVideoMute,
      remoteAudioMute,
      loadingLocalChannel,
    } = this.state;
    const { style, remoteUserFullName, remoteUserProfileImage } = this.props;
    const { user } = getRouteParams(this.props);

    const profileImageUrl = _.get(user, 'profile.image');
    const image = profileImageUrl
      ? { uri: profileImageUrl }
      : images.emptyUserProfile;
    const profileImage = remoteUserProfileImage || image;
    const userProfileName =
      _.get(user, 'profile.name') || _.get(user, 'profile.nick', '');
    const fullName = remoteUserFullName || userProfileName;
    const waitingForPeer = connectionSuccess && peerIds.length === 0;
    const videoCallEstablished = connectionSuccess && peerIds.length === 1;

    return (
      <Screen>
        <View style={style.agoraScreenContainer}>
          {!connectionSuccess && (
            <VideoCallStartingView
              fullName={fullName}
              image={profileImage}
              channelLoading={loadingLocalChannel}
              onStartCallPress={this.handleStartCallPress}
            />
          )}

          {waitingForPeer && (
            <WaitingForPeerView
              fullName={fullName}
              image={profileImage}
              onEndCallPress={this.handleEndCallPress}
            />
          )}

          {videoCallEstablished && (
            <VideoCallView
              audioMute={audioMute}
              connectionSuccess={connectionSuccess}
              fullName={fullName}
              image={profileImage}
              onAudioMutePress={this.handleAudioMutePress}
              onCameraSwitchPress={this.handleCameraSwitchPress}
              onEndCallPress={this.handleEndCallPress}
              onStartCallPress={this.handleStartCallPress}
              onVideoMutePress={this.handleVideoMutePress}
              remoteAudioMute={remoteAudioMute}
              remoteUserId={peerIds[0]}
              remoteVideoMute={remoteVideoMute}
              stopwatchReset={stopwatchReset}
              stopwatchStart={stopwatchStart}
              videoMute={videoMute}
            />
          )}
        </View>
      </Screen>
    );
  }
}

VideoCallScreen.propTypes = {
  channelName: PropTypes.string,
  remoteUserFullName: PropTypes.string,
  image: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ uri: PropTypes.string }),
  ]),
  isUserAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  localUser: PropTypes.object,
  extensionSettings: PropTypes.object,
  style: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    localUser: getUser(state),
    isUserAuthenticated: isAuthenticated(state),
    extensionSettings: getExtensionSettings(state, ext()),
  };
}

export default connect(mapStateToProps)(
  connectStyle(ext('VideoCallScreen'))(VideoCallScreen),
);

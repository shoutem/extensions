import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RtcEngine } from 'react-native-agora';
import autoBind from 'auto-bind';
import _ from 'lodash';
import { View, Screen } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from 'shoutem.navigation';
import { getUser, isAuthenticated } from 'shoutem.auth';
import { getExtensionSettings } from 'shoutem.application/redux';
import WaitingForPeerView from '../components/WaitingForPeerView';
import VideoCallView from '../components/VideoCallView';
import VideoCallStartingView from '../components/VideoCallStartingView';
import { checkPermissions, requestPermissions } from '../services/permissions';
import * as Agora from '../services/agora';
import { ext } from '../const';

class VideoCallScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBind(this);

    const { user, localUser } = props;
    const localUserId = parseInt(_.get(localUser, 'legacyId'));
    const channelName = Agora.resolveChannelName(localUser, user);

    this.state = {
      audioMute: false,
      frontCamera: true,
      connectionSuccess: false,
      peerIds: [],
      stopwatchStart: false,
      stopwatchReset: false,
      channelName,
      uid: localUserId,
      videoMute: false,
      remoteVideoMute: false,
      remoteAudioMute: false,
    };
  }

  componentDidMount() {
    // Requesting Mic and Camera permissions
    requestPermissions();

    // If new user has joined
    RtcEngine.on(Agora.EVENTS.REMOTE_USER_JOINED, (data) => {
      const { peerIds } = this.state;

      this.toggleStopwatch();
      if (peerIds.indexOf(data.uid) === -1) {
        this.setState({
          peerIds: [...peerIds, data.uid],
        });
      }
    });

    // If remote user leaves
    RtcEngine.on(Agora.EVENTS.REMOTE_USER_LEFT, (data) => {
      const { peerIds } = this.state;

      this.resetStopwatch();
      this.setState({
        peerIds: peerIds.filter((uid) => uid !== data.uid),
        videoMute: false,
        audioMute: false,
      });
    });

    // If Local user joins RTC channel
    RtcEngine.on(Agora.EVENTS.LOCAL_USER_JOINED_CHANNEL, (data) => {
      RtcEngine.startPreview();

      this.setState({
        connectionSuccess: true,
      });
    });

    // If Local user leaves RTC channel
    RtcEngine.on(Agora.EVENTS.LOCAL_USER_LEFT_CHANNEL, (data) => {
      this.resetStopwatch();
    });

    // If remote user changes video state
    RtcEngine.on(Agora.EVENTS.REMOTE_VIDEO_STATE_CHANGED, (data) => {
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
      .then(RtcEngine.enableAudio)
      .catch((error) => Agora.connectionFailedAlert());
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
    const { isUserAuthenticated } = this.props;

    if (!isUserAuthenticated) {
      return Agora.authFailedAlert();
    }

    checkPermissions()
      .then((permissionsGranted) => {
        if (permissionsGranted) {
          return this.startCall();
        }
      })
      .catch((error) => {
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
    } = this.state;

    const { user, style } = this.props;

    const profileImage = _.get(user, 'profile.image');
    const fullName =
      _.get(user, 'profile.name') || _.get(user, 'profile.nick', '');
    const waitingForPeer = connectionSuccess && peerIds.length === 0;
    const videoCallEstablished = connectionSuccess && peerIds.length === 1;

    return (
      <Screen>
        <View style={style.agoraScreenContainer}>
          <NavigationBar styleName="clear" />
          {!connectionSuccess && (
            <VideoCallStartingView
              fullName={fullName}
              image={profileImage}
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

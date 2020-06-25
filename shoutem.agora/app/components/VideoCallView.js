import React from 'react';
import PropTypes from 'prop-types';
import { AgoraView } from 'react-native-agora';
import { View, Text } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { Stopwatch } from 'react-native-stopwatch-timer';
import ControlButtonsView from './ControlButtonsView';
import ProfileImage from './ProfileImage';
import LocalVideoContainer from './LocalVideoContainer';
import { ext } from '../const';

function VideoCallView({
  audioMute,
  connectionSuccess,
  remoteVideoMute,
  stopwatchReset,
  stopwatchStart,
  onCameraSwitchPress,
  videoMute,
  fullName,
  image,
  remoteUserId,
  getFormattedTime,
  onAudioMutePress,
  onEndCallPress,
  onStartCallPress,
  onVideoMutePress,
  style,
}) {
  return (
    <View style={style.videoCallView}>
      {!remoteVideoMute && (
        <AgoraView
          mode={1}
          remoteUid={remoteUserId}
          style={style.videoCallView}
        />
      )}

      {remoteVideoMute && <ProfileImage image={image} />}

      {!videoMute && (
        <LocalVideoContainer onCameraSwitchPress={onCameraSwitchPress} />
      )}

      <View style={style.bottomContainer}>
        <Text style={style.peerName}>{fullName}</Text>

        <View>
          <Stopwatch
            getTime={getFormattedTime}
            laps
            options={style.stopwatch}
            reset={stopwatchReset}
            start={stopwatchStart}
          />
        </View>

        <ControlButtonsView
          audioMute={audioMute}
          connectionSuccess={connectionSuccess}
          disabled={false}
          onAudioMutePress={onAudioMutePress}
          onEndCallPress={onEndCallPress}
          onStartCallPress={onStartCallPress}
          onVideoMutePress={onVideoMutePress}
          videoMute={videoMute}
        />
      </View>
    </View>
  );
}

VideoCallView.propTypes = {
  audioMute: PropTypes.bool,
  remoteVideoMute: PropTypes.bool,
  fullName: PropTypes.string,
  image: PropTypes.string,
  getFormattedTime: PropTypes.func,
  onAudioMutePress: PropTypes.func,
  onEndCallPress: PropTypes.func,
  onStartCallPress: PropTypes.func,
  onVideoMutePress: PropTypes.func,
  connectionSuccess: PropTypes.bool,
  remoteUserId: PropTypes.number,
  stopwatchReset: PropTypes.bool,
  stopwatchStart: PropTypes.bool,
  onCameraSwitchPress: PropTypes.func,
  style: PropTypes.object,
  videoMute: PropTypes.bool,
};

export default connectStyle(ext('VideoCallView'))(VideoCallView);

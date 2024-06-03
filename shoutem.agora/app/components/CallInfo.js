import React, { useState } from 'react';
import { Stopwatch } from 'react-native-stopwatch-timer';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Text, View } from '@shoutem/ui';
import { ext } from '../const';
import { useCallInfoEvents } from '../hooks';

const CallInfo = ({ RtcEngine, remoteUser, style }) => {
  const [stopwatchStart, setStopwatchStart] = useState(false);
  const [stopwatchReset, setStopwatchReset] = useState(false);

  const [remoteAudioMuted, setRemoteAudioMuted] = useState(false);

  useCallInfoEvents({
    RtcEngine,
    remoteUser,
    setStopwatchStart,
    setStopwatchReset,
    setRemoteAudioMuted,
  });

  return (
    <View style={style.container}>
      {remoteAudioMuted && (
        <View style={style.remoteMutedContainer}>
          <Icon name="mic-off" style={style.remoteMutedIcon} />
        </View>
      )}
      <View>
        <Text style={style.remoteUserName}>{remoteUser.fullName}</Text>
      </View>
      <View style={style.stopwatchContainer}>
        {stopwatchStart && (
          <Stopwatch
            laps
            start={stopwatchStart}
            reset={stopwatchReset}
            options={style.stopwatch}
          />
        )}
      </View>
    </View>
  );
};

CallInfo.propTypes = {
  remoteUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    fullName: PropTypes.string,
  }).isRequired,
  RtcEngine: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    joinChannel: PropTypes.func.isRequired,
    leaveChannel: PropTypes.func.isRequired,
    muteLocalAudioStream: PropTypes.func.isRequired,
    muteLocalVideoStream: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
  }).isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('CallInfo'))(CallInfo);

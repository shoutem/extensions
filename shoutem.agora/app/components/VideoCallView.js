import React, { useCallback, useEffect, useState } from 'react';
import { RtcSurfaceView, VideoSourceType } from 'react-native-agora';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ext } from '../const';
import ProfileImage from './ProfileImage';

const VideoCallView = ({ RtcEngine, remoteUser, style }) => {
  const [remoteVideoMuted, setRemoteVideoMuted] = useState(false);

  const onUserMuteVideo = useCallback(
    (_connection, _remoteUid, muted) => setRemoteVideoMuted(muted),
    [],
  );

  useEffect(() => {
    // https://api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengineeventhandler.html#ariaid-title72
    RtcEngine.addListener('onUserMuteVideo', onUserMuteVideo);

    return () => {
      RtcEngine.removeListener('onUserMuteVideo', onUserMuteVideo);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // At the moment, we'll only be handling 2 scenarios - showing video if it's successfully decoding,
  // or showing user avatar if remote video is not streaming for any reason (stopped, starting, frozen, failed).

  return (
    <View style={style.container}>
      {remoteVideoMuted && <ProfileImage image={remoteUser.profileImage} />}
      {!remoteVideoMuted && (
        <RtcSurfaceView
          canvas={{
            uid: remoteUser.id,
            sourceType: VideoSourceType.VideoSourceRemote,
          }}
          style={style.container}
        />
      )}
    </View>
  );
};

VideoCallView.propTypes = {
  remoteUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    profileImage: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ uri: PropTypes.string }),
    ]),
  }).isRequired,
  RtcEngine: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
    switchCamera: PropTypes.func.isRequired,
  }).isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('VideoCallView'))(VideoCallView);

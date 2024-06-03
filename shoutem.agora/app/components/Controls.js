import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, View } from '@shoutem/ui';
import { isAuthenticated } from 'shoutem.auth';
import { ext } from '../const';
import * as Agora from '../services/agora';

const Controls = ({
  RtcEngine,
  localUser,
  remoteUser,
  connectionSuccess,
  localVideoMuted,
  onLocalVideoMuted,
  style,
}) => {
  const navigation = useNavigation();
  const isUserAuthenticated = useSelector(isAuthenticated);

  const [localAudioMuted, setLocalAudioMuted] = useState(false);

  const handleStartCallPress = useCallback(() => {
    if (!isUserAuthenticated || !localUser.id) {
      Agora.authFailedAlert();
      navigation.goBack();
      return;
    }

    // https://api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengine.html#ariaid-title80
    const result = RtcEngine.joinChannel(
      '',
      Agora.resolveChannelName(localUser, remoteUser),
      localUser.id,
    );

    // 0 = Successfully joined channel, < 0 = Failed to join channel.
    if (result !== 0) {
      // Go back in case engine wasn't properly initialized or channel wasn't properly released.
      // Opening this screen again will re-initialize RtcEngine.
      Agora.connectionFailedAlert(navigation.goBack);
      return;
    }

    if (localAudioMuted) {
      RtcEngine.muteLocalAudioStream(true);
    }
  }, [
    RtcEngine,
    isUserAuthenticated,
    localAudioMuted,
    localUser,
    navigation,
    remoteUser,
  ]);

  // https://api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengine.html#ariaid-title82
  const handleEndCallPress = useCallback(() => RtcEngine.leaveChannel(), [
    RtcEngine,
  ]);

  const handleAudioMutePress = useCallback(() => {
    // api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengine.html#ariaid-title86
    RtcEngine.muteLocalAudioStream(!localAudioMuted);
    setLocalAudioMuted(!localAudioMuted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localAudioMuted]);

  const handleVideoMutePress = useCallback(() => {
    // api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengine.html#ariaid-title87
    RtcEngine.muteLocalVideoStream(!localVideoMuted);

    onLocalVideoMuted(!localVideoMuted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localVideoMuted]);

  return (
    <View style={style.container}>
      <View style={style.controlButtonsContainer}>
        <Button
          onPress={handleVideoMutePress}
          style={style.videoButton}
          styleName="clear"
        >
          <Icon
            name={localVideoMuted ? 'video-cam-off' : 'video-cam'}
            style={[style.videoIcon, localVideoMuted && style.mutedIconColor]}
          />
        </Button>

        <Button
          onPress={
            connectionSuccess ? handleEndCallPress : handleStartCallPress
          }
          style={[
            style.callButton,
            connectionSuccess ? style.endCallButton : style.startCallButton,
          ]}
          styleName="clear tight"
        >
          <Icon
            name="hang-up"
            style={connectionSuccess ? style.endCallIcon : style.startCallIcon}
          />
        </Button>

        <Button
          onPress={handleAudioMutePress}
          style={style.audioButton}
          styleName="clear"
        >
          <Icon
            name={localAudioMuted ? 'mic-off' : 'mic'}
            style={[style.audioIcon, localAudioMuted && style.mutedIconColor]}
          />
        </Button>
      </View>
    </View>
  );
};

Controls.propTypes = {
  localUser: PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired,
  localVideoMuted: PropTypes.bool.isRequired,
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
  onLocalVideoMuted: PropTypes.func.isRequired,
  connectionSuccess: PropTypes.bool,
};

Controls.defaultProps = {
  connectionSuccess: false,
};

export default React.memo(connectStyle(ext('Controls'))(Controls));

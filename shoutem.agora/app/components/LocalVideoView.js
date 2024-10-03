import React, { useCallback, useMemo } from 'react';
import { RtcSurfaceView, VideoSourceType } from 'react-native-agora';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, View } from '@shoutem/ui';
import { isIos } from 'shoutem-core';
import { ext } from '../const';
import ProfileImage from './ProfileImage';

const LocalVideoView = ({ RtcEngine, localUser, localVideoMuted, style }) => {
  const insets = useSafeAreaInsets();

  const handleCameraSwitchPress = useCallback(
    // https://api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengine.html#ariaid-title220
    () => RtcEngine.switchCamera(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const safeAreaTop = useMemo(
    () => (isIos ? { marginTop: insets.top } : style.androidTopMargin),
    [insets.top, style.androidTopMargin],
  );

  return (
    <View style={[style.container, safeAreaTop]}>
      {localVideoMuted && (
        <View style={style.localVideo}>
          <ProfileImage
            image={localUser.profileImage}
            style={style.localProfileImage}
          />
        </View>
      )}
      {!localVideoMuted && (
        <RtcSurfaceView
          canvas={{ sourceType: VideoSourceType.VideoSourceCamera }}
          zOrderMediaOverlay
          style={style.localVideo}
        />
      )}

      <Button
        onPress={handleCameraSwitchPress}
        style={style.switchCameraButton}
        styleName="clear"
      >
        <Icon
          name="camSwitch"
          style={style.switchCameraIcon}
          styleName="clear"
        />
      </Button>
    </View>
  );
};

LocalVideoView.propTypes = {
  localUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    profileImage: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ uri: PropTypes.string }),
    ]),
  }).isRequired,
  localVideoMuted: PropTypes.bool.isRequired,
  RtcEngine: PropTypes.shape({
    switchCamera: PropTypes.func.isRequired,
  }).isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('LocalVideoView'))(LocalVideoView);

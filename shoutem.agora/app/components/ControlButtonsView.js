import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, View } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

function ControlButtonsView({
  audioMute,
  connectionSuccess,
  videoMute,
  disabled,
  onAudioMutePress,
  onEndCallPress,
  onStartCallPress,
  onVideoMutePress,
  style,
}) {
  return (
    <View style={style.controlButtonsContainer}>
      <Button
        disabled={disabled}
        onPress={onVideoMutePress}
        style={disabled ? style.buttonDisabled : style.videoButton}
        styleName="clear"
      >
        <Icon
          name={videoMute ? 'video-cam-off' : 'video-cam'}
          style={disabled ? style.iconDisabled : style.videoIcon}
        />
      </Button>

      <Button
        onPress={connectionSuccess ? onEndCallPress : onStartCallPress}
        style={connectionSuccess ? style.endCall : style.startCall}
        styleName="clear"
      >
        <Icon name="hang-up" />
      </Button>

      <Button
        disabled={disabled}
        onPress={onAudioMutePress}
        style={disabled ? style.buttonDisabled : style.audioButton}
        styleName="clear"
      >
        <Icon
          name={audioMute ? 'mic-off' : 'mic'}
          style={disabled ? style.iconDisabled : style.audioIcon}
        />
      </Button>
    </View>
  );
}

ControlButtonsView.propTypes = {
  audioMute: PropTypes.bool,
  connectionSuccess: PropTypes.bool,
  videoMute: PropTypes.bool,
  disabled: PropTypes.bool,
  onAudioMutePress: PropTypes.func,
  onEndCallPress: PropTypes.func,
  onStartCallPress: PropTypes.func,
  onVideoMutePress: PropTypes.func,
  style: PropTypes.object,
};

export default connectStyle(ext('ControlButtonsView'))(ControlButtonsView);

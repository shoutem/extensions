import React from 'react';
import PropTypes from 'prop-types';
import { AgoraView } from 'react-native-agora';
import { View, Button, Icon } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

function LocalVideoContainer({ onCameraSwitchPress, style }) {
  return (
    <View style={style.localVideoContainer}>
      <AgoraView
        mode={1}
        showLocalVideo
        style={style.localVideo}
        zOrderMediaOverlay
      />

      <Button
        onPress={onCameraSwitchPress}
        style={style.switchCameraButton}
        styleName="clear"
      >
        <Icon
          name="cam-switch"
          style={style.switchCameraIcon}
          styleName="clear"
        />
      </Button>
    </View>
  );
}

LocalVideoContainer.propTypes = {
  onCameraSwitchPress: PropTypes.func,
  style: PropTypes.object,
};

export default connectStyle(ext('LocalVideoContainer'))(LocalVideoContainer);

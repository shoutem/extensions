import React from 'react';
import { RtcSurfaceView, VideoSourceType } from 'react-native-agora';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const WaitingForRemoteUserView = ({
  localVideoMuted,
  localUser,
  remoteUser,
  style,
}) => {
  const message = `${I18n.t(ext('waitingToJoinFirstPart'))} ${
    remoteUser.fullName
  } ${I18n.t(ext('waitingToJoinSecondPart'))}`;

  return (
    <View style={style.container}>
      {localVideoMuted && <View style={style.localVideo} />}

      {!localVideoMuted && (
        <RtcSurfaceView
          canvas={{
            uid: localUser.id,
            sourceType: VideoSourceType.VideoSourceCamera,
          }}
          style={style.localVideo}
          zOrderMediaOverlay
        />
      )}
      <View style={style.message}>
        <Text>{message}</Text>
      </View>
    </View>
  );
};

WaitingForRemoteUserView.propTypes = {
  localUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  localVideoMuted: PropTypes.bool.isRequired,
  remoteUser: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('WaitingForRemoteUserView'))(
  WaitingForRemoteUserView,
);

import React from 'react';
import PropTypes from 'prop-types';
import { AgoraView } from 'react-native-agora';
import { Text, View } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';
import ControlButtonsView from './ControlButtonsView';
import { ext } from '../const';

function WaitingForPeerView({
  videoMute,
  fullName,
  onEndCallPress,
  onVideoMutePress,
  style,
}) {
  const message = `${I18n.t(
    ext('waitingToJoinFirstPart'),
  )} ${fullName} ${I18n.t(ext('waitingToJoinSecondPart'))}`;

  return (
    <View style={style.waitingForPeerView}>
      {!videoMute && (
        <AgoraView
          mode={1}
          showLocalVideo
          style={style.localVideo}
          zOrderMediaOverlay
        />
      )}

      <View style={style.message}>
        <Text>{message}</Text>
      </View>

      <View style={style.bottomContainer}>
        <Text style={style.peerName}>{fullName}</Text>

        <ControlButtonsView
          connectionSuccess
          disabled
          onEndCallPress={onEndCallPress}
          onVideoMutePress={onVideoMutePress}
        />
      </View>
    </View>
  );
}

WaitingForPeerView.propTypes = {
  videoMute: PropTypes.bool,
  fullName: PropTypes.string,
  onEndCallPress: PropTypes.func,
  onVideoMutePress: PropTypes.func,
  style: PropTypes.object,
};

export default connectStyle(ext('WaitingForPeerView'))(WaitingForPeerView);

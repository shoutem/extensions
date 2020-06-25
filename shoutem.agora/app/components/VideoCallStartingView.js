import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import ControlButtonsView from './ControlButtonsView';
import ProfileImage from './ProfileImage';
import { ext } from '../const';

function VideoCallStartingView({ fullName, onStartCallPress, style, image }) {
  return (
    <View style={style.videoCallStartingView}>
      <ProfileImage image={image} />

      <View style={style.bottomContainer}>
        <Text style={style.peerName}>{fullName}</Text>

        <ControlButtonsView
          connectionSuccess={false}
          disabled
          onStartCallPress={onStartCallPress}
        />
      </View>
    </View>
  );
}

VideoCallStartingView.propTypes = {
  fullName: PropTypes.string,
  image: PropTypes.string,
  onStartCallPress: PropTypes.func,
  style: PropTypes.object,
};

export default connectStyle(ext('VideoCallStartingView'))(
  VideoCallStartingView,
);

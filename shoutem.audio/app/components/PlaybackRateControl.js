import React, { useState } from 'react';
import TrackPlayer from 'react-native-track-player';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, TouchableOpacity } from '@shoutem/ui';
import { ext } from '../const';
import PlaybackSettingsModal from './PlaybackSettingsModal';

const PlaybackRateControl = ({ style }) => {
  // Showing / hiding modal logic will eventually be moved to PlaybackSettings component, once
  // we implement more playback settings options.
  const [playbackSettingsModalShown, setPlaybackSettingsModalShown] = useState(
    false,
  );

  const handlePlaybackRateSelect = playbackRate => {
    TrackPlayer.setRate(playbackRate);
    setPlaybackSettingsModalShown(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setPlaybackSettingsModalShown(true)}
        style={style.container}
      >
        <Icon name="speed-meter" style={style.icon} />
      </TouchableOpacity>
      <PlaybackSettingsModal
        isVisible={playbackSettingsModalShown}
        onClose={() => setPlaybackSettingsModalShown(false)}
        onPlaybackRateSelect={handlePlaybackRateSelect}
      />
    </>
  );
};

PlaybackRateControl.propTypes = {
  style: PropTypes.object,
};

PlaybackRateControl.defaultProps = {
  style: {},
};

export default connectStyle(ext('PlaybackRateControl'))(PlaybackRateControl);

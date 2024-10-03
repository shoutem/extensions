import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, TouchableOpacity } from '@shoutem/ui';
import { ext } from '../../const';
import { HIT_SLOP } from './const';
import SettingsModal from './SettingsModal';

/**
 * A button component that opens an audio settings modal with a bottom action sheet interface when pressed.
 * The modal currently supports settings for playback speed and sleep timer.
 */
const PlaybackSettings = ({ onAudioModalClose, style }) => {
  const [playbackSettingsModalShown, setPlaybackSettingsModalShown] = useState(
    false,
  );

  return (
    <>
      <TouchableOpacity
        onPress={() => setPlaybackSettingsModalShown(true)}
        hitSlop={HIT_SLOP}
      >
        <Icon name="settings" style={style.icon} />
      </TouchableOpacity>
      <SettingsModal
        isVisible={playbackSettingsModalShown}
        onClose={() => setPlaybackSettingsModalShown(false)}
        onAudioModalClose={onAudioModalClose}
      />
    </>
  );
};

PlaybackSettings.propTypes = {
  style: PropTypes.object.isRequired,
  onAudioModalClose: PropTypes.func.isRequired,
};

export default connectStyle(ext('PlaybackSettings'))(PlaybackSettings);

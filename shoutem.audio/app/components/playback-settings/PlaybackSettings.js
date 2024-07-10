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
const PlaybackSettings = ({ style }) => {
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
      />
    </>
  );
};

PlaybackSettings.propTypes = {
  style: PropTypes.object,
};

PlaybackSettings.defaultProps = {
  style: {},
};

export default connectStyle(ext('PlaybackSettings'))(PlaybackSettings);

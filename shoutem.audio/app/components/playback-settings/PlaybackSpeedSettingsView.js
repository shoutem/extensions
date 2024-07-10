import React, { useEffect, useState } from 'react';
import TrackPlayer from 'react-native-track-player';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import { PLAYBACK_SPEEDS } from './const';
import PlaybackSpeedOption from './PlaybackSpeedOption';

/**
 * Retrieves the current playback speed from TrackPlayer on mount and provides options
 * for different playback speeds defined in the PLAYBACK_SPEEDS constant. Users can select
 * a speed, which updates the playback speed and closes the audio settings modal after a short delay,
 * allowing users to see selected option for better UX.
 */
const PlaybackSpeedSettingsView = ({ onClose }) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    TrackPlayer.getRate().then(setPlaybackSpeed);
  }, []);

  const handlePlaybackSpeedSelect = async rate => {
    setPlaybackSpeed(rate);

    await TrackPlayer.setRate(rate);

    onClose();
  };

  return (
    <>
      {_.map(PLAYBACK_SPEEDS, (rate, index) => (
        <PlaybackSpeedOption
          key={rate}
          text={I18n.t(
            ext(`playbackSpeedOption${rate.toString().replace('.', '')}`),
          )}
          value={rate}
          selected={playbackSpeed === rate}
          onPress={() => handlePlaybackSpeedSelect(rate)}
          showDivider={index + 1 < PLAYBACK_SPEEDS.length}
        />
      ))}
    </>
  );
};

PlaybackSpeedSettingsView.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default PlaybackSpeedSettingsView;

import React, { useMemo } from 'react';
import { useActiveTrack } from 'react-native-track-player';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import { SETTINGS_VIEW } from './const';
import SettingsOption from './SettingsOption';

/**
 * Renders audio settings UI. Currently sleep timer and playback speed (for non-live stream tracks)
 * are supported.
 */
const AllSettingsView = ({ onPress }) => {
  const activeTrack = useActiveTrack();

  const isLiveStream = useMemo(() => activeTrack?.isLiveStream, [
    activeTrack?.isLiveStream,
  ]);

  const showSleepTimerOptions = () => onPress(SETTINGS_VIEW.SLEEP_TIMER);
  const showPlaybackSpeedOptions = () => onPress(SETTINGS_VIEW.PLAYBACK_SPEED);

  return (
    <>
      {!isLiveStream && (
        <SettingsOption
          iconName="speed-meter"
          text={I18n.t(ext('playbackSpeedTitle'))}
          onPress={showPlaybackSpeedOptions}
        />
      )}
      <SettingsOption
        iconName="sleep"
        text={I18n.t(ext('sleepTimerSettingsTitle'))}
        onPress={showSleepTimerOptions}
      />
    </>
  );
};

AllSettingsView.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default AllSettingsView;

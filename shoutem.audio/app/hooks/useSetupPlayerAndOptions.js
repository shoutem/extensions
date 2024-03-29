import { useEffect } from 'react';
import { State } from 'react-native-track-player';
import { SetupService } from '../services';
import { useTrackState } from './useTrackState';

export const useSetupPlayerAndOptions = ({ track, updateOptions }) => {
  const {
    isActive,
    playing,
    playback: { state },
  } = useTrackState({ track });
  // NOTE: A one-time warning occurs due to late player setup, indicating the player may not be set up
  // in time to fetch player data (e.g. from hooks). This is intentional to ensure a safe player setup.
  // For details, see SetupService.register annotation.
  useEffect(() => {
    SetupService.register();
  }, []);

  // Options are set after play is initiated and player is ready to accommodate multiple sources (radio, podcast).
  // Pressing play serves as the definitive trigger to update the active player, along with its options and capabilities.
  // Executing this process earlier could lead to a scenario where radio is playing, yet Podcast remote controls are shown,
  // that radio can't utilize (e.g., jump forward/back). This occurs simply because the Podcast screen was opened but
  // play wasn't initiated.
  useEffect(() => {
    if (updateOptions && state === State.Ready && isActive) {
      SetupService.updateOptions(updateOptions);
    }
  }, [state, isActive, updateOptions]);

  // Sometimes, we want to update options after all track data is resolved - after play.
  // Currently, we're calculating progress update event interval based on track duration, which
  // is impossible before track is loaded and duration is fetched.
  useEffect(() => {
    if (updateOptions && playing && isActive) {
      SetupService.updateOptions(updateOptions);
    }
  }, [playing, isActive, updateOptions]);
};

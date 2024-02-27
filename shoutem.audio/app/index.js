/* eslint-disable simple-import-sort/exports */
import TrackPlayer from 'react-native-track-player';
import { extractFlattenedNamedExports } from 'shoutem-core';
import enTranslations from './translations/en.json';

// Constants `screens` (from extension.js) and `reducer` (from index.js)
// are exported via named export
// It is important to use those exact names

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

// Each extension should have PlaybackService exported from its index.js
// This will collect all exported PlaybackServices and register them as
// a single PlaybackService handler, which executes one by one PlaybackService.
export const appWillMount = async app => {
  const extensions = app.getExtensions();

  const collectedPlaybackServices = await extractFlattenedNamedExports(
    extensions,
    'PlaybackService',
  );

  const PlaybackService = async () =>
    collectedPlaybackServices.forEach(async playbackService =>
      playbackService(app.store.dispatch),
    );

  await TrackPlayer.registerPlaybackService(() => PlaybackService);
};

export { reducer } from './redux';
export * from './redux/actions';
export * from './redux/selectors';

export * from './hooks';
export * from './services';
export * from './components';

export { STOP_PLAYBACK_TYPE } from './const';

export {
  default as TrackPlayer,
  useIsPlaying,
  useActiveTrack,
  usePlaybackState,
  usePlayWhenReady,
  useProgress,
  useTrackPlayerEvents,
  useNowPlayingMetadata,
  Capability,
  State,
  Event,
} from 'react-native-track-player';

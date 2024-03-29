import React from 'react';
/* eslint-disable simple-import-sort/exports */
import TrackPlayer from 'react-native-track-player';
import { isTabBarNavigation, TabBarRenderer } from 'shoutem.navigation';
import {
  after,
  before,
  extractFlattenedNamedExports,
  priorities,
  setPriority,
} from 'shoutem-core';
import TabBar from './fragments/TabBar';
import enTranslations from './translations/en.json';
import { AudioBannerRenderer } from './fragments';

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

export const appWillMount = setPriority(async app => {
  // Register custom TabBar that renders audio player banner above tabs.
  TabBarRenderer.registerRenderer(TabBar);

  // Each extension should have PlaybackService exported from its index.js
  // This will collect all exported PlaybackServices and register them as
  // a single PlaybackService handler, which executes one by one PlaybackService.
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
}, before(priorities.NAVIGATION));

export * from './redux';
export * from './hooks';
export * from './services';
export * from './components';
export * from './fragments';
export * from './assets';

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

// Audio banner renderer for NON-tab navigation
// Tab nav has its banner render logic defined in ./fragments/TabBar.js
export const render = setPriority(app => {
  const store = app.getStore();
  const state = store.getState();

  if (isTabBarNavigation(state)) {
    return null;
  }

  return <AudioBannerRenderer />;
}, after(priorities.NAVIGATION));

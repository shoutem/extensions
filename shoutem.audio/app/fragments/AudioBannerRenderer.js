import React from 'react';
import { useAudioPlayerBanner } from '../hooks';
import AudioPlayerBanner from './AudioPlayerBanner';

const AudioBannerRenderer = () => {
  const { isShown } = useAudioPlayerBanner();

  if (!isShown) {
    return null;
  }

  return <AudioPlayerBanner />;
};

export default AudioBannerRenderer;

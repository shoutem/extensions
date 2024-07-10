import React from 'react';
import { useAudioBanner } from '../hooks';
import AudioBanner from './AudioBanner';

const AudioBannerRenderer = () => {
  const { isShown } = useAudioBanner();

  if (!isShown) {
    return null;
  }

  return <AudioBanner />;
};

export default AudioBannerRenderer;

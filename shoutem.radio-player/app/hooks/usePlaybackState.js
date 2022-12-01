import { useState } from 'react';
import {
  STATE_BUFFERING, // 6 buffering
  STATE_CONNECTING, // 8 connecting
  STATE_NONE, // 0 idle
  STATE_PAUSED, // 2 paused
  STATE_PLAYING, // 3 playing
  STATE_READY, // undefined ready
  STATE_STOPPED, // 1 idle
} from 'shoutem.audio';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export function resolveStatusText(playbackState) {
  switch (playbackState) {
    case STATE_BUFFERING:
    case STATE_READY:
    case STATE_CONNECTING:
      return I18n.t(ext('buffering'));
    case STATE_PLAYING:
      return I18n.t(ext('nowPlaying'));
    case STATE_NONE:
    case STATE_STOPPED:
    case STATE_PAUSED:
      return I18n.t(ext('pressToPlay'));
    default:
      return I18n.t(ext('buffering'));
  }
}

export function usePlaybackState() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackText, setPlaybackText] = useState(
    resolveStatusText(STATE_STOPPED),
  );

  function setPlaybackState(playbackState) {
    setPlaybackText(resolveStatusText(playbackState));
    setIsPlaying(playbackState === STATE_PLAYING);
  }

  return {
    isPlaying,
    playbackText,
    setPlaybackState,
  };
}

import {
  State,
  useActiveTrack,
  useNowPlayingMetadata,
  usePlaybackState,
} from 'shoutem.audio';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const resolvePlaybackStateText = (playbackState, isActiveStream) => {
  if (!isActiveStream) {
    return I18n.t(ext('pressToPlay'));
  }

  switch (playbackState) {
    case State.None:
    case State.Buffering:
    case State.Loading:
      return I18n.t(ext('buffering'));
    case State.Playing:
      return I18n.t(ext('nowPlaying'));
    case State.Ended:
    case State.Paused:
    case State.Stopped:
    case State.Error:
    case State.Ready:
      return I18n.t(ext('pressToPlay'));
    default:
      return I18n.t(ext('buffering'));
  }
};

/**
 * Custom hook for radio-related information.
 *  * @param {string} streamUrl - URL of the radio stream.
 * ---
 * @returns {object} An object containing radio related information, such as state and metadata.
 * @property {boolean} isActiveStream - Indicating whether this stream is currently playing.
 * @property {string} playbackStateText - String representing current playback state.
 * @property {object} nowPlayingMetadata - Artist, title and artwork of current song on radio stream.
 */
export const useRadioFeatures = streamUrl => {
  const playback = usePlaybackState();
  const activeTrack = useActiveTrack();
  const nowPlayingMetadata = useNowPlayingMetadata();

  const isActiveStream =
    playback.state === State.Playing && activeTrack?.url === streamUrl;

  const playbackStateText = resolvePlaybackStateText(
    playback.state,
    isActiveStream,
  );

  return {
    isActiveStream,
    playbackStateText,
    nowPlayingMetadata,
  };
};

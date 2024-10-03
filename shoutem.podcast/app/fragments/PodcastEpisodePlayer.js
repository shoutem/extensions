import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { TouchableOpacity } from '@shoutem/ui';
import { getActiveSource, PlaybackControl } from 'shoutem.audio';
import { AUDIO_SOURCE_TYPE } from 'shoutem.audio/const';
import { ext } from '../const';
import { usePodcastEpisodePlayer } from '../hooks/usePodcastEpisodePlayer';
import { getDownloadedEpisodes } from '../redux';
import { mapEpisodeToTrack } from '../services';

/**
 * Fragment rendering UI & managining playback of a single podcast episode.
 */
const PodcastEpisodePlayer = ({
  episode,
  feedUrl,
  defaultArtwork,
  title,
  style,
}) => {
  const downloadedEpisodes = useSelector(getDownloadedEpisodes);
  const activeSource = useSelector(getActiveSource);

  const track = mapEpisodeToTrack(
    episode,
    feedUrl,
    defaultArtwork,
    downloadedEpisodes,
  );

  const {
    isActiveAndPlaying,
    isLoadingOrBuffering,
    onPlaybackButtonPress,
  } = usePodcastEpisodePlayer({ track, title });

  if (!track.url) {
    return null;
  }

  const resolvedIconName =
    activeSource?.type === AUDIO_SOURCE_TYPE.TRACK && isActiveAndPlaying
      ? 'pause'
      : 'play';

  return (
    <>
      <TouchableOpacity onPress={onPlaybackButtonPress} style={style.button}>
        <PlaybackControl
          onPress={onPlaybackButtonPress}
          isLoadingOrBuffering={isLoadingOrBuffering}
          iconName={resolvedIconName}
          style={{ icon: style.icon }}
        />
      </TouchableOpacity>
    </>
  );
};

PodcastEpisodePlayer.propTypes = {
  episode: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  defaultArtwork: PropTypes.string,
  feedUrl: PropTypes.string,
  title: PropTypes.string,
};

PodcastEpisodePlayer.defaultProps = {
  defaultArtwork: null,
  feedUrl: undefined,
  title: '',
};

export default connectStyle(ext('PodcastEpisodePlayer'))(PodcastEpisodePlayer);

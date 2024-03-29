import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { TouchableOpacity } from '@shoutem/ui';
import { PlaybackControl } from 'shoutem.audio';
import { ext } from '../const';
import { usePodcastEpisodePlayer } from '../hooks/usePodcastEpisodePlayer';
import { getEpisodeTrack } from '../redux';

const PodcastEpisodePlayer = ({ episode, artwork, playlist, style }) => {
  const track = useSelector(state => getEpisodeTrack(state, episode, artwork));
  const {
    isActiveAndPlaying,
    isLoadingOrBuffering,
    onPlaybackButtonPress,
  } = usePodcastEpisodePlayer({ track, playlist });

  if (!track.url) {
    return null;
  }

  return (
    <>
      <TouchableOpacity onPress={onPlaybackButtonPress} style={style.button}>
        <PlaybackControl
          onPress={onPlaybackButtonPress}
          isLoadingOrBuffering={isLoadingOrBuffering}
          iconName={isActiveAndPlaying ? 'pause' : 'play'}
          style={{ icon: style.icon }}
        />
      </TouchableOpacity>
    </>
  );
};

PodcastEpisodePlayer.propTypes = {
  episode: PropTypes.object.isRequired,
  playlist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
  artwork: PropTypes.string,
  style: PropTypes.object,
};

PodcastEpisodePlayer.defaultProps = {
  artwork: undefined,
  style: {},
};

export default connectStyle(ext('PodcastEpisodePlayer'))(PodcastEpisodePlayer);

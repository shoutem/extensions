import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getMeta } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { TouchableOpacity } from '@shoutem/ui';
import { getShortcut } from 'shoutem.application';
import { PlaybackControl } from 'shoutem.audio';
import { ext } from '../const';
import { usePodcastEpisodePlayer } from '../hooks';
import { getDownloadedEpisodes, getEpisodesFeed } from '../redux';
import { mapEpisodeToTrack } from '../services';

/**
 * Fragment rendering UI & managining playback of a single podcast episode.
 */
const PodcastEpisodePlayer = ({ shortcutId, episode, style }) => {
  const shortcut = useSelector(state => getShortcut(state, shortcutId));
  // Favorite episode details screen has these undefined values when going back to list screen, so it breaks
  // if we're not handling undefined values here.
  // When favs list screen is focused, we clear redux state and we end up with undefined values, before
  // data is updated from fetch response.
  const title = _.get(shortcut, 'title', '');
  const feedUrl = _.get(shortcut, 'settings.feedUrl');

  const episodesFeed = useSelector(state => getEpisodesFeed(state, feedUrl));
  const downloadedEpisodes = useSelector(getDownloadedEpisodes);
  const meta = getMeta(episodesFeed);

  const defaultArtwork = _.get(meta, 'imageUrl');

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

  return (
    <>
      <TouchableOpacity onPress={onPlaybackButtonPress} style={style.button}>
        <PlaybackControl
          onPress={onPlaybackButtonPress}
          isLoadingOrBuffering={isLoadingOrBuffering}
          iconName={isActiveAndPlaying ? 'pause' : 'play'}
          style={style.playbackControl}
        />
      </TouchableOpacity>
    </>
  );
};

PodcastEpisodePlayer.propTypes = {
  episode: PropTypes.object.isRequired,
  shortcutId: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('PodcastEpisodePlayer'))(PodcastEpisodePlayer);

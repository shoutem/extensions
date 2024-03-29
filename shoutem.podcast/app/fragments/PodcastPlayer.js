import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { TrackAudioControls, useTrackState } from 'shoutem.audio';
import { isTabBarNavigation } from 'shoutem.navigation';
import { ext } from '../const';
import { getEpisodeTrack } from '../redux';

const PodcastPlayer = ({ episode, feedArtwork, style }) => {
  const isTabNavigation = useSelector(isTabBarNavigation);

  const track = useSelector(state =>
    getEpisodeTrack(state, episode, feedArtwork),
  );

  const { isActive } = useTrackState({ track });

  return (
    <View
      style={style.container}
      styleName={`h-center md-gutter-bottom sm-gutter-top ${
        isTabNavigation ? '' : 'with-home-indicator-padding'
      } `}
    >
      <TrackAudioControls track={track} isProgressControlDisabled={!isActive} />
    </View>
  );
};

PodcastPlayer.propTypes = {
  episode: PropTypes.object.isRequired,
  feedArtwork: PropTypes.string,
  style: PropTypes.object,
};

PodcastPlayer.defaultProps = {
  feedArtwork: undefined,
  style: {},
};

export default connectStyle(ext('PodcastPlayer'))(PodcastPlayer);

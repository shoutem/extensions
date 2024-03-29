import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { getAudioTrackProgress, State, useTrackState } from 'shoutem.audio';
import { ProgressBar } from 'shoutem.audio/components';
import { ext, getEpisodeTrackId } from '../const';
import { getEpisodeTrack } from '../redux';
import PlaybackIcon from './PlaybackIcon';

const EpisodeProgress = ({ episode, style }) => {
  const track = useSelector(state => getEpisodeTrack(state, episode));

  const progressPercentage = useSelector(state =>
    getAudioTrackProgress(state, ext(), getEpisodeTrackId(episode.id)),
  );

  const { isActive, playing, playback } = useTrackState({ track });

  const showIcon = useMemo(
    () =>
      isActive &&
      progressPercentage.completionPercentage < 100 &&
      (playback.state === State.Playing || playback.state === State.Paused),
    [isActive, playback.state, progressPercentage.completionPercentage],
  );

  return (
    <View style={style.container}>
      <View style={style.iconContainer}>
        {showIcon && (
          <PlaybackIcon isPlaying={playing} style={style.playbackIcon} />
        )}
      </View>
      <ProgressBar
        percentage={progressPercentage.completionPercentage}
        style={style.progressBar}
      />
    </View>
  );
};

EpisodeProgress.propTypes = {
  episode: PropTypes.object.isRequired,
  style: PropTypes.object,
};

EpisodeProgress.defaultProps = {
  style: {},
};

export default connectStyle(ext('EpisodeProgress'))(EpisodeProgress);

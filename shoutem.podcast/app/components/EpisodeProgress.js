import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ext } from '../const';
import PlaybackIcon from './PlaybackIcon';
import ProgressBar from './ProgressBar';

/**
 * Renders the episode progress component.
 * Displays a playback icon and a progress bar for the episode.
 * @param {object} props - The component props.
 * @param {boolean} props.isPlaying - Indicates if the episode is currently playing.
 * @param {boolean} props.showPlaybackIcon - Indicates if the playback icon is shown. It should be if the episode is active track.
 * @param {number} props.progressCompleteBarMaxWidth - The width of the progress bar when complete.
 * @param {number} props.progressPercentage - The progress percentage of the episode.
 * @param {object} props.style - Custom styles to apply.
 * @returns {React.Element} - The rendered component.
 */
const EpisodeProgress = ({
  showPlaybackIcon,
  isPlaying,
  progressPercentage,
  style,
}) => {
  return (
    <View style={style.container}>
      {showPlaybackIcon && (
        <PlaybackIcon isPlaying={isPlaying} style={style.playbackIcon} />
      )}
      <ProgressBar percentage={progressPercentage} />
    </View>
  );
};

EpisodeProgress.propTypes = {
  isPlaying: PropTypes.bool,
  progressPercentage: PropTypes.number,
  showPlaybackIcon: PropTypes.bool,
  style: PropTypes.object,
};

EpisodeProgress.defaultProps = {
  isPlaying: false,
  progressPercentage: 0,
  showPlaybackIcon: false,
  style: {},
};

export default connectStyle(ext('EpisodeProgress'))(EpisodeProgress);

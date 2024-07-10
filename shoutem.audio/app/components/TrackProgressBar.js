import React from 'react';
import { useActiveTrack, useProgress } from 'react-native-track-player';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import ProgressBar from './ProgressBar';

/**
 * Displays a progress bar that indicates the playback progress of the active audio track.
 */
const TrackProgressBar = ({ style }) => {
  const progress = useProgress(1000);
  const activeTrack = useActiveTrack();

  if (activeTrack?.isLiveStream) {
    return null;
  }

  // We have to check if both are greater than 0 because we get NaN of we divide 0/0, or Infinity if progress is
  // resolved before duration.
  const progressPercentage =
    progress?.position > 0 && progress?.duration > 0
      ? (progress?.position / progress?.duration) * 100
      : 0;

  return <ProgressBar percentage={progressPercentage} style={style} />;
};

TrackProgressBar.propTypes = {
  style: PropTypes.object,
};

TrackProgressBar.defaultProps = {
  style: {},
};

export default connectStyle(ext('TrackProgressBar'))(TrackProgressBar);

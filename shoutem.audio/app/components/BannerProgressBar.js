import React, { useMemo } from 'react';
import { useActiveTrack, useProgress } from 'react-native-track-player';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { isTabBarNavigation } from 'shoutem.navigation';
import { ext } from '../const';
import ProgressBar from './ProgressBar';

const BannerProgressBar = ({ style }) => {
  const isBottomTabsNav = useSelector(isTabBarNavigation);

  const progress = useProgress(1000);
  const activeTrack = useActiveTrack();

  const containerBottomPosition = useMemo(
    () =>
      isBottomTabsNav
        ? style.containerBottom
        : style.containerBottomWithPadding,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (activeTrack?.isLiveStream) {
    return null;
  }

  // We have to check if both are greater than 0 because we get NaN of we divide 0/0, or Infinity if progress is
  // resolved before duration.
  const progressPercentage =
    progress?.position > 0 && progress?.duration > 0
      ? (progress?.position / progress?.duration) * 100
      : 0;

  return (
    <ProgressBar
      percentage={progressPercentage}
      style={{
        ...style,
        container: {
          ...style.container,
          ...containerBottomPosition,
        },
      }}
    />
  );
};

BannerProgressBar.propTypes = {
  style: PropTypes.object,
};

BannerProgressBar.defaultProps = {
  style: {},
};

export default connectStyle(ext('BannerProgressBar'))(BannerProgressBar);

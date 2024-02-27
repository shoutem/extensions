import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import { usePlaybackAnimation } from '../hooks';

const PlaybackAnimation = ({ shouldAnimate, isPlaying, isStopped, style }) => {
  const {
    appearAnimationMain,
    bubbleAnimationMain,
    calculateOuterCircleStyle,
  } = usePlaybackAnimation(
    shouldAnimate,
    isPlaying,
    isStopped,
    style.playbackMainCircle,
  );

  return (
    <>
      <Animated.View
        style={[
          style.playbackMainCircle,
          { opacity: appearAnimationMain },
          {
            transform: [
              { scale: Animated.add(appearAnimationMain, bubbleAnimationMain) },
              { perspective: 1000 },
            ],
          },
        ]}
      />
      <Animated.View style={calculateOuterCircleStyle(true)} />
      <Animated.View style={calculateOuterCircleStyle(false)} />
    </>
  );
};

PlaybackAnimation.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  isStopped: PropTypes.bool.isRequired,
  shouldAnimate: PropTypes.bool.isRequired,
  style: PropTypes.object,
};

PlaybackAnimation.defaultProps = {
  style: {},
};

export default connectStyle(ext('PlaybackAnimation'))(PlaybackAnimation);

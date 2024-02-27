import { useEffect, useState } from 'react';
import { Animated, useAnimatedValue } from 'react-native';
import _ from 'lodash';

const COMMON_BUBBLE_PARAMS = {
  duration: 200,
  useNativeDriver: true,
};

const COMMON_APPEAR_PARAMS = {
  duration: 500,
  useNativeDriver: true,
};

/**
 * Custom hook for managing the playback animation, providing animated values and styles
 * for visual effects during radio playback.
 *
 * @param {boolean} shouldAnimate - Boolean value indicating if animation should start or stop.
 * @param {boolean} isPlaying - Boolean value indicating if track is playing.
 * @param {boolean} isStopped - Boolean value indicating if track is paused or stopped.
 * @param {object} playbackMainCircleStyle - General style for circles during playback.
 * ---
 * @returns {object} An object containing animated values and style calculation function to execute animation accordingly.
 * @property {Animated.Value} appearAnimationMain - Animated value for the main appearance animation.
 * @property {Animated.Value} bubbleAnimationMain - Animated value for the main bubble animation.
 * @property {function} calculateOuterCircleStyle - Function to calculate the style for the outer circles based on if circle is leading or not.
 */
export const usePlaybackAnimation = (
  shouldAnimate,
  isPlaying,
  isStopped,
  playbackMainCircleStyle,
) => {
  const [appearAnimationActive, setAppearAnimationActive] = useState(false);

  const appearAnimationMain = useAnimatedValue(0);
  const appearAnimationOuter = useAnimatedValue(0);
  const bubbleAnimationMain = useAnimatedValue(0);
  const bubbleAnimationOuterA = useAnimatedValue(1);
  const bubbleAnimationOuterB = useAnimatedValue(1);

  const composeAppearAnimation = appear => {
    const endValue = appear ? 1 : 0;

    const animations = [
      Animated.spring(appearAnimationMain, {
        toValue: endValue,
        ...COMMON_APPEAR_PARAMS,
      }),
      Animated.timing(appearAnimationOuter, {
        toValue: endValue,
        ...COMMON_APPEAR_PARAMS,
      }),
    ];

    return Animated.sequence(appear ? animations : _.reverse(animations));
  };

  const composeBubbleAnimation = () => {
    return Animated.loop(
      Animated.stagger(150, [
        Animated.sequence([
          Animated.timing(bubbleAnimationOuterA, {
            toValue: 1.05,
            ...COMMON_BUBBLE_PARAMS,
          }),
          Animated.timing(bubbleAnimationOuterA, {
            toValue: 1,
            ...COMMON_BUBBLE_PARAMS,
          }),
        ]),
        Animated.sequence([
          Animated.timing(bubbleAnimationMain, {
            toValue: 0.05,
            ...COMMON_BUBBLE_PARAMS,
          }),
          Animated.timing(bubbleAnimationMain, {
            toValue: 0,
            ...COMMON_BUBBLE_PARAMS,
          }),
        ]),
        Animated.sequence([
          Animated.timing(bubbleAnimationOuterB, {
            toValue: 1.05,
            ...COMMON_BUBBLE_PARAMS,
          }),
          Animated.timing(bubbleAnimationOuterB, {
            toValue: 1,
            ...COMMON_BUBBLE_PARAMS,
          }),
        ]),
      ]),
    );
  };

  useEffect(() => {
    // Stop animations if another source started playing.
    if (!shouldAnimate) {
      appearAnimationMain.setValue(0);
      appearAnimationOuter.setValue(0);
      bubbleAnimationMain.setValue(0);
      bubbleAnimationOuterA.setValue(0);
      bubbleAnimationOuterB.setValue(0);
      return;
    }

    if (isPlaying || isStopped) {
      const resolvedAppearAnimation = composeAppearAnimation(!isStopped);
      const bubbleAnimation = composeBubbleAnimation();

      if (appearAnimationActive) {
        resolvedAppearAnimation.reset();
      }

      const callback = isStopped
        ? () => bubbleAnimation.reset()
        : () => bubbleAnimation.start();

      setAppearAnimationActive(true);

      resolvedAppearAnimation.start(() => {
        setAppearAnimationActive(false);
        callback();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAnimate, isPlaying, isStopped]);

  const calculateOuterCircleStyle = leadingCircle => {
    const bubbleAnimationValue = leadingCircle
      ? bubbleAnimationOuterA
      : bubbleAnimationOuterB;
    const translateOutputRange = leadingCircle ? [0, -10] : [0, 10];

    return [
      playbackMainCircleStyle,
      {
        opacity: appearAnimationOuter.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.35],
        }),
        transform: [
          { scale: bubbleAnimationValue },
          { perspective: 1000 },
          {
            translateX: appearAnimationOuter.interpolate({
              inputRange: [0, 1],
              outputRange: translateOutputRange,
            }),
          },
          {
            translateY: appearAnimationOuter.interpolate({
              inputRange: [0, 1],
              outputRange: translateOutputRange,
            }),
          },
        ],
      },
    ];
  };

  return {
    appearAnimationMain,
    bubbleAnimationMain,
    calculateOuterCircleStyle,
  };
};

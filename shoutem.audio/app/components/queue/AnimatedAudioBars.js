import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, View } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../../const';

/**
 * AnimatedAudioBars component renders a set of animated audio bars.
 * These bars animate continuously with random heights and durations to simulate audio level fluctuations.
 */
const AnimatedAudioBars = ({ numberOfBars, active, style }) => {
  const bars = useMemo(() => {
    return Array.from({ length: Math.min(numberOfBars, 6) }, () => ({
      animatedValue: new Animated.Value(0.3),
    }));
  }, [numberOfBars]);

  const getRandomHeight = () => Math.random() * 0.6 + 0.4; // 0.4 to 1
  const getRandomDuration = () => Math.random() * 50 + 100; // 100ms to 150ms

  // Animate each bar with a random target height and duration
  const animateIndividualBar = bar => {
    const { animatedValue } = bar;

    Animated.timing(animatedValue, {
      toValue: getRandomHeight(),
      duration: getRandomDuration(),
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => animateIndividualBar(bar)); // Recursive to keep animation going
  };

  useEffect(() => {
    if (active === false) {
      return;
    }

    bars.forEach(animateIndividualBar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bars, active]);

  const resolvedHeight = style.barSize.height ?? style.container.height ?? 0;

  const resolvedInterpolatedHeight = bar => {
    const { heightInterpolationConfig } = style.barSize;

    const outputRange = [
      (heightInterpolationConfig.outputRangeMultiplier[0] ?? 0.4) *
        resolvedHeight,
      (heightInterpolationConfig.outputRangeMultiplier[1] ?? 1) *
        resolvedHeight,
    ];

    return bar.animatedValue.interpolate({
      inputRange: heightInterpolationConfig.inputRangeValue,
      outputRange,
    });
  };

  return (
    <View style={[style.container, { height: resolvedHeight }]}>
      {bars.map((bar, index) => (
        <Animated.View
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          style={[
            {
              ...style.barSize,
              height: resolvedInterpolatedHeight(bar),
            },
            style.barColor,
          ]}
        />
      ))}
    </View>
  );
};

AnimatedAudioBars.propTypes = {
  style: PropTypes.object.isRequired,
  active: PropTypes.bool,
  numberOfBars: PropTypes.number,
};

AnimatedAudioBars.defaultProps = {
  numberOfBars: 3,
  active: undefined,
};

export default connectStyle(ext('AnimatedAudioBars'))(AnimatedAudioBars);

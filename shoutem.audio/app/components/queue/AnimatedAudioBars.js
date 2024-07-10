import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../../const';

/**
 * AnimatedAudioBars component renders a set of animated audio bars.
 * These bars animate continuously with random heights and durations to simulate audio level fluctuations.
 */
const AnimatedAudioBars = ({ style }) => {
  const bar1 = useRef(new Animated.Value(0.6)).current;
  const bar2 = useRef(new Animated.Value(0.4)).current;
  const bar3 = useRef(new Animated.Value(0.8)).current;

  const bars = useMemo(() => [bar1, bar2, bar3], [bar1, bar2, bar3]);

  useEffect(() => {
    const animateBar = bar => {
      Animated.timing(bar, {
        toValue: Math.random() * 0.6 + 0.4, // 0.4 - 1
        duration: Math.random() * 50 + 100, // 100ms - 150ms
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => animateBar(bar));
    };

    bars.forEach(animateBar);
  }, [bars]);

  return (
    <View style={style.container}>
      {bars.map((bar, index) => (
        <Animated.View
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          style={[
            style.bar,
            {
              height: bar.interpolate({
                inputRange: [0.4, 1],
                outputRange: ['40%', '100%'],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

AnimatedAudioBars.propTypes = {
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('AnimatedAudioBars'))(AnimatedAudioBars);

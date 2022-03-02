import React, { useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon } from '@shoutem/ui';
import { ext } from '../const';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export function Like({ onPress, statusLiked, style }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const [liked, setLiked] = useState(statusLiked);

  function finishAnimation() {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  function startAnimation(newLikeState) {
    if (newLikeState) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(finishAnimation);
    } else {
      Animated.timing(animatedValue, {
        toValue: -1,
        duration: 300,
        useNativeDriver: true,
      }).start(finishAnimation);
    }
  }

  function handleLikePress() {
    startAnimation(!liked);

    setLiked(liked => !liked);

    onPress();
  }

  const debouncedHandleLikePress = _.debounce(handleLikePress, 300);

  const resolvedIconStyle = useMemo(
    () => (statusLiked ? style.heartIconLiked : style.heartIcon),
    [statusLiked, style.heartIconLiked, style.heartIcon],
  );

  const animatedStyle = useMemo(
    () => ({
      ...resolvedIconStyle,
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0.5, 1, 1.5],
          }),
        },
      ],
    }),
    [animatedValue, resolvedIconStyle],
  );

  return (
    <AnimatedIcon
      name="like-heart"
      style={animatedStyle}
      onPress={debouncedHandleLikePress}
    />
  );
}

Like.propTypes = {
  statusLiked: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

Like.defaultProps = {
  style: {},
};

export default connectStyle(ext('Like'))(Like);

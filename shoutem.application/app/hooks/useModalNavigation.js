import { useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';
import _ from 'lodash';
import { usePreviousValue } from 'shoutem.application';

const TRANSLATE_DIRECTION = {
  FORWARD: 'FORWARD',
  BACK: 'BACK',
};

export const useModalNavigation = ({
  initialNavigationHistory = [],
  transitionDistance = 100,
  shouldAnimateForward = true,
  shouldAnimateBack = true,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const [navigationHistory, setNavigationHistory] = useState(
    initialNavigationHistory,
  );

  const prevNavigationHistory = usePreviousValue(
    navigationHistory,
    initialNavigationHistory,
  );

  const animateNavigation = useCallback(
    (direction, newHistory) => {
      if (
        (direction === TRANSLATE_DIRECTION.FORWARD && !shouldAnimateForward) ||
        (direction === TRANSLATE_DIRECTION.BACK && !shouldAnimateBack)
      ) {
        return;
      }

      const translateReset = Animated.timing(translateX, {
        toValue:
          direction === TRANSLATE_DIRECTION.FORWARD
            ? transitionDistance
            : -transitionDistance,
        duration: 0,
        useNativeDriver: true,
      });

      const opacityReset = Animated.timing(opacity, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      });

      const translateAnimation = Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      });

      const opacityAnimation = Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      });

      const resetAnimations = Animated.parallel([opacityReset, translateReset]);

      // Reset animations.
      resetAnimations.start(() => {
        // After opacity is set to 0, we can set new active view now.
        setNavigationHistory(newHistory);

        // Start the remaining animations.
        Animated.sequence([
          Animated.parallel([translateAnimation, opacityAnimation]),
        ]).start();
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      navigationHistory.length,
      prevNavigationHistory.length,
      shouldAnimateBack,
      shouldAnimateForward,
    ],
  );

  const navigateForward = activeView => {
    const newHistory = [...navigationHistory, activeView];

    animateNavigation(TRANSLATE_DIRECTION.FORWARD, newHistory);
  };

  const navigateBack = () => {
    const newHistory = [...navigationHistory];
    newHistory.pop();

    animateNavigation(TRANSLATE_DIRECTION.BACK, newHistory);
  };

  const goBackToHome = () =>
    animateNavigation(TRANSLATE_DIRECTION.BACK, initialNavigationHistory);

  return {
    translateX,
    opacity,
    currentRoute: _.last(navigationHistory),
    navigateBack,
    navigateForward,
    goBackToHome,
  };
};

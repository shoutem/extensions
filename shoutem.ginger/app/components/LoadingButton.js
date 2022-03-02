import React, { useMemo, useRef, useState } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { animations } from '../assets';
import { ext } from '../const';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function LoadingButton({
  disabled,
  label,
  loading,
  onPress,
  containerStyle,
  style,
  textStyle,
  withSuccessStates,
  iconName,
}) {
  const [localLoading, setLocalLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const animateProgress = useRef(new Animated.Value(0)).current;

  function handlePress() {
    if (!withSuccessStates) {
      onPress();
      return;
    }

    setLocalLoading(true);
    onPress()
      .then(() => {
        setIsSuccess(true);
      })
      .catch(e => {
        setIsError(true);
        throw e;
      })
      .finally(animateSuccessStatus);
  }

  function animateSuccessStatus() {
    setLocalLoading(false);

    Animated.timing(animateProgress, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(finishAnimation);
  }

  function finishAnimation() {
    Animated.timing(animateProgress, {
      toValue: 0,
      duration: 400,
      delay: 1500,
      useNativeDriver: false,
    }).start(() => {
      setIsError(false);
      setIsSuccess(false);
    });
  }

  // rewrite into separate component with styles in Rubicon
  const successContent = (
    <Animated.View
      style={[
        {
          opacity: animateProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
        style.buttonContent,
      ]}
    >
      <Icon name="button-success" style={style.buttonIcon} />
      <Text style={[style.buttonText, textStyle]}>
        {I18n.t(ext('loadingButtonSuccessTitle'))}
      </Text>
    </Animated.View>
  );

  const errorContent = (
    <Animated.View
      style={[
        {
          opacity: animateProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
        style.buttonContent,
      ]}
    >
      <Icon name="button-error" style={style.buttonIcon} />
      <Text style={[style.buttonText, textStyle]}>
        {I18n.t(ext('loadingButtonErrorTitle'))}
      </Text>
    </Animated.View>
  );

  const regularContent = (
    <Animated.View
      style={[
        {
          opacity: animateProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        },
        style.buttonContent,
      ]}
    >
      {iconName && <Icon name={iconName} style={style.buttonIcon} />}
      <Text style={[style.buttonText, textStyle]}>{label}</Text>
    </Animated.View>
  );

  const isLoading = useMemo(() => loading || localLoading, [
    loading,
    localLoading,
  ]);
  const isDisabled = useMemo(() => disabled || isLoading, [
    disabled,
    isLoading,
  ]);
  const showRegularContent = useMemo(
    () => !isLoading && !isError && !isSuccess,
    [isError, isLoading, isSuccess],
  );

  return (
    <AnimatedTouchable
      disabled={isDisabled}
      onPress={handlePress}
      activeOpacity={0.5}
      style={[
        style.button,
        style.buttonBackgroundAnimation(animateProgress, isError),
        containerStyle,
      ]}
    >
      {isLoading && (
        <LottieView
          source={animations.buttonLoading}
          colorFilters={style.animationFilters}
          autoPlay
          loop
        />
      )}
      {isError && errorContent}
      {isSuccess && successContent}
      {showRegularContent && regularContent}
    </AnimatedTouchable>
  );
}

LoadingButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  disabled: PropTypes.bool,
  iconName: PropTypes.string,
  label: PropTypes.string,
  loading: PropTypes.bool,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  withSuccessStates: PropTypes.bool,
};

LoadingButton.defaultProps = {
  label: '',
  containerStyle: {},
  loading: false,
  disabled: false,
  withSuccessStates: false,
  iconName: undefined,
  style: {},
  textStyle: {},
};

export default connectStyle(ext('LoadingButton'))(LoadingButton);

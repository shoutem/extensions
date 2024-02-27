import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import _ from 'lodash';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '@shoutem/ui';
import { buttonLoading } from '../../assets';
import { ext } from '../../const';

function Button(props) {
  const {
    title,
    onPress,
    disabled,
    buttonStyle,
    textStyle,
    secondary,
    style,
    wide,
    loading,
  } = props;

  const resolvedButtonStyle = useMemo(
    () => [
      style.button,
      secondary && style.secondaryButton,
      disabled && style.disabled,
      wide && style.wideButton,
      buttonStyle,
    ],
    [
      style.button,
      style.secondaryButton,
      style.disabled,
      style.wideButton,
      secondary,
      disabled,
      wide,
      buttonStyle,
    ],
  );

  const resolvedTextStyle = useMemo(
    () => [style.text, secondary && style.secondaryText, textStyle],
    [style.text, style.secondaryText, secondary, textStyle],
  );

  const resolvedTextContainerStyle = useMemo(
    () => [style.textContainer, textStyle],
    [style.textContainer, textStyle],
  );

  const animationFilters = useMemo(
    () =>
      secondary
        ? style.animationFiltersSecondary
        : style.animationFiltersPrimary,
    [secondary, style.animationFiltersPrimary, style.animationFiltersSecondary],
  );

  function handlePress() {
    if (_.isFunction(onPress)) {
      return onPress();
    }

    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={disabled || loading}
      style={resolvedButtonStyle}
      onPress={handlePress}
    >
      {loading && (
        <LottieView
          style={style.lottieContainer}
          source={buttonLoading}
          colorFilters={animationFilters}
          autoPlay
          loop
        />
      )}
      {!loading && (
        <View style={resolvedTextContainerStyle}>
          <Text style={resolvedTextStyle}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  secondary: PropTypes.bool,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  wide: PropTypes.bool,
};

Button.defaultProps = {
  buttonStyle: {},
  disabled: false,
  textStyle: {},
  style: {},
  secondary: false,
  wide: false,
  loading: false,
};

export default React.memo(connectStyle(ext('Button'))(Button));

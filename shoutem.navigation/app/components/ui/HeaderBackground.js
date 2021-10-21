import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { Animated, StyleSheet, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { LinearGradient } from '@shoutem/ui';

const AnimatedImageBackground = Animated.createAnimatedComponent(
  ImageBackground,
);

export default function HeaderBackground({ style, settings, alwaysShow }) {
  // If device has a notch, use withNotchBackgroundImage.
  // If it is empty, default to 135px height image - backgroundImage.
  const backgroundImage = DeviceInfo.hasNotch()
    ? settings.withNotchBackgroundImage || settings.backgroundImage
    : settings.backgroundImage;
  const hasBackground = !_.isEmpty(backgroundImage);
  const hasGradient = !!_.get(style, 'gradient');

  if (!style && !hasBackground) {
    return null;
  }

  const gradient = _.get(style, 'gradient', {});
  const gradientProps = _.pick(gradient, ['colors', 'locations']);
  const gradientStyles = _.omit(gradient, ['colors', 'locations']);

  if (
    hasBackground &&
    (!settings.backgroundImageEnabledFirstScreen || alwaysShow)
  ) {
    const resizeMode = settings.fitContainer ? 'cover' : 'contain';

    return (
      <>
        <AnimatedImageBackground
          source={{ uri: backgroundImage }}
          style={[StyleSheet.absoluteFillObject, style, { zIndex: 5 }]}
          resizeMode={resizeMode}
        />
        {hasGradient && (
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              gradientStyles,
              { zIndex: 10 },
            ]}
          >
            <LinearGradient
              style={StyleSheet.absoluteFillObject}
              {...gradientProps}
            />
          </Animated.View>
        )}
      </>
    );
  }

  return (
    <>
      <Animated.View
        style={[StyleSheet.absoluteFillObject, style, { zIndex: 5 }]}
      />
      {hasGradient && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            gradientStyles,
            { zIndex: 10 },
          ]}
        >
          <LinearGradient
            style={StyleSheet.absoluteFillObject}
            {...gradientProps}
          />
        </Animated.View>
      )}
    </>
  );
}

HeaderBackground.propTypes = {
  style: PropTypes.any,
  settings: PropTypes.shape({
    backgroundImage: PropTypes.string,
    backgroundImageEnabledFirstScreen: PropTypes.bool,
    fitContainer: PropTypes.bool,
    showTitle: PropTypes.bool,
  }),
  alwaysShow: PropTypes.bool,
};

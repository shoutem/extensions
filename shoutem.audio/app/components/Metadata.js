import React from 'react';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { AnimatedScrollingText, Icon, View } from '@shoutem/ui';
import { State } from 'shoutem.audio';
import { useLayoutAnimation } from 'shoutem.layouts';
import { isAndroid } from 'shoutem-core';
import { ext } from '../const';
import { AnimatedAudioBars } from './queue';

/**
 * Displays track metadata, including artwork, title, and subtitle, with smooth layout
 * transitions and animated scrolling text for long titles and subtitles.
 */
export const Metadata = ({
  artworkUri,
  title,
  subtitle,
  playbackState,
  visualComponent,
  style,
}) => {
  // Android sometimes messes up title and/or subtitle text color in audio banner - it looks like it has 10% opacity.
  // After disabling layout animation, it is fixed, text is rendered as expected.
  const animationDeps = isAndroid
    ? []
    : [artworkUri, title, subtitle, playbackState];

  useLayoutAnimation(animationDeps);

  const renderVisualComponent = () => {
    if (visualComponent === 'artwork' && artworkUri) {
      // Render artwork when available, otherwise we'll default to music note.
      return <FastImage source={{ uri: artworkUri }} style={style.artwork} />;
    }

    if (visualComponent === 'audioBars' && playbackState === State.Playing) {
      return (
        <AnimatedAudioBars
          numberOfBars={5}
          animationActive={!!subtitle}
          style={{
            container: style.audioBarsContainer,
            barColor: style.audioBarColor,
            barSize: style.audioBarsSize,
          }}
        />
      );
    }

    return <Icon name="music-note" style={style.placeholder} />;
  };

  return (
    <View style={style.container}>
      <View style={style.artworkContainer}>{renderVisualComponent()}</View>
      <View style={style.trackInfoContainer}>
        <AnimatedScrollingText
          style={{
            text: style.title,
            scrollContainer: style.titleMaxHeight,
            scrollContentContainer: style.titleMaxHeight,
            textContainer: style.textContainer,
          }}
          text={title}
        />
        {!!subtitle && (
          <AnimatedScrollingText
            style={{
              text: style.subtitle,
              scrollContainer: style.subtitleMaxHeight,
              scrollContentContainer: style.subtitleMaxHeight,
              textContainer: style.textContainer,
            }}
            text={subtitle}
          />
        )}
      </View>
    </View>
  );
};

Metadata.propTypes = {
  artworkUri: PropTypes.string,
  playbackState: PropTypes.string,
  style: PropTypes.object,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  visualComponent: PropTypes.oneOf(['artwork', 'placeholder', 'audioBars']),
};

Metadata.defaultProps = {
  artworkUri: '',
  playbackState: undefined,
  subtitle: '',
  title: '',
  style: {},
  visualComponent: 'artwork',
};

export default connectStyle(ext('Metadata'))(Metadata);

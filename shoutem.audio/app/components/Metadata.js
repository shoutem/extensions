import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { AnimatedScrollingText, Image, View } from '@shoutem/ui';
import { useLayoutAnimation } from 'shoutem.layouts';
import { images } from '../assets';
import { ext } from '../const';

export const Metadata = ({ artworkUri, title, subtitle, style }) => {
  const artworkSource = useMemo(
    () => (artworkUri ? { uri: artworkUri } : images.music),
    [artworkUri],
  );

  useLayoutAnimation([artworkUri, title, subtitle]);

  return (
    <View style={style.container}>
      <View style={style.artworkContainer}>
        <Image source={artworkSource} style={style.artwork} />
      </View>
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
        {subtitle && (
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
  style: PropTypes.object,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

Metadata.defaultProps = {
  artworkUri: '',
  subtitle: '',
  title: '',
  style: {},
};

export default connectStyle(ext('Metadata'))(Metadata);

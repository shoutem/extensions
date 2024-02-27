import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Text, View } from '@shoutem/ui';
import { ext } from '../const';

function StreamMetadata({
  artist,
  artwork,
  showArtwork,
  title,
  style,
  withOverlay,
}) {
  if (!artist && !title) {
    return null;
  }

  return (
    <View style={[style.songMetaContainer, withOverlay && style.withOverlay]}>
      {!!showArtwork && (
        <Image
          source={{ uri: artwork }}
          style={style.artworkStyle}
          styleName="small"
        />
      )}
      <View
        styleName="vertical center"
        style={[style.metaTextContainer, !showArtwork && style.alignSelfCenter]}
      >
        <Text numberOfLines={1} style={style.artistName}>
          {artist}
        </Text>
        <Text style={style.songName}>{title}</Text>
      </View>
    </View>
  );
}

StreamMetadata.propTypes = {
  artist: PropTypes.string,
  artwork: PropTypes.string,
  showArtwork: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string,
  withOverlay: PropTypes.bool,
};

StreamMetadata.defaultProps = {
  artist: null,
  artwork: null,
  showArtwork: false,
  title: null,
  style: {},
  withOverlay: false,
};

export default connectStyle(ext('StreamMetadata'))(StreamMetadata);

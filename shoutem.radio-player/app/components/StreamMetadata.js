import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Text, View } from '@shoutem/ui';
import { ext } from '../const';

function StreamMetadata({
  artist,
  artwork,
  showArtwork,
  songName,
  style,
  withOverlay,
}) {
  if (!artist && !songName) {
    return null;
  }

  return (
    <View style={[style.songMetaContainer, withOverlay && style.withOverlay]}>
      {!!showArtwork && (
        <Image source={artwork} style={style.artworkStyle} styleName="small" />
      )}
      <View
        styleName="vertical center"
        style={!showArtwork && style.alignSelfCenter}
      >
        <Text numberOfLines={1} style={style.artistName}>
          {artist}
        </Text>
        <Text style={style.songName}>{songName}</Text>
      </View>
    </View>
  );
}

StreamMetadata.propTypes = {
  artist: PropTypes.string,
  artwork: PropTypes.object,
  showArtwork: PropTypes.bool,
  songName: PropTypes.string,
  style: PropTypes.object,
  withOverlay: PropTypes.bool,
};

StreamMetadata.defaultProps = {
  artist: null,
  artwork: null,
  showArtwork: false,
  songName: null,
  style: {},
  withOverlay: false,
};

export default connectStyle(ext('StreamMetadata'))(StreamMetadata);

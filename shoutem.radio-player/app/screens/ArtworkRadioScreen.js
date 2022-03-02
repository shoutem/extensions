import React, { useEffect, useState } from 'react';
import { LayoutAnimation } from 'react-native';
import { useDispatch } from 'react-redux';
import slugify from '@sindresorhus/slugify';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  EmptyListImage,
  ImageBackground,
  Screen,
  ShareButton,
  Subtitle,
  Title,
  View,
} from '@shoutem/ui';
import {
  STATE_PLAYING, // 3 playing
  STATE_STOPPED, // 1 idle
} from 'shoutem.audio';
import { I18n } from 'shoutem.i18n';
import { composeNavigationStyles, getCurrentRoute } from 'shoutem.navigation';
import { images } from '../assets';
import RadioPlayer from '../components/RadioPlayer';
import { ext } from '../const';
import { setTrackMetadata } from '../redux';
import { getResizedImageSource, getTrackArtwork } from '../services';

const DEPRECATED_RADIO_EXTENSION_SHORTCUT = 'shoutem.radio.Radio';

export function ArtworkRadioScreen({ navigation, route, style }) {
  const { shortcut } = route.params;
  const {
    settings: { navbarTitle, streamTitle, streamUrl },
  } = shortcut;

  const dispatch = useDispatch();

  const [playbackState, setPlaybackState] = useState(STATE_STOPPED);
  const [artist, setArtist] = useState('');
  const [songName, setSongName] = useState('');
  const [artwork, setArtwork] = useState({ uri: '' });

  useEffect(() => {
    navigation.setOptions({
      ...composeNavigationStyles(['clear']),
      title: '',
    });
  }, [navigation, navbarTitle]);

  function handleUpdatePlaybackState(playbackState) {
    setPlaybackState(playbackState);
  }

  async function handleMetadataChange(metadata, manually = false) {
    const { artist = '', title = '' } = metadata;
    const { streamUrl } = route.params.shortcut.settings;

    if (manually) {
      LayoutAnimation.easeInEaseOut();
      return;
    }

    const artwork = await getTrackArtwork(title);
    // Resize so the image looks proper. iTunes always returns
    // image size inside image url
    const resizedArtwork = artwork?.replace('100x100', '500x500');

    const id = slugify(`${streamUrl}`);

    dispatch(
      setTrackMetadata(`radio-${id}`, {
        artist,
        songName: title,
        artwork: { uri: resizedArtwork },
      }),
    );

    setArtist(artist);
    setSongName(title);

    LayoutAnimation.easeInEaseOut();

    setArtwork({ uri: resizedArtwork });
  }

  function shouldResetPlayer() {
    const activeRoute = getCurrentRoute();

    if (activeRoute) {
      const isActiveShortcutRadio =
        activeRoute.name === ext('Radio') ||
        activeRoute.name === DEPRECATED_RADIO_EXTENSION_SHORTCUT;

      return isActiveShortcutRadio && route.key !== activeRoute.key;
    }

    return false;
  }

  if (!streamUrl) {
    return <EmptyListImage message={I18n.t(ext('missingStreamUrl'))} />;
  }

  const isPlaying = playbackState === STATE_PLAYING;
  const artworkImage = getResizedImageSource(artwork.uri);
  const resolvedImage = artworkImage || images.music;

  return (
    <Screen style={style.screen}>
      <ImageBackground
        source={resolvedImage}
        styleName="fill-parent"
        blurRadius={style.blurRadius}
      >
        <View styleName="fill-parent vertical h-center" style={style.overlay}>
          <View
            styleName="flexible vertical v-end"
            style={style.streamTitleContainer}
          >
            <Title style={style.streamTitle}>{streamTitle}</Title>
          </View>
          <ImageBackground
            source={resolvedImage}
            style={style.artworkContainer}
            imageStyle={style.artworkCircularImage}
          >
            <RadioPlayer
              onPlaybackStateChange={handleUpdatePlaybackState}
              onMetadataStateChange={handleMetadataChange}
              shouldResetPlayer={shouldResetPlayer()}
              title={streamTitle}
              url={streamUrl}
              style={style.radioPlayer}
            />
          </ImageBackground>
          <View styleName="flexible" style={style.nowPlayingContainer}>
            <View styleName="flexible">
              {isPlaying && (
                <View styleName="vertical v-center h-center">
                  <Title style={style.artistTitle} styleName="sm-gutter-bottom">
                    {artist}
                  </Title>
                  <Subtitle style={style.songNameTitle}>{songName}</Subtitle>
                </View>
              )}
            </View>
            <View styleName="flexible">
              <ShareButton
                message={I18n.t(ext('shareMessage'), { streamUrl })}
                styleName="clear"
                title={I18n.t(ext('shareTitle'), { streamTitle })}
                url={streamUrl}
                iconProps={style.shareIcon}
                style={style.shareButton}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </Screen>
  );
}

ArtworkRadioScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  style: PropTypes.object,
};

ArtworkRadioScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('ArtworkRadioScreen'))(ArtworkRadioScreen);

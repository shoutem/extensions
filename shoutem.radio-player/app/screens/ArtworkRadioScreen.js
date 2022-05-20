import React, { useEffect, useMemo, useState } from 'react';
import { LayoutAnimation, Platform, Share } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import slugify from '@sindresorhus/slugify';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  EmptyListImage,
  Icon,
  ImageBackground,
  Screen,
  Subtitle,
  Title,
  View,
} from '@shoutem/ui';
import {
  STATE_PLAYING, // 3 playing
  STATE_STOPPED, // 1 idle
} from 'shoutem.audio';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getCurrentRoute,
  isTabBarNavigation,
} from 'shoutem.navigation';
import { images } from '../assets';
import { RadioActionSheet, RadioPlayer } from '../components';
import { ext } from '../const';
import { useTimer } from '../hooks';
import { setTrackMetadata } from '../redux';
import { getResizedImageSource, getTrackArtwork } from '../services';

const DEPRECATED_RADIO_EXTENSION_SHORTCUT = 'shoutem.radio.Radio';

export function ArtworkRadioScreen({ navigation, route, style }) {
  const { shortcut } = route.params;
  const {
    settings: { navbarTitle, streamTitle, streamUrl },
  } = shortcut;

  const dispatch = useDispatch();

  const isTabBar = useSelector(isTabBarNavigation);

  const [clearTimer, startTimer, timeRemaining] = useTimer(60000);

  const [playbackState, setPlaybackState] = useState(STATE_STOPPED);
  const [artist, setArtist] = useState('');
  const [songName, setSongName] = useState('');
  const [artwork, setArtwork] = useState({ uri: '' });
  const [shouldSleep, setShouldSleep] = useState(false);
  const [shouldShowActionSheet, setShouldShowActionSheet] = useState(false);

  const isTimerActive = useMemo(() => timeRemaining && timeRemaining > 0, [
    timeRemaining,
  ]);
  const nowPlayingContainerStyle = useMemo(() => {
    return isTabBar
      ? style.nowPlayingContainer
      : style.nowPlayingContainerTabBar;
  }, [isTabBar, style.nowPlayingContainer, style.nowPlayingContainerTabBar]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setShouldSleep(true);
      clearTimer();
    }

    navigation.setOptions({
      ...composeNavigationStyles(['clear']),
      title: '',
    });
  }, [clearTimer, navigation, navbarTitle, timeRemaining]);

  function handleActionSheetDismiss() {
    setShouldShowActionSheet(false);
  }

  function handleSleep() {
    setShouldSleep(false);
  }

  function handleSleepTimerPress() {
    setShouldShowActionSheet(true);
  }

  function handleUpdatePlaybackState(playbackState) {
    setPlaybackState(playbackState);
  }

  async function handleMetadataChange(metadata, manually = false) {
    if (manually) {
      // We have to set full state again, because screen is unmounted in
      // non-tab layouts. RadioPlayer keeps playing in background and has all metadata
      // from when it was started
      const { artist, artwork: activeArtwork, songName } = metadata;

      setArtist(artist);
      setSongName(songName);
      setArtwork(activeArtwork);

      return;
    }

    const { artist = '', title = '' } = metadata;
    const { streamUrl } = route.params.shortcut.settings;

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

    setArtwork({ uri: resizedArtwork });

    LayoutAnimation.easeInEaseOut();

    setArtist(artist);
    setSongName(title);
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

  function shareStream() {
    const shareMessage = I18n.t(ext('shareMessage'), { streamUrl });

    Share.share({
      title: I18n.t(ext('shareTitle'), { streamTitle }),
      // URL property isn't supported on Android, so we are
      // including it as the message for now.
      message: Platform.OS === 'android' ? streamUrl : shareMessage,
      streamUrl,
    });
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
          <View style={style.streamTitleContainer}>
            <Title style={style.streamTitle}>{streamTitle}</Title>
          </View>
          <ImageBackground
            source={resolvedImage}
            style={style.artworkContainer}
            imageStyle={style.artworkCircularImage}
          >
            <RadioPlayer
              onMetadataStateChange={handleMetadataChange}
              onPlaybackStateChange={handleUpdatePlaybackState}
              onSleepTriggered={handleSleep}
              triggerSleep={shouldSleep}
              shouldResetPlayer={shouldResetPlayer()}
              title={streamTitle}
              url={streamUrl}
              style={style.radioPlayer}
            />
          </ImageBackground>
          <View style={nowPlayingContainerStyle}>
            {!!isPlaying && (
              <View styleName="vertical v-center h-center">
                <Title style={style.artistTitle} styleName="sm-gutter-bottom">
                  {artist}
                </Title>
                <Subtitle style={style.songNameTitle}>{songName}</Subtitle>
              </View>
            )}
          </View>
          <View style={style.smallActionRow} styleName="horizontal">
            <View style={style.smallActionContainerLeft}>
              {!!isTimerActive && (
                <Button onPress={handleSleepTimerPress} styleName="clear">
                  <Icon name="sleep" fill={style.sleepTimerActiveText.color} />
                  <Title style={style.sleepTimerActiveText}>
                    {I18n.t(ext('cancelSleepTimerArtworkLayout'), {
                      count: timeRemaining / 60000,
                    })}
                  </Title>
                </Button>
              )}
              {!isTimerActive && (
                <Button
                  onPress={handleSleepTimerPress}
                  disabled={!isPlaying}
                  styleName="clear tight"
                >
                  <Icon name="sleep" fill={style.smallActionIconFill} />
                  <Title style={style.smallActionText}>
                    {I18n.t(ext('sleepTimerLabel'))}
                  </Title>
                </Button>
              )}
            </View>
            <View style={style.smallActionContainerRight}>
              <Button onPress={shareStream} styleName="clear">
                <Icon name="share" fill={style.smallActionIconFill} />
                <Title style={style.smallActionText}>
                  {I18n.t(ext('shareButtonLabel'))}
                </Title>
              </Button>
            </View>
          </View>
        </View>
        <RadioActionSheet
          active={shouldShowActionSheet}
          canStartTimer={isPlaying}
          timeRemaining={timeRemaining}
          onClearPress={clearTimer}
          onDismiss={handleActionSheetDismiss}
          onSharePress={shareStream}
          onTimerSet={startTimer}
          showSharing={false}
        />
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

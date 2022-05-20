import React, { useCallback, useEffect, useState } from 'react';
import { LayoutAnimation, Platform, Share } from 'react-native';
import { useDispatch } from 'react-redux';
import slugify from '@sindresorhus/slugify';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  EmptyStateView,
  Icon,
  Image,
  ImageBackground,
  Overlay,
  Row,
  Screen,
  Text,
  Tile,
  View,
} from '@shoutem/ui';
import {
  STATE_BUFFERING, // 6 buffering
  STATE_CONNECTING, // 8 connecting
  STATE_NONE, // 0 idle
  STATE_PAUSED, // 2 paused
  STATE_PLAYING, // 3 playing
  STATE_READY, // undefined ready
  STATE_STOPPED, // 1 idle
} from 'shoutem.audio';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getCurrentRoute,
  getRouteParams,
} from 'shoutem.navigation';
import { images } from '../assets';
import { RadioActionSheet, RadioPlayer } from '../components';
import { ext } from '../const';
import { useTimer } from '../hooks';
import { setTrackMetadata } from '../redux';
import { getResizedImageSource, getTrackArtwork } from '../services';

function Radio(props) {
  const { navigation, route, style } = props;
  const { shortcut } = getRouteParams(props);
  const {
    settings: {
      backgroundImageUrl,
      showArtwork,
      showSharing,
      streamTitle,
      streamUrl,
      title = '',
    },
  } = shortcut;

  const dispatch = useDispatch();

  const [clearTimer, startTimer, timeRemaining] = useTimer(60000);

  const [actionSheetActive, setActionSheetActive] = useState(false);
  const [artist, setArtist] = useState('');
  const [artwork, setArtwork] = useState('');
  const [playbackState, setPlaybackState] = useState(STATE_STOPPED);
  const [shouldSleep, setShouldSleep] = useState(false);
  const [songName, setSongName] = useState('');

  const isPlaying = playbackState === STATE_PLAYING;
  const isTimerActive = timeRemaining && timeRemaining > 0;

  const renderHeaderRight = useCallback(() => {
    const { activeSleepIconFill, inactiveSleepIconFill } = style;
    const iconName = showSharing ? 'more-horizontal' : 'sleep';
    const iconFill =
      timeRemaining && !showSharing
        ? activeSleepIconFill
        : inactiveSleepIconFill;

    return (
      <Button
        disabled={!showSharing && !(isPlaying || isTimerActive)}
        onPress={() => setActionSheetActive(true)}
        styleName="tight clear"
      >
        <Icon name={iconName} fill={iconFill} />
      </Button>
    );
  }, [
    isPlaying,
    isTimerActive,
    setActionSheetActive,
    showSharing,
    style,
    timeRemaining,
  ]);

  useEffect(() => {
    navigation.setOptions({
      ...composeNavigationStyles(['clear']),
      headerRight: renderHeaderRight,
      title,
    });
  }, [navigation, renderHeaderRight, title]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setShouldSleep(true);
      clearTimer();
    }
  }, [clearTimer, timeRemaining]);

  function hideActionSheet() {
    setActionSheetActive(false);
  }

  function shareStream() {
    const {
      settings: { streamTitle, streamUrl },
    } = shortcut;

    const shareMessage = I18n.t(ext('shareMessage'), { streamUrl });

    Share.share({
      title: I18n.t(ext('shareTitle'), { streamTitle }),
      // URL property isn't supported on Android, so we are
      // including it as the message for now.
      message: Platform.OS === 'android' ? streamUrl : shareMessage,
      streamUrl,
    });
  }

  function handleSleep() {
    setShouldSleep(false);
  }

  async function handleMetadataChange(metadata, manually = false) {
    const { artist = '', title = '' } = metadata;

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

    const artwork = await getTrackArtwork(title);
    const resolvedImage = artwork ? { uri: artwork } : images.music;

    const updates = {
      artist,
      songName: title,
      artwork: resolvedImage,
    };

    const id = slugify(`${streamUrl}`);

    dispatch(setTrackMetadata(`radio-${id}`, updates));

    LayoutAnimation.easeInEaseOut();
    setArtist(artist);
    setSongName(title);
    setArtwork(resolvedImage);
  }

  function resolveStatusText() {
    const statusTexts = {
      [STATE_NONE]: I18n.t(ext('buffering')),
      [STATE_BUFFERING]: I18n.t(ext('buffering')),
      [STATE_READY]: I18n.t(ext('buffering')), // intermediate state
      [STATE_CONNECTING]: I18n.t(ext('buffering')),
      [STATE_PLAYING]: I18n.t(ext('nowPlaying')),
      [STATE_STOPPED]: I18n.t(ext('pressToPlay')),
      [STATE_PAUSED]: I18n.t(ext('pressToPlay')),
    };

    return statusTexts[playbackState] || I18n.t(ext('buffering'));
  }

  function shouldResetPlayer() {
    const activeRoute = getCurrentRoute();

    if (activeRoute) {
      const isActiveShortcutRadio = activeRoute.name === ext('Radio');
      return isActiveShortcutRadio && route.key !== activeRoute.key;
    }

    return false;
  }

  if (!streamUrl) {
    return <EmptyStateView message={I18n.t(ext('missingStreamUrl'))} />;
  }

  const statusText = resolveStatusText();
  const bgImage = getResizedImageSource(backgroundImageUrl);
  const artworkStyle = isPlaying ? {} : style.hiddenImage;

  return (
    <Screen>
      <ImageBackground source={bgImage} styleName="fill-parent">
        <Tile styleName="clear text-centric">
          <Overlay
            style={style.overlayStyle}
            styleName="fill-parent image-overlay"
          >
            <RadioPlayer
              onMetadataStateChange={handleMetadataChange}
              onPlaybackStateChange={setPlaybackState}
              onSleepTriggered={handleSleep}
              shouldResetPlayer={shouldResetPlayer()}
              triggerSleep={shouldSleep}
              title={streamTitle}
              url={streamUrl}
            />
          </Overlay>
        </Tile>
        <View style={style.nowPlaying} styleName="vertical h-center">
          <Text style={style.nowPlayingText}>{statusText}</Text>
          <Row style={style.clearRow}>
            {!!showArtwork && (
              <Image source={artwork} style={artworkStyle} styleName="small" />
            )}
            {isPlaying && (
              <View styleName="vertical">
                <Text style={style.artistName}>{artist}</Text>
                <Text style={style.songName}>{songName}</Text>
              </View>
            )}
          </Row>
        </View>
        <RadioActionSheet
          active={actionSheetActive}
          isPlaying={isPlaying}
          timeRemaining={isTimerActive ? timeRemaining : 0}
          onClearPress={clearTimer}
          onDismiss={hideActionSheet}
          onSharePress={shareStream}
          onTimerSet={startTimer}
          showSharing={showSharing}
        />
      </ImageBackground>
    </Screen>
  );
}

Radio.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  style: PropTypes.object,
};

Radio.defaultProps = {
  style: {},
};

export default connectStyle(ext('RadioPlayer'))(Radio);

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { LayoutAnimation, Platform, Share } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import slugify from '@sindresorhus/slugify';
import _ from 'lodash';
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
import { composeNavigationStyles, getCurrentRoute } from 'shoutem.navigation';
import { images } from '../assets';
import { RadioActionSheet, RadioPlayer } from '../components';
import { ext } from '../const';
import { useTimer } from '../hooks';
import { getRadioMetadata, setRadioMetadata } from '../redux';
import {
  getRadioProvider,
  getResizedImageSource,
  getTrackArtwork,
} from '../services';

function Radio({ navigation, route, style }) {
  const { shortcut } = route.params;
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

  const radioId = useMemo(() => slugify(`radio-${streamUrl}`), [streamUrl]);
  const currentRadio = useSelector(state => getRadioMetadata(state, radioId));

  const [clearTimer, startTimer, timeRemaining] = useTimer(60000);

  const [actionSheetActive, setActionSheetActive] = useState(false);
  const [artist, setArtist] = useState(currentRadio?.artist);
  const [songName, setSongName] = useState(currentRadio?.songName);
  const [artwork, setArtwork] = useState({ uri: currentRadio?.artwork?.uri });
  const [playbackState, setPlaybackState] = useState(STATE_STOPPED);
  const [shouldSleep, setShouldSleep] = useState(false);

  const isPlaying = playbackState === STATE_PLAYING;
  const isTimerActive = timeRemaining && timeRemaining > 0;

  const handleSleep = useCallback(() => setShouldSleep(false), []);
  const hideActionSheet = useCallback(() => setActionSheetActive(false), []);
  const setActionSheetVisible = useCallback(
    () => setActionSheetActive(true),
    [],
  );

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
        onPress={setActionSheetVisible}
        styleName="tight clear"
      >
        <Icon name={iconName} fill={iconFill} />
      </Button>
    );
  }, [
    isPlaying,
    isTimerActive,
    setActionSheetVisible,
    showSharing,
    style,
    timeRemaining,
  ]);

  useLayoutEffect(() => {
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

  useEffect(() => {
    const provider = getRadioProvider(streamUrl);

    dispatch(
      setRadioMetadata(radioId, {
        provider,
      }),
    );
  }, [dispatch, radioId, streamUrl]);

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

  async function handleMetadataChange(metadata, manually = false) {
    if (manually) {
      // We have to set state again, because screen is unmounted in
      // non-tab layouts. Metadata sometimes defaults to {},
      // so we read values from redux instead.
      const metadataSource = _.isEmpty(metadata) ? currentRadio : metadata;
      const { artist, artwork: activeArtwork, songName } = metadataSource;

      LayoutAnimation.easeInEaseOut();

      setArtist(artist);
      setSongName(songName);
      setArtwork(activeArtwork);

      return;
    }

    const { artist = '', title = '' } = metadata;
    const artwork = await getTrackArtwork(
      {
        artist,
        songName: title,
        streamUrl,
      },
      currentRadio.provider,
    );
    const resolvedImage = artwork ? { uri: artwork } : images.music;

    dispatch(
      setRadioMetadata(radioId, {
        artist,
        songName: title,
        artwork: resolvedImage,
      }),
    );

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
          <Overlay style={style.overlayStyle} styleName="image-overlay">
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
                <Text numberOfLines={1} style={style.artistName}>
                  {artist}
                </Text>
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

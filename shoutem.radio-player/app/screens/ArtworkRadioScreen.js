import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Platform, Share } from 'react-native';
import { useSelector } from 'react-redux';
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
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getCurrentRoute,
  isTabBarNavigation,
} from 'shoutem.navigation';
import { images } from '../assets';
import { RadioActionSheet } from '../components';
import { ext } from '../const';
import { RadioPlayer } from '../fragments';
import { useMetadata, usePlaybackState, useTimer } from '../hooks';

const DEPRECATED_RADIO_EXTENSION_SHORTCUT = 'shoutem.radio.Radio';

export function ArtworkRadioScreen({
  navigation,
  route,
  style,
  renderAdBanner,
}) {
  const { shortcut } = route.params;
  const {
    settings: { navbarTitle, showSharing, streamTitle, streamUrl },
  } = shortcut;

  const isTabBar = useSelector(isTabBarNavigation);

  const [clearTimer, startTimer, timeRemaining] = useTimer(60000);
  const { isPlaying, setPlaybackState } = usePlaybackState();
  const { artist, songName, artwork, handleMetadataChange } = useMetadata(
    streamUrl,
  );

  const [shouldSleep, setShouldSleep] = useState(false);
  const [shouldShowActionSheet, setShouldShowActionSheet] = useState(false);

  const isTimerActive = useMemo(() => !!timeRemaining && timeRemaining > 0, [
    timeRemaining,
  ]);
  const nowPlayingContainerStyle = useMemo(
    () =>
      isTabBar ? style.nowPlayingContainer : style.nowPlayingContainerTabBar,
    [isTabBar, style.nowPlayingContainer, style.nowPlayingContainerTabBar],
  );

  const handleSleep = useCallback(() => setShouldSleep(false), []);
  const handleActionSheetDismiss = useCallback(
    () => setShouldShowActionSheet(false),
    [],
  );
  const handleSleepTimerPress = useCallback(
    () => setShouldShowActionSheet(true),
    [],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      ...composeNavigationStyles(['clear']),
      title: '',
    });
  }, [navigation, navbarTitle]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setShouldSleep(true);
      clearTimer();
    }
  }, [clearTimer, streamUrl, timeRemaining]);

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

  const backgroundImage = artwork?.uri ? { uri: artwork?.uri } : images.music;
  const resolvedImage = isPlaying ? backgroundImage : images.music;

  return (
    <Screen style={style.screen}>
      <ImageBackground
        source={resolvedImage}
        styleName="fill-parent"
        blurRadius={style.blurRadius}
      >
        <View styleName="fill-parent vertical h-center" style={style.overlay}>
          {!!renderAdBanner && (
            <View style={style.adBannerContainer}>{renderAdBanner()}</View>
          )}
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
              onPlaybackStateChange={setPlaybackState}
              onSleepTriggered={handleSleep}
              triggerSleep={shouldSleep}
              shouldResetPlayer={shouldResetPlayer()}
              title={streamTitle}
              url={streamUrl}
              style={style.radioPlayer}
            />
          </ImageBackground>
          <View style={nowPlayingContainerStyle}>
            {isPlaying && (
              <View styleName="vertical v-center h-center">
                <Title
                  style={style.artistTitle}
                  styleName="sm-gutter-bottom"
                  numberOfLines={1}
                >
                  {artist}
                </Title>
                <Subtitle style={style.songNameTitle}>{songName}</Subtitle>
              </View>
            )}
          </View>
          <View style={style.smallActionRow} styleName="horizontal">
            <View style={style.smallActionContainerLeft}>
              {isTimerActive && (
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
            {showSharing && (
              <View style={style.smallActionContainerRight}>
                <Button onPress={shareStream} styleName="clear">
                  <Icon name="share" fill={style.smallActionIconFill} />
                  <Title style={style.smallActionText}>
                    {I18n.t(ext('shareButtonLabel'))}
                  </Title>
                </Button>
              </View>
            )}
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
  renderAdBanner: PropTypes.func,
  style: PropTypes.object,
};

ArtworkRadioScreen.defaultProps = {
  renderAdBanner: null,
  style: {},
};

export default connectStyle(ext('ArtworkRadioScreen'))(ArtworkRadioScreen);

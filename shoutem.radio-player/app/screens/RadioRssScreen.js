import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Share } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  EmptyStateView,
  ImageBackground,
  Overlay,
  Row,
  Screen,
  Text,
  Tile,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getCurrentRoute } from 'shoutem.navigation';
import { RadioActionSheet, StreamMetadata } from '../components';
import { ext } from '../const';
import { RadioPlayer, RssNewsFeed } from '../fragments';
import {
  useMetadata,
  usePlaybackState,
  useRadioNavigation,
  useTimer,
} from '../hooks';

function RadioRssScreen({ navigation, route, style, renderAdBanner }) {
  const { shortcut } = route.params;
  const {
    settings: {
      backgroundImageUrl,
      showArtwork,
      showSharing,
      streamTitle,
      streamUrl,
    },
  } = shortcut;

  const [clearTimer, startTimer, timeRemaining] = useTimer(60000);
  const { playbackText, isPlaying, setPlaybackState } = usePlaybackState();
  const { artist, songName, artwork, handleMetadataChange } = useMetadata(
    streamUrl,
  );

  const [actionSheetActive, setActionSheetActive] = useState(false);
  const [shouldSleep, setShouldSleep] = useState(false);

  const isTimerActive = timeRemaining && timeRemaining > 0;

  const handleSleep = useCallback(() => setShouldSleep(false), []);

  const hideActionSheet = useCallback(() => setActionSheetActive(false), []);

  useRadioNavigation({
    navigation,
    isPlaying,
    isTimerActive,
    showSharing,
    setActionSheetActive,
    style,
  });

  useEffect(() => {
    if (timeRemaining === 0) {
      setShouldSleep(true);
      clearTimer();
    }
  }, [clearTimer, timeRemaining]);

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

  return (
    <Screen>
      <ImageBackground
        source={{ uri: backgroundImageUrl }}
        styleName="fill-parent"
      >
        <Overlay style={style.overlayStyle} styleName="image-overlay">
          {!!renderAdBanner && (
            <View style={style.adBannerContainer}>{renderAdBanner()}</View>
          )}
          <Tile
            styleName="clear text-centric"
            style={style.radioPlayerContainer}
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
            <Text style={style.nowPlayingText}>{playbackText}</Text>
          </Tile>
          <View style={style.nowPlaying} styleName="vertical h-center">
            <Row style={style.clearRow}>
              {isPlaying && (
                <StreamMetadata
                  artist={artist}
                  artwork={artwork}
                  showArtwork={showArtwork}
                  songName={songName}
                  withOverlay
                />
              )}
            </Row>
            <RssNewsFeed shortcut={shortcut} />
          </View>
        </Overlay>
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

RadioRssScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  renderAdBanner: PropTypes.func,
  style: PropTypes.object,
};

RadioRssScreen.defaultProps = {
  renderAdBanner: null,
  style: {},
};

export default connectStyle(ext('RadioRssScreen'))(RadioRssScreen);

import React from 'react';
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
import { RadioActionSheet, StreamMetadata } from '../components';
import { ext } from '../const';
import { RadioPlayer, RssNewsFeed } from '../fragments';
import {
  useRadioActionSheet,
  useRadioFeatures,
  useRadioNavigation,
  useSleepTimer,
} from '../hooks';

const RadioRssScreen = ({ navigation, route, style, renderAdBanner }) => {
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

  const {
    nowPlayingMetadata,
    isActiveStream,
    playbackStateText,
  } = useRadioFeatures(streamUrl, streamTitle);

  useRadioNavigation({
    navigation,
    isActiveStream,
    isTimerActive,
    showSharing,
    setActionSheetActive: showActionSheet,
    style,
  });

  const {
    shouldSleep,
    isTimerActive,
    startTimer,
    clearTimer,
    timeRemaining,
    handleSleep,
  } = useSleepTimer();

  const {
    active: actionSheetActive,
    showActionSheet,
    hideActionSheet,
    shareStream,
  } = useRadioActionSheet(streamUrl, streamTitle);

  if (!streamUrl) {
    return <EmptyStateView message={I18n.t(ext('missingStreamUrl'))} />;
  }

  return (
    <Screen>
      <ImageBackground
        source={backgroundImageUrl ? { uri: backgroundImageUrl } : null} // Avoid source.uri empty string warnings
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
              url={streamUrl}
              onSleepTriggered={handleSleep}
              triggerSleep={shouldSleep}
            />
            <Text style={style.nowPlayingText}>{playbackStateText}</Text>
          </Tile>
          <View style={style.nowPlaying} styleName="vertical h-center">
            <Row style={style.clearRow}>
              {isActiveStream && (
                <StreamMetadata
                  artist={nowPlayingMetadata?.artist}
                  title={nowPlayingMetadata?.title}
                  artwork={nowPlayingMetadata?.artwork}
                  showArtwork={showArtwork}
                  withOverlay
                />
              )}
            </Row>
            <RssNewsFeed shortcut={shortcut} />
          </View>
        </Overlay>
        <RadioActionSheet
          active={actionSheetActive}
          isActiveStream={isActiveStream}
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
};

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

import React, { useCallback, useMemo } from 'react';
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
import { StreamMetadata } from '../components';
import { ext } from '../const';
import { RadioPlayer, RssNewsFeed } from '../fragments';
import { useRadioFeatures, useRadioNavigationHeader } from '../hooks';
import { shareStream } from '../services';

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

  const handleShareStream = useCallback(
    () => shareStream(streamUrl, streamTitle),
    [streamUrl, streamTitle],
  );

  useRadioNavigationHeader({
    navigation,
    showSharing,
    onSharePress: handleShareStream,
  });

  const liveStream = useMemo(
    () => ({
      url: streamUrl,
      name: shortcut.title,
    }),
    [shortcut.title, streamUrl],
  );

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
              liveStream={liveStream}
              title={shortcut.title}
              showArtwork={!!shortcut.settings.showArtwork}
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

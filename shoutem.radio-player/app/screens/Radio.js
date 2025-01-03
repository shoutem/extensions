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
import { RadioPlayer } from '../fragments';
import { useRadioFeatures, useRadioNavigationHeader } from '../hooks';
import { shareStream } from '../services';

const Radio = ({ navigation, route, style, renderAdBanner }) => {
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
        <Tile styleName="clear text-centric">
          <Overlay style={style.overlayStyle} styleName="image-overlay">
            {!!renderAdBanner && (
              <View style={style.adBannerContainer}>{renderAdBanner()}</View>
            )}
            <RadioPlayer
              liveStream={liveStream}
              title={shortcut.title}
              showArtwork={!!shortcut.settings.showArtwork}
            />
          </Overlay>
        </Tile>
        <View style={style.nowPlaying} styleName="vertical h-center">
          <Text style={style.nowPlayingText}>{playbackStateText}</Text>
          <Row style={style.clearRow}>
            {isActiveStream && (
              <StreamMetadata
                artist={nowPlayingMetadata?.artist}
                title={nowPlayingMetadata?.title}
                artwork={nowPlayingMetadata?.artwork}
                showArtwork={showArtwork}
              />
            )}
          </Row>
        </View>
      </ImageBackground>
    </Screen>
  );
};

Radio.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  renderAdBanner: PropTypes.func,
  style: PropTypes.object,
};

Radio.defaultProps = {
  renderAdBanner: null,
  style: {},
};

export default connectStyle(ext('RadioScreen'))(Radio);

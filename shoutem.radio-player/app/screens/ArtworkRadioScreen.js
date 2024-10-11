import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  EmptyListImage,
  ImageBackground,
  Screen,
  Subtitle,
  Title,
  View,
} from '@shoutem/ui';
import { images } from 'shoutem.audio';
import { I18n } from 'shoutem.i18n';
import { isTabBarNavigation } from 'shoutem.navigation';
import { ext } from '../const';
import { RadioPlayer } from '../fragments';
import { useRadioFeatures, useRadioNavigationHeader } from '../hooks';
import { shareStream } from '../services';

export function ArtworkRadioScreen({
  navigation,
  route,
  style,
  renderAdBanner,
}) {
  const { shortcut } = route.params;
  const {
    settings: { showSharing, streamTitle, streamUrl },
  } = shortcut;

  const isTabBar = useSelector(isTabBarNavigation);

  const handleShareStream = useCallback(
    () => shareStream(streamUrl, streamTitle),
    [streamUrl, streamTitle],
  );

  useRadioNavigationHeader({
    navigation,
    showSharing,
    onSharePress: handleShareStream,
  });

  const { nowPlayingMetadata, isActiveStream } = useRadioFeatures(streamUrl);

  const resolvedImage = useMemo(
    () =>
      isActiveStream && nowPlayingMetadata?.artwork
        ? { uri: nowPlayingMetadata.artwork }
        : images.music,
    [isActiveStream, nowPlayingMetadata?.artwork],
  );

  const nowPlayingContainerStyle = useMemo(
    () =>
      isTabBar ? style.nowPlayingContainer : style.nowPlayingContainerTabBar,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [style.nowPlayingContainer, style.nowPlayingContainerTabBar],
  );

  const liveStream = useMemo(
    () => ({
      url: streamUrl,
      name: shortcut.title,
    }),
    [shortcut.title, streamUrl],
  );

  if (!streamUrl) {
    return <EmptyListImage message={I18n.t(ext('missingStreamUrl'))} />;
  }

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
              liveStream={liveStream}
              title={shortcut.title}
              showArtwork={!!shortcut.settings.showArtwork}
              style={style.radioPlayer}
            />
          </ImageBackground>
          <View style={nowPlayingContainerStyle}>
            {isActiveStream && (
              <View styleName="vertical v-center h-center">
                <Title
                  style={style.artistTitle}
                  styleName="sm-gutter-bottom"
                  numberOfLines={1}
                >
                  {nowPlayingMetadata?.artist}
                </Title>
                <Subtitle style={style.songNameTitle}>
                  {nowPlayingMetadata?.title}
                </Subtitle>
              </View>
            )}
          </View>
        </View>
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

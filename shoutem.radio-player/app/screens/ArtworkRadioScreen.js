import React, { useLayoutEffect } from 'react';
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
  isTabBarNavigation,
} from 'shoutem.navigation';
import { images } from '../assets';
import { RadioActionSheet } from '../components';
import { ext } from '../const';
import { RadioPlayer } from '../fragments';
import { useRadioActionSheet, useRadioFeatures, useSleepTimer } from '../hooks';

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

  useLayoutEffect(() => {
    navigation.setOptions({
      ...composeNavigationStyles(['clear']),
      title: '',
    });
  }, [navigation, navbarTitle]);

  const { nowPlayingMetadata, isActiveStream } = useRadioFeatures(
    streamUrl,
    streamTitle,
  );

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
    return <EmptyListImage message={I18n.t(ext('missingStreamUrl'))} />;
  }

  const resolvedImage =
    isActiveStream && nowPlayingMetadata?.artwork
      ? { uri: nowPlayingMetadata.artwork }
      : images.music;

  const disabledOpacityStyle = !isActiveStream ? style.disabledOpacity : {};
  const nowPlayingContainerStyle = isTabBar
    ? style.nowPlayingContainer
    : style.nowPlayingContainerTabBar;

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
              url={streamUrl}
              onSleepTriggered={handleSleep}
              triggerSleep={shouldSleep}
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
          <View style={style.smallActionRow} styleName="horizontal">
            <View style={style.smallActionContainerLeft}>
              {isTimerActive && (
                <Button onPress={showActionSheet} styleName="clear">
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
                  onPress={showActionSheet}
                  disabled={!isActiveStream}
                  styleName="clear tight"
                >
                  <Icon
                    name="sleep"
                    fill={style.smallActionIconFill}
                    style={disabledOpacityStyle}
                  />
                  <Title style={[style.smallActionText, disabledOpacityStyle]}>
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
          active={actionSheetActive}
          isActiveStream={isActiveStream}
          timeRemaining={timeRemaining}
          onClearPress={clearTimer}
          onDismiss={hideActionSheet}
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

import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import {
  convertSecondsToTimeDisplay,
  JumpTimeControl,
  PlaybackControl,
  ProgressControl,
} from 'shoutem.audio';
import { isTabBarNavigation } from 'shoutem.navigation';
import { ext } from '../const';
import { usePodcastPlayerFeatures } from '../hooks';
import { updateDownloadedEpisode as updateDownloadedEpisodeAction } from '../redux';
import { Track } from '../services';

const PodcastPlayer = ({ downloadedEpisode, episode, url, artwork, style }) => {
  const dispatch = useDispatch();

  const updateDownloadedEpisode = dispatch(updateDownloadedEpisodeAction);

  const isTabNavigation = useSelector(isTabBarNavigation);

  const track = Track.create(
    url,
    episode,
    artwork,
    downloadedEpisode,
    updateDownloadedEpisode,
  );

  const {
    isActivePlayer,
    isActiveAndPlaying,
    isLoadingOrBuffering,
    position,
    duration,
    onPlaybackButtonPress,
    onSeekComplete,
  } = usePodcastPlayerFeatures({ track });

  const handleSliderValueChange = useCallback(
    async newPosition => onSeekComplete(newPosition * duration),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [duration],
  );

  const handleJumpTime = amount => {
    if (
      // Prevent jump forward when track has completed, to prevent auto-play after seek.
      amount > 0 &&
      convertSecondsToTimeDisplay(Math.floor(position)) ===
        convertSecondsToTimeDisplay(Math.floor(duration))
    ) {
      return;
    }

    onSeekComplete(position + amount);
  };

  const jumpTimeControlStyle = useMemo(
    () => (!isActivePlayer ? style.disabledJumpTimeIcon : {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isActivePlayer],
  );

  return (
    <View
      style={style.container}
      styleName={`h-center md-gutter-bottom sm-gutter-top ${
        isTabNavigation ? '' : 'with-home-indicator-padding'
      } `}
    >
      <ProgressControl
        currentValue={position}
        maxValue={duration}
        disabled={!isActivePlayer}
        onValueChange={handleSliderValueChange}
      />
      <View
        styleName="horizontal h-center v-center stretch"
        style={style.controls}
      >
        <JumpTimeControl
          iconName="replay-10"
          disabled={!isActivePlayer}
          onPress={() => handleJumpTime(-10)}
          style={jumpTimeControlStyle}
        />
        <View styleName="justify-center items-center md-gutter-horizontal">
          {isLoadingOrBuffering && (
            <View style={style.spinnerContainer}>
              <ActivityIndicator style={style.playbackIcon} />
            </View>
          )}
          {!isLoadingOrBuffering && (
            <PlaybackControl
              onPress={onPlaybackButtonPress}
              iconName={isActiveAndPlaying ? 'pause' : 'play'}
              style={style.playbackIcon}
            />
          )}
        </View>
        <JumpTimeControl
          iconName="forward-30"
          disabled={!isActivePlayer}
          onPress={() => handleJumpTime(30)}
          style={jumpTimeControlStyle}
        />
      </View>
    </View>
  );
};

PodcastPlayer.propTypes = {
  artwork: PropTypes.string.isRequired,
  episode: PropTypes.object.isRequired,
  downloadedEpisode: PropTypes.object,
  style: PropTypes.object,
  url: PropTypes.string,
};

PodcastPlayer.defaultProps = {
  downloadedEpisode: undefined,
  url: undefined,
  style: {},
};

export default connectStyle(ext('PodcastPlayer'))(PodcastPlayer);

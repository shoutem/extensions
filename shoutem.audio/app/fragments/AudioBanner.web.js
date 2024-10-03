import React, { useCallback, useMemo } from 'react';
import TrackPlayer from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, TouchableOpacity, View } from '@shoutem/ui';
import { isTabBarNavigation } from 'shoutem.navigation';
import { PlaybackControl } from '../components';
import Metadata from '../components/Metadata';
import TrackProgressBar from '../components/TrackProgressBar';
import { ext } from '../const';
import {
  useActiveMetadata,
  useAudioBanner,
  useAudioModal,
  useTrackPlayer,
  useTrackState,
} from '../hooks';
import { getActiveSource, updateActiveSource } from '../redux';
import AudioModal from './audio-modal/AudioModal';
import SleepTimer from './SleepTimer';

export const AudioBanner = ({ style }) => {
  const dispatch = useDispatch();

  const isBottomTabsNav = useSelector(isTabBarNavigation);
  const activeSource = useSelector(getActiveSource);

  const { isShown, dismiss } = useAudioBanner();
  const {
    show: showModal,
    dismiss: dismissModal,
    isShown: isModalShown,
  } = useAudioModal();

  const { activeMetadata, activeTrack } = useActiveMetadata();

  const { isActiveAndPlaying, isLoadingOrBuffering } = useTrackState({
    track: activeTrack,
  });

  const { onPlaybackButtonPress } = useTrackPlayer({ track: activeTrack });

  const handleClosePress = useCallback(async () => {
    if (isShown) {
      dismiss();
    }

    try {
      await TrackPlayer.updateNowPlayingMetadata({});
      dispatch(updateActiveSource(null));
    } catch (e) {
      if (e.code === 'no_current_item') {
        // Android throws Unhandled Promise Rejection when trying to clear metadata, when
        // there's no active track, iOS doesn't. We can ignore error, because if there is no active track,
        // everything is set as expected.
      }
    }

    await TrackPlayer.reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const iconName = useMemo(() => (isActiveAndPlaying ? 'pause' : 'play'), [
    isActiveAndPlaying,
  ]);

  const trackInformationText = useMemo(() => {
    const { artist, title } = activeMetadata ?? {};

    if (!artist && !title) {
      // We have to return null if both artist and title are not resolved, so that we know when to hide
      // track information text.
      return null;
    }

    const separator = artist && title ? ` \u00B7 ` : '';

    return `${artist}${separator}${title}`;
  }, [activeMetadata]);

  const trackProgressBarPosition = useMemo(
    () =>
      isBottomTabsNav
        ? style.progressBarBottom
        : style.progressBarBottomWithPadding,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <TouchableOpacity
        onPress={showModal}
        style={[
          style.playerContainer,
          !isBottomTabsNav && style.playerContainerWithPadding,
        ]}
      >
        <View styleName="flexible">
          <Metadata
            artworkUri={activeMetadata?.artwork}
            title={activeSource?.title}
            subtitle={trackInformationText}
          />
        </View>
        <View styleName="horizontal v-center sm-gutter-left">
          <PlaybackControl
            onPress={onPlaybackButtonPress}
            isLoadingOrBuffering={isLoadingOrBuffering}
            iconName={iconName}
            style={style.playbackControl}
          />
          <TouchableOpacity
            styleName="md-gutter-vertical sm-gutter-horizontal md-gutter-right"
            onPress={handleClosePress}
          >
            <Icon name="close" style={style.closeIcon} />
          </TouchableOpacity>
        </View>
        {!activeTrack?.isLiveStream && (
          <TrackProgressBar style={trackProgressBarPosition} />
        )}
        <SleepTimer />
      </TouchableOpacity>
      <AudioModal isVisible={isModalShown} onClose={dismissModal} />
    </>
  );
};

AudioBanner.propTypes = {
  style: PropTypes.object,
};

AudioBanner.defaultProps = {
  style: {},
};

export default connectStyle(ext('AudioBanner'))(AudioBanner);

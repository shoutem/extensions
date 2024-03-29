import React, { useCallback, useMemo, useState } from 'react';
import TrackPlayer, {
  useActiveTrack,
  useNowPlayingMetadata,
} from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, TouchableOpacity, View } from '@shoutem/ui';
import { isTabBarNavigation } from 'shoutem.navigation';
import BannerProgressBar from '../components/BannerProgressBar';
import Metadata from '../components/Metadata';
import PlaybackControl from '../components/PlaybackControl';
import { ext } from '../const';
import {
  useAudioPlayerBanner,
  usePlaybackBehavior,
  useTrackState,
} from '../hooks';
import { getActivePlaylistOrStream, setActivePlaylistOrStream } from '../redux';
import AudioPlayerModal from './AudioPlayerModal';

export const AudioPlayerBanner = ({ style }) => {
  const dispatch = useDispatch();

  const isBottomTabsNav = useSelector(isTabBarNavigation);
  const activePlaylistOrStream = useSelector(getActivePlaylistOrStream);

  const { isShown, dismiss } = useAudioPlayerBanner();

  const activeTrack = useActiveTrack();

  const { isActiveAndPlaying, isLoadingOrBuffering } = useTrackState({
    track: activeTrack,
  });
  const nowPlayingMetadata = useNowPlayingMetadata();
  const { onPlaybackButtonPress } = usePlaybackBehavior({ track: activeTrack });

  const [showModal, setShowModal] = useState(false);

  const handleClosePress = useCallback(async () => {
    if (isShown) {
      dismiss();
    }

    try {
      await TrackPlayer.updateNowPlayingMetadata({});
      dispatch(setActivePlaylistOrStream(null));
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
    const { artist, title } = nowPlayingMetadata ?? {};

    if (!artist && !title) {
      // We have to return null if both artist and title are not resolved, so that we know when to hide
      // track information text.
      return null;
    }

    const separator = artist && title ? ` \u00B7 ` : '';

    return `${artist}${separator}${title}`;
  }, [nowPlayingMetadata]);

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={[
          style.playerContainer,
          !isBottomTabsNav && style.playerContainerWithPadding,
        ]}
      >
        <View styleName="flexible">
          <Metadata
            artworkUri={nowPlayingMetadata?.artwork}
            title={activePlaylistOrStream?.title}
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
          <TouchableOpacity styleName="md-gutter" onPress={handleClosePress}>
            <Icon name="close" style={style.closeIcon} />
          </TouchableOpacity>
        </View>
        {!activeTrack?.isLiveStream && <BannerProgressBar />}
      </TouchableOpacity>
      <AudioPlayerModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

AudioPlayerBanner.propTypes = {
  style: PropTypes.object,
};

AudioPlayerBanner.defaultProps = {
  style: {},
};

export default connectStyle(ext('AudioPlayerBanner'))(AudioPlayerBanner);

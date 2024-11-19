import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  usePlayWhenReady,
} from 'react-native-track-player';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Divider, Title, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { useLayoutAnimation } from 'shoutem.layouts';
import { isIos } from 'shoutem-core';
import { ext } from '../../const';
import { getActiveSource } from '../../redux';
import TrackProgressBar from '../TrackProgressBar';
import QueueListItem from './QueueListItem';

/**
 * The NowPlayingHeader component displays the currently playing track's information.
 * It includes animated transitions for the track change, title, and queue position.
 * The header animates smoothly during track loading, with platform-specific handling.
 */
const NowPlayingHeader = ({ onPress, style }) => {
  const opacity = useRef(new Animated.Value(1)).current;

  const playlist = useSelector(getActiveSource);

  const [activeTrackIndex, setActiveTrackIndex] = useState(undefined);

  const playWhenReady = usePlayWhenReady();
  const playback = usePlaybackState();
  const activeTrack = useActiveTrack();
  const isPlaying = usePlayWhenReady();

  useEffect(() => {
    TrackPlayer.getActiveTrackIndex().then(setActiveTrackIndex);
  }, [activeTrack]);

  useEffect(() => {
    // Transition looks bad on Android because active track changes before we can set opacity to 0.
    if (!isIos) {
      return;
    }

    // Start fade animation if track is playing and next track starts loading.
    if (playWhenReady && playback.state === State.Loading) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playWhenReady, playback.state]);

  // For smoother height transition, which changes if track title is longer.
  useLayoutAnimation([activeTrack]);

  const queuePositionText = useMemo(
    () =>
      _.isUndefined(activeTrackIndex)
        ? ''
        : `${activeTrackIndex + 1}/${playlist?.trackCount}`,
    [activeTrackIndex, playlist?.trackCount],
  );

  return (
    <View styleName="stretch lg-gutter-top">
      <View styleName="horizontal v-center space-between md-gutter-bottom sm-gutter-horizontal">
        <Title style={style.listTitle}>{I18n.t(ext('nowPlayingTitle'))}</Title>
        <Animated.View style={{ opacity }}>
          <Caption style={style.queuePositionCaption}>
            {queuePositionText}
          </Caption>
        </Animated.View>
      </View>
      <Animated.View style={[{ opacity }, style.bottomMargin]}>
        <QueueListItem
          track={activeTrack}
          isNowPlayingItem
          activeTrack={activeTrack}
          isPlaying={isPlaying}
          onPress={onPress}
        />
        <TrackProgressBar style={style.progressBar} />
      </Animated.View>
      <Divider styleName="line sm-gutter-top" style={style.dividerShadow} />
    </View>
  );
};

NowPlayingHeader.propTypes = {
  style: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default connectStyle(ext('NowPlayingHeader'))(NowPlayingHeader);

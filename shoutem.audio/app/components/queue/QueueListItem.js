import React from 'react';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  Icon,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { ext } from '../../const';
import AnimatedAudioBars from './AnimatedAudioBars';

/**
 * Displays a track's artwork, title, and artist.
 * It highlights the currently playing track with animated audio bars.
 * Pressing this item will start playing respective track.
 */
const QueueListItem = ({
  track,
  index,
  onPress,
  isNowPlayingItem,
  activeTrack,
  isPlaying,
  style,
}) => {
  const handlePress = () => onPress(index);

  const isActiveTrack = activeTrack?.id === track?.id;
  const isActiveAndPlaying = isActiveTrack && isPlaying;

  // Render play icon if it's not active track. Pressing item will start playing that track.
  // Or, render pause icon if it's active track & paused.
  // If it's active track and playing, animated audio bars will be rendered instead of playback icon.
  const shouldShowPlaybackIcon =
    !isActiveTrack || (isActiveTrack && !isPlaying);
  const resolvedIcon = isActiveTrack ? 'pause' : 'play';

  return (
    <>
      <TouchableOpacity
        disabled={isActiveTrack}
        onPress={handlePress}
        // Fixes list scrolling inside modal.
        // https://github.com/react-native-modal/react-native-modal/issues/236
        onStartShouldSetResponder={() => true}
      >
        <View style={style.container}>
          <FastImage
            source={{ uri: track?.artwork, priority: 'low' }}
            style={style.image}
          />
          <View styleName="flexible md-gutter-left">
            <Text numberOfLines={2} style={style.title}>
              {track?.title}
            </Text>
            <Caption numberOfLines={1} style={style.artist}>
              {track?.artist}
            </Caption>
          </View>
          {isActiveAndPlaying && (
            <View styleName="sm-gutter-left">
              <AnimatedAudioBars />
            </View>
          )}
          {shouldShowPlaybackIcon && (
            <View
              style={[
                style.playbackButton,
                !isActiveTrack && style.playbackButtonBorder,
              ]}
            >
              <Icon name={resolvedIcon} style={style.playbackIcon} />
            </View>
          )}
        </View>
        {!isNowPlayingItem && (
          <View
            styleName="sm-gutter-top md-gutter-bottom"
            onStartShouldSetResponder={() => true}
          >
            <Divider styleName="line" />
          </View>
        )}
      </TouchableOpacity>
    </>
  );
};

QueueListItem.propTypes = {
  style: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  activeTrack: PropTypes.object,
  index: PropTypes.number,
  isNowPlayingItem: PropTypes.bool,
  isPlaying: PropTypes.bool,
  track: PropTypes.object,
};

QueueListItem.defaultProps = {
  activeTrack: null,
  index: 0,
  isNowPlayingItem: false,
  isPlaying: false,
  track: {},
};

export default connectStyle(ext('QueueListItem'))(QueueListItem);

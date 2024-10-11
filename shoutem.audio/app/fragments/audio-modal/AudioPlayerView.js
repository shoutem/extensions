import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { Metadata } from '../../components';
import { AUDIO_SOURCE_TYPE, ext } from '../../const';
import { useActiveMetadata } from '../../hooks';
import { getActiveSource } from '../../redux';
import LiveStreamAudioControls from '../LiveStreamAudioControls';
import TrackAudioControls from '../TrackAudioControls';

/**
 * Manages the user interface for audio playback within an application.
 * It dynamically renders controls based on the type of audio source (track/playlist or live stream)
 * currently active.
 */
const AudioPlayerView = ({ onQueuePress, style }) => {
  const activeSource = useSelector(getActiveSource);
  const { activeMetadata, activeTrack } = useActiveMetadata();

  return (
    <>
      <Metadata
        artworkUri={activeMetadata?.artwork}
        title={activeMetadata?.title}
        subtitle={activeMetadata?.artist}
        showArtwork={activeSource.showArtwork}
        visualComponent={activeSource.showArtwork ? 'artwork' : 'placeholder'}
        style={style.metadata}
      />
      <View styleName="vertical stretch">
        {activeSource.type === AUDIO_SOURCE_TYPE.LIVE_STREAM && (
          <LiveStreamAudioControls
            liveStream={activeTrack}
            style={style.controls}
          />
        )}
        {activeSource.type !== AUDIO_SOURCE_TYPE.LIVE_STREAM && (
          <TrackAudioControls
            track={activeTrack}
            onQueuePress={onQueuePress}
            style={style.controls}
          />
        )}
      </View>
    </>
  );
};

AudioPlayerView.propTypes = {
  style: PropTypes.object.isRequired,
  onQueuePress: PropTypes.func.isRequired,
};

AudioPlayerView.defaultProps = {};

export default connectStyle(ext('AudioPlayerView'))(AudioPlayerView);

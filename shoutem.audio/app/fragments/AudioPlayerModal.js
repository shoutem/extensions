import React, { useMemo } from 'react';
import Modal from 'react-native-modal';
import {
  useActiveTrack,
  useNowPlayingMetadata,
} from 'react-native-track-player';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Screen, Text, Title, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { LiveStreamAudioControls, TrackAudioControls } from '../components';
import Metadata from '../components/Metadata';
import { ext } from '../const';
import { getActivePlaylistOrStream } from '../redux/selectors';

const AudioPlayerModal = ({ isVisible, onClose, style }) => {
  const activeTrack = useActiveTrack();
  const nowPlayingMetadata = useNowPlayingMetadata();
  const activePlaylistOrStream = useSelector(getActivePlaylistOrStream);

  const isLiveStream = useMemo(() => activeTrack?.isLiveStream, [
    activeTrack?.isLiveStream,
  ]);

  return (
    <Modal
      isVisible={isVisible}
      swipeDirection={['down']}
      onSwipeComplete={onClose}
      style={style.modal}
    >
      <Screen style={style.screenContainer}>
        <View style={style.container}>
          <View styleName="horizontal stretch h-center">
            <TouchableOpacity onPress={onClose} style={style.closeModalButton}>
              <Icon name="down-arrow" style={style.closeModalIcon} />
            </TouchableOpacity>
            <View styleName="vertical">
              <Title
                styleName="bold h-center"
                style={style.title}
                numberOfLines={2}
              >
                {activePlaylistOrStream?.title}
              </Title>
              {isLiveStream && (
                <Text styleName="lg-gutter-bottom" style={style.liveStreamText}>
                  {I18n.t(ext('liveStreamText'))}
                </Text>
              )}
            </View>
          </View>
          <Metadata
            artworkUri={nowPlayingMetadata?.artwork}
            title={nowPlayingMetadata?.title}
            subtitle={nowPlayingMetadata?.artist}
            style={style.metadata}
          />
          <View styleName="vertical stretch">
            {isLiveStream && (
              <LiveStreamAudioControls
                liveStream={activeTrack}
                style={style.controls}
              />
            )}
            {!isLiveStream && (
              <TrackAudioControls track={activeTrack} style={style.controls} />
            )}
          </View>
        </View>
      </Screen>
    </Modal>
  );
};

AudioPlayerModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool,
  style: PropTypes.object,
};

AudioPlayerModal.defaultProps = {
  isVisible: false,
  style: {},
};

export default connectStyle(ext('AudioPlayerModal'))(AudioPlayerModal);

import React from 'react';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import PlaybackRateSettings from './PlaybackRateSettings';

// Using more generic name because we will eventually have more playback settings added.
const PlaybackSettingsModal = ({ isVisible, onClose, style }) => (
  <Modal
    isVisible={isVisible}
    swipeDirection={['down']}
    onSwipeComplete={onClose}
    onBackdropPress={onClose}
    style={style.modal}
  >
    <PlaybackRateSettings onPlaybackRateSelect={onClose} />
  </Modal>
);

PlaybackSettingsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connectStyle(ext('PlaybackSettingsModal'))(
  PlaybackSettingsModal,
);

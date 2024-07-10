import React from 'react';
import { Animated } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';
import { useModalNavigation } from 'shoutem.application';
import { Header } from '../../components';
import { ext } from '../../const';
import AudioPlayerView from './AudioPlayerView';
import { AUDIO_MODAL_VIEW } from './const';
import QueueView from './QueueView';

/**
 * Modal UI container for various active audio information. Implements useModalNavigation, hook
 * that manages mini-navigation inside modal, with animated transitions between modal routes.
 */
const AudioModal = ({ isVisible, onClose, style }) => {
  const {
    currentRoute,
    translateX,
    opacity,
    navigateBack,
    navigateForward,
    goBackToHome,
  } = useModalNavigation({
    initialNavigationHistory: [AUDIO_MODAL_VIEW.AUDIO_PLAYER],
    transitionDistance: 300,
  });

  const handleClose = () => {
    onClose();

    // We have to reset history for next time modal will be shown, because it stays mounted "in background".
    // We also need to delay that, so that modal content doesn't change while it's closing.
    setTimeout(() => goBackToHome(), 500);
  };

  const resolveBackHandler =
    currentRoute === AUDIO_MODAL_VIEW.AUDIO_PLAYER ? handleClose : navigateBack;

  return (
    <Modal
      isVisible={isVisible}
      swipeDirection={['down']}
      onSwipeComplete={handleClose}
      style={style.modal}
      propagateSwipe
    >
      <Screen style={style.screenContainer}>
        <Header onClose={resolveBackHandler} currentRoute={currentRoute} />
        <Animated.View
          style={{ ...style.container, transform: [{ translateX }], opacity }}
        >
          {currentRoute === AUDIO_MODAL_VIEW.AUDIO_PLAYER && (
            <AudioPlayerView onQueuePress={navigateForward} />
          )}
          {currentRoute === AUDIO_MODAL_VIEW.QUEUE_LIST && <QueueView />}
        </Animated.View>
      </Screen>
    </Modal>
  );
};

AudioModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool,
  style: PropTypes.object,
};

AudioModal.defaultProps = {
  isVisible: false,
  style: {},
};

export default connectStyle(ext('AudioModal'))(AudioModal);

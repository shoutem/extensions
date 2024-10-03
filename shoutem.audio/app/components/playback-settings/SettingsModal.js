import React, { useCallback, useMemo } from 'react';
import { Animated } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Divider, Icon, Text, TouchableOpacity, View } from '@shoutem/ui';
import { useModalNavigation } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import SettingsView from './AllSettingsView';
import { HIT_SLOP, SETTINGS_VIEW } from './const';
import PlaybackSpeedSettingsView from './PlaybackSpeedSettingsView';
import SleepTimerSettingsView from './SleepTimerSettingsView';

/**
 * A modal component resembling a bottom action sheet that contains audio settings.
 * It allows users to navigate through various settings options with navigation-like animations during transitions.
 * Currently supported settings are playback speed & sleep timer.
 */
const SettingsModal = ({ isVisible, onClose, onAudioModalClose, style }) => {
  const {
    currentRoute,
    translateX,
    opacity,
    navigateBack,
    navigateForward,
    goBackToHome,
  } = useModalNavigation({
    initialNavigationHistory: [SETTINGS_VIEW.ROOT],
    transitionDistance: 100,
  });

  const handleClose = useCallback(() => {
    // Wait 50ms for user to be able to see their selected choice while modal is closing.
    setTimeout(() => {
      onClose();
      goBackToHome();
    }, 50);
  }, [onClose, goBackToHome]);

  const settingsTitle = useMemo(
    () => ({
      ROOT: I18n.t(ext('settingsModalTitle')),
      PLAYBACK_SPEED: I18n.t(ext('playbackSpeedTitle')),
      SLEEP_TIMER: I18n.t(ext('sleepTimerSettingsTitle')),
    }),
    [],
  );

  return (
    <Modal
      isVisible={isVisible}
      swipeDirection={['down']}
      onSwipeComplete={handleClose}
      onBackdropPress={handleClose}
      style={style.modal}
    >
      <View
        styleName="paper md-gutter rounded-corners-lg"
        style={style.bottomSheetHeight}
      >
        <Animated.View
          style={{
            ...style.headerContainer,
            transform: [{ translateX }],
            opacity,
          }}
        >
          {currentRoute !== SETTINGS_VIEW.ROOT && (
            <TouchableOpacity
              onPress={navigateBack}
              hitSlop={HIT_SLOP}
              style={style.headerBackButton}
            >
              <Icon name="left-arrow" style={style.headerBackIcon} />
            </TouchableOpacity>
          )}
          <Text>{settingsTitle[currentRoute]}</Text>
        </Animated.View>
        <Divider styleName="line md-gutter-bottom" />
        <Animated.View style={{ transform: [{ translateX }], opacity }}>
          {currentRoute === SETTINGS_VIEW.ROOT && (
            <SettingsView onPress={navigateForward} />
          )}
          {currentRoute === SETTINGS_VIEW.PLAYBACK_SPEED && (
            <PlaybackSpeedSettingsView onClose={handleClose} />
          )}
          {currentRoute === SETTINGS_VIEW.SLEEP_TIMER && (
            <SleepTimerSettingsView
              onClose={handleClose}
              onAudioModalClose={onAudioModalClose}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

SettingsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
  onAudioModalClose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connectStyle(ext('SettingsModal'))(SettingsModal);

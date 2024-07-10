import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useActiveTrack } from 'react-native-track-player';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Text, Title, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import { AUDIO_MODAL_VIEW } from '../../fragments/audio-modal';
import { getActiveSource } from '../../redux';
import { PlaybackSettings } from '../playback-settings';

/**
 * Header component for the audio modal, featuring an animated back button, title, subtitle, and audio settings button.
 * Displays the title of the active audio source, typically the shortcut name unless otherwise specified.
 * The subtitle currently indicates "live stream" if the active audio source is a live stream.
 */
const Header = ({ currentRoute, onClose, style }) => {
  const rotate = useRef(new Animated.Value(0)).current;

  const activeTrack = useActiveTrack();
  const activeSource = useSelector(getActiveSource);

  useEffect(() => {
    Animated.timing(rotate, {
      toValue: currentRoute === AUDIO_MODAL_VIEW.AUDIO_PLAYER ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [currentRoute, rotate]);

  // Initially, when audio modal is open, arrow-down is shown as modals close button. Once user navigates
  // to another route inside modal, button is animated to arrow-left, converting button to back button, instead of close.
  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const rotateStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <View styleName="horizontal stretch h-center v-start space-between md-gutter-horizontal">
      <TouchableOpacity onPress={onClose}>
        <Animated.View style={rotateStyle}>
          <Icon name="down-arrow" style={style.closeModalIcon} />
        </Animated.View>
      </TouchableOpacity>
      <View styleName="vertical" style={style.titleContainer}>
        <Title styleName="bold h-center" style={style.title} numberOfLines={2}>
          {activeSource?.title}
        </Title>
        {activeTrack?.isLiveStream && (
          <Text style={style.liveStreamText}>
            {I18n.t(ext('liveStreamText'))}
          </Text>
        )}
      </View>
      <View styleName="sm-gutter-top">
        <PlaybackSettings />
      </View>
    </View>
  );
};

Header.propTypes = {
  currentRoute: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connectStyle(ext('Header'))(Header);

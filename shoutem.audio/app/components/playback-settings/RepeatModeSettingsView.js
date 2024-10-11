import React, { useEffect, useState } from 'react';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import RadioOption from './RadioOption';

/**
 * Retrieves the current playback speed from TrackPlayer on mount and provides options
 * for different playback speeds defined in the PLAYBACK_SPEEDS constant. Users can select
 * a speed, which updates the playback speed and closes the audio settings modal after a short delay,
 * allowing users to see selected option for better UX.
 */
const PlaybackSpeedSettingsView = ({ onClose, style }) => {
  const [activeRepeatMode, setActiveRepeatMode] = useState(RepeatMode.Queue);

  useEffect(() => {
    TrackPlayer.getRepeatMode().then(setActiveRepeatMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRepeatModeSelect = async repeatMode => {
    await TrackPlayer.setRepeatMode(repeatMode);
    setActiveRepeatMode(repeatMode);

    onClose();
  };

  return (
    <>
      {_.map(_.pick(RepeatMode, ['Off', 'Track', 'Queue']), (value, key) => (
        <RadioOption
          key={key}
          text={I18n.t(ext(`repeat${key.toString()}`))}
          value={value}
          selected={activeRepeatMode === value}
          onPress={() => handleRepeatModeSelect(value)}
          showDivider={value < 2}
          TextComponent={() => (
            <View styleName="flexible">
              <Text>{I18n.t(ext(`repeat${key.toString()}`))}</Text>
              <Caption style={style.caption}>
                {I18n.t(ext(`repeatCaption${key.toString()}`))}
              </Caption>
            </View>
          )}
        />
      ))}
    </>
  );
};

PlaybackSpeedSettingsView.propTypes = {
  style: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connectStyle(ext('PlaybackSpeedSettingsView'))(
  PlaybackSpeedSettingsView,
);

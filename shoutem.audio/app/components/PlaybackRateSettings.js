import React, { useEffect, useState } from 'react';
import TrackPlayer from 'react-native-track-player';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Title, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import PlaybackRateOption from './PlaybackRateOption';

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const PlaybackRateSettings = ({ onPlaybackRateSelect }) => {
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    TrackPlayer.getRate().then(setPlaybackRate);
  }, []);

  const handlePlaybackRateSelect = rate => {
    TrackPlayer.setRate(rate);
    onPlaybackRateSelect();
  };

  return (
    <View styleName="paper md-gutter rounded-corners-lg">
      <Title styleName="md-gutter-bottom lg-gutter-left">
        {I18n.t(ext('playbackRateTitle'))}
      </Title>
      {_.map(PLAYBACK_RATES, rate => (
        <PlaybackRateOption
          key={rate}
          text={I18n.t(
            ext(`playbackRateOption${rate.toString().replace('.', '')}`),
          )}
          value={rate}
          selected={playbackRate === rate}
          onPress={() => handlePlaybackRateSelect(rate)}
        />
      ))}
    </View>
  );
};

PlaybackRateSettings.propTypes = {
  onPlaybackRateSelect: PropTypes.func.isRequired,
};

export default PlaybackRateSettings;

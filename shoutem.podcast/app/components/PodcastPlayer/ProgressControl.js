import React, { useState } from 'react';
import Slider from '@react-native-community/slider';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Caption, View } from '@shoutem/ui';
import { TrackPlayer, useProgress } from 'shoutem.audio';
import { convertSecondsToTimeDisplay } from '../../services';

const sliderColorProps = [
  'thumbTintColor',
  'minimumTrackTintColor',
  'maximumTrackTintColor',
];

export const ProgressControl = ({ style }) => {
  const { slider, timeDisplay } = style;
  const [sliderPosition, setSliderPosition] = useState(0);
  const [slidingPosition, setSlidingPosition] = useState(0);
  const { duration, position } = useProgress(100);

  const colorProps = _.pick(slider, sliderColorProps);
  const sliderStyle = _.omit(slider, sliderColorProps);
  const progress =
    position === 0 || duration === 0
      ? 0
      : parseFloat((position / duration).toFixed(2));
  const episodeIsActive = duration !== 0;

  const totalDuration = convertSecondsToTimeDisplay(Math.floor(duration));
  const resolvedTotalDuration = totalDuration === '0:00' ? '' : totalDuration;
  const currentTime =
    sliderPosition === 1
      ? totalDuration
      : convertSecondsToTimeDisplay(Math.floor(position));
  const resolvedCurrentTime =
    slidingPosition === 0
      ? currentTime
      : convertSecondsToTimeDisplay(Math.floor(slidingPosition * duration));

  function handleSlidingStart() {
    TrackPlayer.pause();
  }

  function handleSlidingComplete(newPosition) {
    TrackPlayer.seekTo(duration * newPosition);
    setSlidingPosition(0);
    setSliderPosition(newPosition);

    if (newPosition !== 1) {
      TrackPlayer.play();
    }
  }

  function handleValueChange(newPosition) {
    setSlidingPosition(newPosition);
    TrackPlayer.seekTo(duration * newPosition);
  }

  return (
    <View styleName="md-gutter-horizontal">
      <Slider
        disabled={!episodeIsActive}
        onSlidingStart={() => handleSlidingStart()}
        onSlidingComplete={handleSlidingComplete}
        onValueChange={handleValueChange}
        step={0.01}
        style={sliderStyle}
        value={progress}
        {...colorProps}
      />
      <View styleName="horizontal space-between stretch">
        <Caption style={timeDisplay} styleName="h-start">
          {resolvedCurrentTime}
        </Caption>
        <Caption style={timeDisplay} styleName="h-end">
          {resolvedTotalDuration}
        </Caption>
      </View>
    </View>
  );
};

ProgressControl.propTypes = {
  style: PropTypes.object,
};

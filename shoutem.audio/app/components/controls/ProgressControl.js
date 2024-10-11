import React, { useCallback, useMemo, useState } from 'react';
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, View } from '@shoutem/ui';
import { ext } from '../../const';
import { convertSecondsToTimeDisplay } from '../../services';

/**
 * Provides a slider for navigating through audio or video playback, displaying the current
 * time and total duration. It handles user interactions for sliding and updates the displayed
 * time accordingly.
 */
export const ProgressControl = ({
  currentValue,
  maxValue,
  disabled,
  onValueChange,
  style,
}) => {
  const [slidingPosition, setSlidingPosition] = useState(0);
  const [slidingInProgress, setSlidingInProgress] = useState(false);

  const totalDuration = useMemo(() => {
    const totalDuration = convertSecondsToTimeDisplay(Math.floor(maxValue));
    return totalDuration === '0:00' ? '' : totalDuration;
  }, [maxValue]);

  const resolveCurrentTime = () => {
    if (slidingInProgress) {
      return convertSecondsToTimeDisplay(
        Math.floor(slidingPosition * maxValue),
      );
    }

    return convertSecondsToTimeDisplay(Math.floor(currentValue));
  };

  const handleSlidingComplete = useCallback(
    newPosition => {
      setSlidingInProgress(false);
      onValueChange(newPosition);
    },
    [onValueChange],
  );

  const handleValueChange = useCallback(
    newPosition => setSlidingPosition(newPosition),
    [],
  );

  return (
    <View styleName="md-gutter-horizontal">
      <Slider
        value={currentValue / maxValue}
        disabled={disabled}
        step={0.01}
        tapToSeek
        onSlidingStart={() => setSlidingInProgress(true)}
        onSlidingComplete={handleSlidingComplete}
        onValueChange={handleValueChange}
        style={style.slider}
        {...style.sliderColors}
      />
      <View styleName="horizontal space-between stretch">
        <Caption
          style={[style.timeDisplay, disabled && style.disabled]}
          styleName="h-start"
        >
          {resolveCurrentTime()}
        </Caption>
        <Caption
          style={[style.timeDisplay, disabled && style.disabled]}
          styleName="h-end"
        >
          {totalDuration}
        </Caption>
      </View>
    </View>
  );
};

ProgressControl.propTypes = {
  currentValue: PropTypes.number.isRequired,
  onValueChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  hideTotalDuration: PropTypes.bool,
  maxValue: PropTypes.number,
  style: PropTypes.object,
};

ProgressControl.defaultProps = {
  disabled: false,
  hideTotalDuration: false,
  maxValue: undefined,
  style: {},
};

export default connectStyle(ext('ProgressControl'))(
  React.memo(ProgressControl),
);

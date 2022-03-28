import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';

const timerOptions = [5, 10, 15, 30, 45, 60];

function TimerOptions({ onClearTimer, onOptionPress, style, timeRemaining }) {
  const { optionContainer, optionText } = style;

  function renderTimerOption(timeOption) {
    return (
      <TouchableOpacity
        key={timeOption}
        onPress={() => onOptionPress(timeOption)}
        style={optionContainer}
      >
        <Text style={optionText}>
          {I18n.t(ext('timerOption'), { duration: timeOption })}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <View style={optionContainer}>
        <Text style={optionText}>{I18n.t(ext('timerOptionsExplanation'))}</Text>
      </View>
      {timerOptions.map(duration => renderTimerOption(duration))}
      {!!timeRemaining && (
        <TouchableOpacity onPress={onClearTimer} style={optionContainer}>
          <Text style={optionText}>
            {I18n.t(ext('cancelTimerWithDurationLeft'), {
              count: timeRemaining / 60000,
            })}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}

TimerOptions.propTypes = {
  timeRemaining: PropTypes.number.isRequired,
  onClearTimer: PropTypes.func.isRequired,
  onOptionPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

TimerOptions.defaultProps = {
  style: {},
};

export default connectStyle(ext('TimerOptions'))(TimerOptions);

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Text, TouchableOpacity } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import { getSleepTimer, setSleepTimer } from '../../redux';
import RadioOption from './RadioOption';

const TIMER_OPTIONS = [5, 10, 15, 30, 45, 60];

/**
 * Manages sleep timer settings, allowing users to select from predefined timer
 * options and turn off the timer if set. It displays countdown information when the
 * timer is active and provides options to set or disable the timer.
 */
const SleepTimerSettingsView = ({ onClose, style }) => {
  const dispatch = useDispatch();

  const sleepTimer = useSelector(getSleepTimer) ?? {};

  const minutesLeft = Math.ceil(
    moment(sleepTimer.startedAt)
      .add(sleepTimer.duration, 'minutes')
      .diff(moment()) / 60000,
  );

  const [timerValue, setTimerValue] = useState(sleepTimer.duration);
  const [turnOffButtonShown, setTurnOffButtonShown] = useState(
    !!sleepTimer.duration,
  );

  useEffect(() => {
    const timerCheckInterval = setInterval(() => {
      const secondsLeft =
        moment(sleepTimer.startedAt)
          .add(sleepTimer.duration, 'minutes')
          .diff(moment()) / 1000;

      if (secondsLeft < 1) {
        setTurnOffButtonShown(false);
        setTimerValue(null);
      }
    }, 1000);

    return () => clearInterval(timerCheckInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTimerValueSelect = async timer => {
    setTimerValue(timer);

    await dispatch(
      setSleepTimer({
        duration: timer,
        startedAt: moment().toISOString(),
      }),
    );

    onClose();
  };

  const handleTurnOffTimerPress = () => {
    setTurnOffButtonShown(false);
    dispatch(setSleepTimer(null));
    onClose();
  };

  // eslint-disable-next-line react/prop-types, react/no-multi-comp
  const TextComponent = ({ text }) => (
    <Text>{I18n.t(ext(`timerOption${text.toString().replace('.', '')}`))}</Text>
  );

  return (
    <>
      {_.map(TIMER_OPTIONS, (timer, index) => (
        <RadioOption
          key={timer}
          TextComponent={() => <TextComponent text={timer} />}
          value={timer}
          selected={timerValue === timer}
          onPress={() => handleTimerValueSelect(timer)}
          showDivider={index + 1 < TIMER_OPTIONS.length}
        />
      ))}
      {turnOffButtonShown && (
        <TouchableOpacity
          onPress={handleTurnOffTimerPress}
          style={style.turnOffTimerButton}
        >
          <Text style={style.turnOffText}>
            {I18n.t(ext('turnOffTimerText'))}
          </Text>
          <Caption style={style.turnOffCaption}>
            {I18n.t(ext('timeLeftCaption'), {
              count: minutesLeft,
            })}
          </Caption>
        </TouchableOpacity>
      )}
    </>
  );
};

SleepTimerSettingsView.propTypes = {
  style: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

SleepTimerSettingsView.defaultProps = {
  onClose: undefined,
};

export default connectStyle(ext('SleepTimerSettingsView'))(
  SleepTimerSettingsView,
);

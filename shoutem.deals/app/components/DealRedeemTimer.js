import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Icon, Text } from '@shoutem/ui';
import { formatTwoDigitNumber, getTimeLeft } from '../services';

export default class DealRedeemTimer extends PureComponent {
  static propTypes = {
    deal: PropTypes.object,
    endTime: PropTypes.string,
    onTimerEnd: PropTypes.func,
    styleName: PropTypes.string,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    const endTime = moment(props.endTime);

    this.secondsLeft = endTime.diff(moment(), 'seconds');
    this.timerInterval = null;

    this.state = {
      endTime,
      ...getTimeLeft(this.secondsLeft),
    };

    this.initializeTimer();
  }

  componentDidUpdate() {
    const { endTime: stateEndTime } = this.state;
    const { endTime: propsEndTime } = this.props;

    const endTime = moment(propsEndTime);

    if (stateEndTime.format() !== endTime.format()) {
      this.setState(
        {
          endTime,
        },
        () => {
          if (this.timerInterval) {
            this.destroyTimer();
            this.initializeTimer();
          }
        },
      );
    }
  }

  componentWillUnmount() {
    this.destroyTimer();
  }

  canContinueTimer() {
    return this.secondsLeft > 0;
  }

  initializeTimer() {
    if (this.timerInterval) {
      return;
    }

    const today = moment();
    const { endTime } = this.state;
    this.secondsLeft = endTime.diff(today, 'seconds');

    if (this.canContinueTimer()) {
      this.timerInterval = setInterval(this.updateTimer, 1000);
    } else {
      this.triggerTimerEnd();
    }
  }

  destroyTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  triggerTimerEnd() {
    if (_.isFunction(this.props.onTimerEnd)) {
      this.props.onTimerEnd();
    }
  }

  updateTimer() {
    if (!this.canContinueTimer()) {
      this.triggerTimerEnd();
      this.destroyTimer();
      return;
    }

    this.secondsLeft = this.secondsLeft - 1;
    this.setState({
      ...getTimeLeft(this.secondsLeft),
    });

    if (this.secondsLeft <= 0) {
      this.triggerTimerEnd();
      this.destroyTimer();
    }
  }

  render() {
    const { hoursLeft, minutesLeft } = this.state;

    if (!this.canContinueTimer()) {
      return <Text />;
    }

    return (
      <Text>
        <Icon
          name="checkbox-on"
          styleName="md-gutter-right"
          style={{ fontSize: 14 }}
        />
        <Text>
          {`  ${formatTwoDigitNumber(hoursLeft)} H : ${formatTwoDigitNumber(
            minutesLeft,
          )} M`}
        </Text>
      </Text>
    );
  }
}

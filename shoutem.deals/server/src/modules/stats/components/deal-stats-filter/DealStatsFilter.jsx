import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { ControlLabel, FormGroup, Button } from 'react-bootstrap';
import { DateTimePicker } from '@shoutem/react-web-ui';
import { getDisplayDateFormat, getDisplayTimeFormat } from 'src/services';
import LOCALIZATION from './localization';
import './style.scss';

export default class DealStatsFilter extends PureComponent {
  static propTypes = {
    onFilterChange: PropTypes.func,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    const { startTime, endTime } = props;

    this.state = {
      startTime,
      endTime,
    };
  }

  handleStartTimeChange(startTime) {
    this.setState({ startTime });
  }

  handleEndTimeChange(endTime) {
    this.setState({ endTime });
  }

  handleFilterApplyClick() {
    const { onFilterChange } = this.props;
    const { startTime, endTime } = this.state;

    onFilterChange(startTime, endTime);
  }

  render() {
    const { startTime, endTime } = this.state;

    return (
      <form className="deal-stats-filter">
        <FormGroup>
          <ControlLabel>
            {i18next.t(LOCALIZATION.FORM_FILTER_BY_START_DATE_TITLE)}
          </ControlLabel>
          <DateTimePicker
            dateFormat={getDisplayDateFormat()}
            onChange={this.handleStartTimeChange}
            timeFormat={getDisplayTimeFormat()}
            value={startTime}
            utc={false}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>
            {i18next.t(LOCALIZATION.FORM_FILTER_BY_END_DATE_TITLE)}
          </ControlLabel>
          <DateTimePicker
            dateFormat={getDisplayDateFormat()}
            onChange={this.handleEndTimeChange}
            timeFormat={getDisplayTimeFormat()}
            value={endTime}
            utc={false}
          />
        </FormGroup>
        <Button onClick={this.handleFilterApplyClick}>
          {i18next.t(LOCALIZATION.BUTTON_FILTER_TITLE)}
        </Button>
      </form>
    );
  }
}

import React, { PropTypes, Component } from 'react';
import i18next from 'i18next';
import { ControlLabel, FormGroup, Button } from 'react-bootstrap';
import { DateTimePicker } from '@shoutem/react-web-ui';
import { getDisplayDateFormat, getDisplayTimeFormat } from 'src/services';
import LOCALIZATION from './localization';
import './style.scss';

export default class DealStatsFilter extends Component {
  static propTypes = {
    onFilterChange: PropTypes.func,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleFilterApplyClick = this.handleFilterApplyClick.bind(this);

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
    const { startTime, endTime } = this.state;
    const { onFilterChange } = this.props;

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

import React, { PropTypes, Component } from 'react';
import { ControlLabel, FormGroup, Button } from 'react-bootstrap';
import { DateTimePicker } from '@shoutem/react-web-ui';
import { DISPLAY_DATE_FORMAT, DISPLAY_TIME_FORMAT } from 'src/const';
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
          <ControlLabel>Filter by start date</ControlLabel>
          <DateTimePicker
            dateFormat={DISPLAY_DATE_FORMAT}
            onChange={this.handleStartTimeChange}
            timeFormat={DISPLAY_TIME_FORMAT}
            value={startTime}
            utc={false}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Filter by end date</ControlLabel>
          <DateTimePicker
            dateFormat={DISPLAY_DATE_FORMAT}
            onChange={this.handleEndTimeChange}
            timeFormat={DISPLAY_TIME_FORMAT}
            value={endTime}
            utc={false}
          />
        </FormGroup>
        <Button onClick={this.handleFilterApplyClick}>
          Filter
        </Button>
      </form>
    );
  }
}

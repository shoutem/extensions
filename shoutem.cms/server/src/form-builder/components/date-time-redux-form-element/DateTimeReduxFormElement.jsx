import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import timezones from 'timezones.json';
import moment from 'moment-timezone';
import { DateTimePicker, ReduxFormElement } from '@shoutem/react-web-ui';
import SelectReduxFormElement from '../select-redux-form-element';
import './style.scss';

export function getISODateFromDatetimeAndZone(datetime, timezone) {
  // check if moment supports that zone
  if (moment.tz.zone(timezone)) {
    return moment.tz(datetime, timezone).format();
  }

  // if we are here that means timezone is not supported by moment
  const rawTimezone = _.find(timezones, { value: timezone });
  const similarTimezone = _.find(rawTimezone.utc, item => moment.tz.zone(item));

  return moment.tz(datetime, similarTimezone).format();
}

export function getDateTimeFromISODate(isoDate) {
  if (!isoDate) {
    return null;
  }

  const date = moment.parseZone(isoDate);
  return date.format('YYYY-MM-DDTHH:mm:ss');
}

export function getTimezoneFromISODate(isoDate) {
  if (!isoDate) {
    return null;
  }

  const offset = moment.parseZone(isoDate).format('Z');
  const timezone = _.find(timezones, timezone =>
    _.includes(timezone.text, offset),
  );

  return _.get(timezone, 'value');
}

const TIMEZONE_OPTIONS = _.map(timezones, timezone => ({
  value: timezone.value,
  label: timezone.text,
}));

export default class DateTimeReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    name: PropTypes.string,
    timezoneName: PropTypes.string,
    field: PropTypes.object,
    touch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    const { elementId, field } = props;
    const timezoneElementId = `${elementId}-timezone`;

    const fieldValue = _.get(field, 'value');
    const timezone = getTimezoneFromISODate(fieldValue) || 'UTC';

    this.state = {
      timezoneElementId,
      timezone,
    };
  }

  handleSelectionChanged(option) {
    const { field, touch } = this.props;

    const timezone = _.get(option, 'value');
    const fieldValue = _.get(field, 'value');

    if (fieldValue && timezone) {
      const datetime = getDateTimeFromISODate(fieldValue);
      const value = getISODateFromDatetimeAndZone(datetime, timezone);

      field.onChange(value);
    }

    if (_.isFunction(touch)) {
      touch([field.name]);
    }

    if (timezone) {
      this.setState({ timezone });
    }
  }

  handleDatetimeChanged(momentObj) {
    const { field, touch } = this.props;
    const { timezone } = this.state;

    if (momentObj && _.isFunction(momentObj.format)) {
      const datetime = momentObj.format('YYYY-MM-DDTHH:mm:ss');
      const value = getISODateFromDatetimeAndZone(datetime, timezone);

      field.onChange(value);
    } else {
      field.onChange(null);
    }

    if (_.isFunction(touch)) {
      touch([field.name]);
    }
  }

  render() {
    const { elementId, field, name, timezoneName } = this.props;
    const { timezoneElementId, timezone } = this.state;

    const fieldValue = _.get(field, 'value');
    const datetime = getDateTimeFromISODate(fieldValue);

    const datetimeField = _.cloneDeep(field);
    datetimeField.value = datetime;

    const timezoneField = _.cloneDeep(field);
    timezoneField.value = timezone;
    timezoneField.error = null;

    return (
      <Row className="date-time-form">
        <Col xs={6} className="date-time-picker">
          <ReduxFormElement
            elementId={elementId}
            name={name}
            field={datetimeField}
            onChange={this.handleDatetimeChanged}
            onUpdate={this.handleDatetimeChanged}
            onDrop={this.handleDatetimeChanged}
            onBlur={this.handleDatetimeChanged}
          >
            <DateTimePicker
              dateFormat="MM/DD/YYYY"
              timeFormat="hh:mm A"
              utc={false}
            />
          </ReduxFormElement>
        </Col>
        <Col xs={6} className="time-zone-picker">
          <SelectReduxFormElement
            elementId={timezoneElementId}
            name={timezoneName}
            field={timezoneField}
            clearable={false}
            options={TIMEZONE_OPTIONS}
            onChange={this.handleSelectionChanged}
          />
        </Col>
      </Row>
    );
  }
}

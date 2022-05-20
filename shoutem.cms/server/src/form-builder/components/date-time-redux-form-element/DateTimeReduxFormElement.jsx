import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment-timezone';
import { DateTimePicker, ReduxFormElement } from '@shoutem/react-web-ui';
import SelectReduxFormElement from '../select-redux-form-element';
import { TIMEZONES } from './const';
import './style.scss';

function getISODateFromDatetimeAndZone(datetime, timezone) {
  const rawTimezone = _.find(TIMEZONES, { value: timezone });
  if (rawTimezone) {
    return `${datetime}${rawTimezone.offset}`;
  }

  // if we don't have raw timezone check if moment has that timezone
  if (moment.tz.zone(timezone)) {
    return moment.tz(datetime, timezone).format();
  }

  // if we can not find any suitable timezone, return UTC
  return `${datetime}Z`;
}

function getDateTimeFromISODate(isoDate) {
  if (!isoDate) {
    return null;
  }

  const date = moment.parseZone(isoDate);
  return date.format('YYYY-MM-DDTHH:mm:ss');
}

function getTimezoneFromISODate(isoDate) {
  if (!isoDate) {
    return null;
  }

  const offset = moment.parseZone(isoDate).format('Z');
  const timezone = _.find(TIMEZONES, timezone =>
    _.includes(timezone.offset, offset),
  );

  return _.get(timezone, 'value');
}

function isTimezoneSupported(timezone) {
  return !!_.find(TIMEZONES, item => item.value === timezone);
}

function resoloveTimezone(timezoneField, field) {
  if (timezoneField && timezoneField.value) {
    if (isTimezoneSupported(timezoneField.value)) {
      return timezoneField.value;
    }
  }

  const fieldValue = _.get(field, 'value');

  return getTimezoneFromISODate(fieldValue) || 'UTC';
}

export default class DateTimeReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    name: PropTypes.string,
    timezoneName: PropTypes.string,
    field: PropTypes.object,
    timezoneField: PropTypes.object,
    touch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    const { field, timezoneField } = props;
    const timezone = resoloveTimezone(timezoneField, field);

    this.state = {
      timezone,
    };
  }

  handleTimezoneChanged(option) {
    const { field, timezoneField, touch } = this.props;

    const timezone = _.get(option, 'value');
    const fieldValue = _.get(field, 'value');

    if (fieldValue && timezone) {
      const datetime = getDateTimeFromISODate(fieldValue);
      const value = getISODateFromDatetimeAndZone(datetime, timezone);

      timezoneField.onChange(timezone);
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
    const { timezone } = this.state;

    const timezoneElementId = `${elementId}-timezone`;
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
            options={TIMEZONES}
            onChange={this.handleTimezoneChanged}
          />
        </Col>
      </Row>
    );
  }
}

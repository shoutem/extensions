import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { DateTimePicker, ReduxFormElement } from '@shoutem/react-web-ui';
import SelectReduxFormElement from '../select-redux-form-element';
import { IANA_WINDOWS_TIMEZONE_MAPPER, TIMEZONES } from './const';
import './style.scss';

function getISODateFromDatetimeAndZone(datetime, timezone) {
  const rawTimezone = _.find(TIMEZONES, { value: timezone });

  // check if moment has that timezone
  if (moment.tz.zone(rawTimezone.iana)) {
    return moment.tz(datetime, rawTimezone.iana).format();
  }

  // check raw timezones
  if (rawTimezone) {
    return `${datetime}${rawTimezone.offset}`;
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

function getDefaultTimezone() {
  const guessedTimezone = moment.tz.guess();
  const windowsTimezone = IANA_WINDOWS_TIMEZONE_MAPPER[guessedTimezone];

  if (isTimezoneSupported(windowsTimezone)) {
    return windowsTimezone;
  }

  return 'UTC';
}

function resoloveTimezone(timezoneField, field) {
  if (timezoneField && timezoneField.value) {
    if (isTimezoneSupported(timezoneField.value)) {
      return timezoneField.value;
    }
  }

  const fieldValue = _.get(field, 'value');

  return getTimezoneFromISODate(fieldValue) || getDefaultTimezone();
}

export default class DateTimeReduxFormElement extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { field, timezoneField } = props;
    const timezone = resoloveTimezone(timezoneField, field);

    // update timezone field for initial setup when
    // timezoneField was never selected before
    if (timezoneField && !timezoneField.value) {
      timezoneField.onChange(timezone);
    }

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

      field.onChange(value);
    }

    if (_.isFunction(touch)) {
      touch([field.name]);
    }

    if (timezone) {
      timezoneField.onChange(timezone);
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

DateTimeReduxFormElement.propTypes = {
  elementId: PropTypes.string,
  name: PropTypes.string,
  timezoneName: PropTypes.string,
  field: PropTypes.object,
  timezoneField: PropTypes.object,
  touch: PropTypes.func,
};

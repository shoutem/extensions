import _ from 'lodash';
import moment from 'moment';

function toUtcTime(date, time, timeZone) {
  const offset = _.get(timeZone.split('UTC'), '[1]', '+00:00');
  const utcTime = moment.utc(`${date}T${time}${offset}`);

  return utcTime;
}

export default function adaptProxiedEvent(proxiedEvent) {
  const {
    summary,
    startDate,
    startTime,
    startTimeZone,
    endDate,
    endTime,
    endTimeZone,
    description,
    location,
    attachments,
    geo,
    RSVP,
    allDay,
  } = proxiedEvent;

  const name = summary;
  const imageUrl = _.get(attachments, '[0].source');

  let start = toUtcTime(startDate, startTime, startTimeZone);
  let end = toUtcTime(endDate, endTime, endTimeZone);

  if (allDay) {
    const momentStartDate = moment(startDate);
    const momentEndDate = moment(endDate);

    start = momentStartDate.startOf('day');

    end = momentEndDate.startOf('day');
  }

  return {
    name,
    summary,
    description,
    startDate,
    startTime,
    startTimeZone,
    endDate,
    endTime,
    endTimeZone,
    location,
    attachments,
    start,
    end,
    imageUrl,
    geo,
    RSVP,
    allDay,
  };
}

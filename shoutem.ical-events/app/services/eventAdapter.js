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
  } = proxiedEvent;

  const start = toUtcTime(startDate, startTime, startTimeZone);
  const end = toUtcTime(endDate, endTime, endTimeZone);
  const name = summary;
  const imageUrl = _.get(attachments, '[0].source');

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
  };
}

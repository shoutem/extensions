import momentTimezone from 'moment-timezone';
import { Alert, Linking } from 'react-native';
import { getTimeZone } from 'react-native-localize';
import CalendarManager, {
  PERMISSION_ERROR,
} from '@shoutem/react-native-calendar-manager';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const showSuggestionToGrantCalendarAccess = () => {
  Alert.alert(
    I18n.t(ext('calendarPermissionsTitle')),
    I18n.t(ext('calendarPermissionsMessage')),
    [
      {
        text: I18n.t(ext('calendarPermissionsSettings')),
        onPress: () => Linking.openURL('app-settings:'),
      },
      { text: I18n.t(ext('calendarPermissionsCancel')) },
    ],
  );
};

function toMoment(date) {
  return momentTimezone(date, 'YYYY-MM-DDThh:mm:ssZ');
}

export function addToCalendar(event) {
  const fromDate = toMoment(event.start);
  const toDate = event.end
    ? toMoment(event.end)
    : fromDate.clone().add(1, 'hours');

  CalendarManager.addEvent(
    {
      name: event.name,
      rsvpLink: event.rsvpLink,
      startTime: fromDate.valueOf(),
      endTime: toDate.valueOf(),
      location: event.location || '',
    },
    error => {
      console.log(error);
      if (error.type === PERMISSION_ERROR) {
        showSuggestionToGrantCalendarAccess();
      }
    },
  );
}

const DATE_FORMAT = 'MMM D • hh:mm A';
export function formatToLocalDate(date) {
  if (!date) {
    return '';
  }

  const localTimezone = getTimeZone();
  const momentDate = toMoment(date);

  return momentDate.tz(localTimezone).format(DATE_FORMAT);
}

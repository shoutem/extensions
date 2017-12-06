import moment from 'moment';
import { Alert, Linking } from 'react-native';
import CalendarManager, { PERMISSION_ERROR } from 'react-native-calendar-manager';
import { I18n } from 'shoutem.i18n';
import { ext } from '../extension';

const showSuggestionToGrantCalendarAccess = () => {
  Alert.alert(
    I18n.t(ext('calendarPermissionsTitle')),
    I18n.t(ext('calendarPermissionsMessage')),
    [
      { text: I18n.t(ext('calendarPermissionsSettings')), onPress: () => Linking.openURL('app-settings:') },
      { text: I18n.t(ext('calendarPermissionsCancel')) },
    ],
  );
};

export function toMoment(date) {
  return moment(date, 'YYYY-MM-DDThh:mm:ssZ');
}

export function addToCalendar(event) {
  const fromDate = toMoment(event.start);
  const toDate = event.end ? toMoment(event.end) : fromDate.clone().add(1, 'hours');

  CalendarManager.addEvent({
    name: event.name,
    rsvpLink: event.rsvpLink,
    startTime: fromDate.valueOf(),
    endTime: toDate.valueOf(),
    location: event.location || '',
  }, (error) => {
    console.log(error);
    if (error.type === PERMISSION_ERROR) {
      showSuggestionToGrantCalendarAccess();
    }
  });
}

export function formatDate(date) {
  if (!date) {
    return '';
  }

  return toMoment(date).format('MMM D • hh:mm A');
}

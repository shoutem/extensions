import { changeColorAlpha } from '@shoutem/theme';
import { createScopedResolver } from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.notification-center.NotificationRow': {
    message: {
      color: resolveVariable('notificationMessageColor'),
    },
    timestamp: {
      color: resolveVariable('notificationTimestampColor'),
    },
  },

  'shoutem.notification-center.NotificationDetailsScreen': {
    message: {
      color: resolveVariable('notificationMessageColor'),
    },
    title: {
      color: resolveVariable('notificationTitleColor'),
    },
    timestamp: {
      color: resolveVariable('notificationTimestampColor'),
    },
  },

  'shoutem.notification-center.NotificationDailySettingsScreen': {
    confirmButton: {
      borderRadius: 2,
      marginHorizontal: 'auto',
      marginTop: 50,
      width: '40%',
    },
    restoreIconTintColor: {
      color: changeColorAlpha(
        resolveVariable('shoutem.navigation', 'navBarIconsColor'),
        0.6,
      ),
    },
    subtitle: {
      textAlign: 'center',
    },
    timePickerButton: {
      buttonContainer: {
        backgroundColor: resolveVariable('primaryButtonBackgroundColor'),
      },
    },
  },

  'shoutem.notification-center.ReminderSettingsScreen': {
    confirmButton: {
      borderRadius: 2,
      marginHorizontal: 'auto',
      marginTop: 50,
      marginBottom: 20,
      width: '40%',
    },
    restoreIconTintColor: {
      color: changeColorAlpha(
        resolveVariable('shoutem.navigation', 'navBarIconsColor'),
        0.6,
      ),
    },
    subtitle: {
      textAlign: 'center',
    },
  },

  'shoutem.notification-center.ReminderTimePickers': {
    timePickerButton: {
      buttonContainer: {
        backgroundColor: resolveVariable('primaryButtonBackgroundColor'),
      },
    },
  },

  'shoutem.notification-center.SettingsToggle': {
    trackColor: resolveVariable('primaryButtonBackgroundColor'),
  },

  'shoutem.notification-center.SettingDetailsNavigationItem': {
    icon: {
      color: '#BDC0CB',
      margin: 0,
    },
  },
});

import { changeColorAlpha } from '@shoutem/theme';
import {
  createScopedResolver,
  resolveFontFamily,
  resolveFontStyle,
  resolveFontWeight,
  responsiveHeight,
  responsiveWidth,
} from '@shoutem/ui';
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
      marginTop: responsiveHeight(50),
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
      marginTop: responsiveHeight(50),
      marginBottom: responsiveHeight(20),
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

  'shoutem.notification-center.SettingDetailsNavigationItem': {
    icon: {
      color: '#BDC0CB',
      margin: 0,
    },
  },

  'shoutem.notification-center.CreatePushNotificationScreen': {
    createButton: {
      marginHorizontal: 0,
    },
  },

  'shoutem.notification-center.Button': {
    button: {
      marginHorizontal: responsiveWidth(20),
      alignSelf: 'stretch',
      backgroundColor: resolveVariable('primaryButtonBackgroundColor'),
      borderRadius: 4,
      height: responsiveHeight(50),
      marginVertical: responsiveHeight(4),
    },
    disabled: {
      opacity: 0.8,
    },
    secondaryButton: {
      backgroundColor: resolveVariable('secondaryButtonBackgroundColor'),
    },
    secondaryText: {
      color: resolveVariable('secondaryButtonTextColor'),
    },
    textContainer: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: responsiveWidth(16),
    },
    text: {
      ...resolveVariable('primaryButtonText'),
    },
    wideButton: {
      flex: 1,
      marginHorizontal: 0,
    },
    animationFiltersPrimary: [
      {
        keypath: '*',
        color: resolveVariable('primaryButtonText.color'),
      },
    ],
    animationFiltersSecondary: [
      {
        keypath: '*',
        color: resolveVariable('secondaryButtonTextColor'),
      },
    ],
    lottieContainer: { flex: 1 },
  },

  'shoutem.notification-center.EditPushNotificationScreen': {
    footer: {
      paddingTop: responsiveHeight(8),
      flexDirection: 'row',
    },
    footerDivider: {
      width: responsiveWidth(20),
    },
  },

  'shoutem.notification-center.DropdownPicker': {
    mainContainer: {
      marginTop: responsiveHeight(16),
    },
    container: {
      width: '100%',
      backgroundColor: resolveVariable('paperColor'),
      borderRadius: 0,
      borderWidth: 0,
      borderBottomColor: resolveVariable('lineColor'),
      borderBottomWidth: 1,
    },
    text: {
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        resolveVariable('text.fontWeight'),
        resolveVariable('text.fontStyle'),
      ),
      fontWeight: resolveFontWeight(resolveVariable('text.fontWeight')),
      fontStyle: resolveFontStyle(resolveVariable('text.fontStyle')),
      color: resolveVariable('text.color'),
      fontSize: 14,
      textAlign: 'left',
    },
    row: {
      backgroundColor: resolveVariable('searchInputBackgroundColor'),
      borderBottomWidth: 0,
    },
    label: {
      paddingVertical: responsiveHeight(8),
    },
    overlay: {
      color: 'transparent',
    },
  },

  'shoutem.notification-center.AudienceDropdown': {
    title: {
      paddingLeft: responsiveWidth(8),
    },
  },

  'shoutem.notification-center.Modal': {
    modal: { margin: 0 },
    container: {
      justifyContent: 'center',
      marginHorizontal: responsiveWidth(20),
      paddingHorizontal: responsiveWidth(16),
      paddingVertical: responsiveHeight(20),
      backgroundColor: resolveVariable('paperColor'),
      borderRadius: 6,
    },
  },

  'shoutem.notification-center.DatePickerIOS': {
    buttonContainer: {
      flexDirection: 'row',
    },
    cancelButton: {
      flex: 1,
    },
    submitButton: {
      flex: 1,
      marginLeft: responsiveWidth(16),
    },
  },

  'shoutem.notification-center.ShortcutDropdown': {
    title: {
      paddingLeft: responsiveWidth(8),
    },
    row: {
      indentationPadding: responsiveWidth(16),
    },
  },

  'shoutem.notification-center.PushNotificationsDisabled': {
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0,
      marginHorizontal: responsiveWidth(24),
    },
    title: {
      fontFamily: resolveFontFamily(
        resolveVariable('title.fontFamily'),
        '500',
        resolveVariable('title.fontStyle'),
      ),
      fontWeight: resolveFontWeight('500'),
      fontSize: 21,
      marginVertical: responsiveHeight(24),
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
    },
  },

  'shoutem.notification-center.TextInputButton': {
    textInputContainer: {
      alignSelf: 'stretch',
      borderBottomColor: resolveVariable('lineColor'),
      borderBottomWidth: 1,
      justifyContent: 'center',
      marginTop: responsiveHeight(16),
    },
    label: {
      backgroundColor: 'transparent',
      fontSize: 14,
      lineHeight: 24,
      paddingBottom: responsiveHeight(3),
    },
    error: {
      ...resolveVariable('errorText'),
      paddingTop: responsiveHeight(5),
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    textInput: {
      backgroundColor: resolveVariable('paperColor'),
      borderRadius: 4,
      height: responsiveHeight(48),
      paddingLeft: responsiveWidth(16),
      paddingRight: responsiveWidth(8),
    },
    value: {
      flex: 1,
    },
  },

  'shoutem.notification-center.TextInput': {
    container: {
      backgroundColor: resolveVariable('paperColor'),
    },
    textInputContainer: {
      alignSelf: 'stretch',
      justifyContent: 'center',
      marginTop: responsiveHeight(16),
      backgroundColor: resolveVariable('paperColor'),
    },
    label: {
      backgroundColor: 'transparent',
      fontSize: 14,
      lineHeight: 24,
      paddingBottom: responsiveHeight(3),
    },
    error: {
      color: resolveVariable('errorText.color'),
      paddingTop: responsiveHeight(5),
    },
    actionButton: {
      paddingHorizontal: responsiveWidth(8),
    },
    input: {
      backgroundColor: resolveVariable('searchInputBackgroundColor'),
      borderRadius: 4,
      borderBottomColor: resolveVariable('lineColor'),
      borderBottomWidth: 2,
      flexDirection: 'row',
      paddingHorizontal: responsiveWidth(16),
    },
    textInput: {
      color: resolveVariable('text.color'),
      flexGrow: 1,
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        '300',
        resolveVariable('text.fontStyle'),
      ),
      fontWeight: resolveFontWeight('300'),
      fontSize: 14,
      height: responsiveHeight(48),
    },
    disabled: {
      color: changeColorAlpha(resolveVariable('text.color'), 0.6),
    },
    multiline: {
      height: responsiveHeight(70),
      paddingTop: responsiveHeight(8),
    },
    focused: {
      borderBottomColor: resolveVariable('secondaryButtonBackgroundColor'),
    },
    selectionColor: {
      color: resolveVariable('text.color'),
    },
  },

  'shoutem.notification-center.PushNotificationCard': {
    footerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: responsiveWidth(20),
      marginTop: responsiveHeight(16),
    },
    container: {
      backgroundColor: resolveVariable('paperColor'),
      borderRadius: 4,
      elevation: 1,
      marginVertical: responsiveHeight(6),
      paddingVertical: responsiveHeight(20),
      marginHorizontal: responsiveWidth(20),
      shadowColor: resolveVariable('shadowColor'),
      shadowOpacity: 1,
      shadowOffset: {
        height: 0.1,
      },
      shadowRadius: 20,
    },
    contentContainer: {
      paddingHorizontal: responsiveWidth(20),
    },
    title: {
      fontSize: 16,
      marginBottom: responsiveHeight(10),
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        '700',
        resolveVariable('text.fontStyle'),
      ),
      fontWeight: resolveFontWeight('700'),
    },
    content: {
      fontSize: 15,
      lineHeight: 24,
    },
  },

  'shoutem.notification-center.ViewPushNotificationScreen': {
    listContainer: {
      marginHorizontal: responsiveWidth(20),
    },
  },

  'shoutem.notification-center.KeyboardAwareScreen': {
    mainContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: resolveVariable('paperColor'),
      paddingHorizontal: responsiveWidth(20),
    },
    footer: {
      backgroundColor: resolveVariable('paperColor'),
      paddingBottom: responsiveHeight(16),
    },
  },

  'shoutem.notification-center.SegmentedControl': {
    container: {
      borderColor: resolveVariable('lineColor'),
      borderRadius: 4,
      borderWidth: 0.5,
      flexDirection: 'row',
      height: responsiveHeight(60),
      marginTop: responsiveHeight(16),
    },
    option: {
      borderRadius: 4,
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: responsiveWidth(8),
      marginVertical: responsiveHeight(8),
    },
    active: {
      backgroundColor: resolveVariable('secondaryButtonBackgroundColor'),
      flex: 1,
    },
    title: {
      alignSelf: 'center',
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        '700',
        resolveVariable('text.fontStyle'),
      ),
      fontWeight: resolveFontWeight('700'),
    },
    activeTitle: {
      color: resolveVariable('secondaryButtonTextColor'),
    },
    disabled: {
      backgroundColor: resolveVariable('searchInputBackgroundColor'),
    },
    textDisabled: {
      color: resolveVariable('text.color'),
    },
  },
});

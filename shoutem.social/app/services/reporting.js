import { Alert } from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const DEFAULT_ACTION_SHEET_OPTIONS = {
  tintColor: 'black',
  userInterfaceStyle: 'light',
};

// Report post
export function openReportPostActionSheet(onReportPress) {
  const options = [
    I18n.t(ext('reportOptionSpam')),
    I18n.t(ext('reportOptionInappropriate')),
    I18n.t(ext('reportOptionAbuse')),
    I18n.t(ext('reportOptionCancel')),
  ];

  ActionSheet.showActionSheetWithOptions(
    {
      ...DEFAULT_ACTION_SHEET_OPTIONS,
      options,
      cancelButtonIndex: options.indexOf(I18n.t(ext('reportOptionCancel'))),
      title: I18n.t(ext('reportActionSheetTitle')),
      message: I18n.t(ext('reportActionSheetMessage')),
    },
    index => {
      if (index >= 0 && index <= 2) {
        if (onReportPress) {
          return onReportPress();
        }

        return Alert.alert(
          I18n.t(ext('reportSuccessTitle')),
          I18n.t(ext('reportSuccessMessage')),
        );
      }

      return null;
    },
  );
}

// Block user and report post
export function openBlockAndReportActionSheet(onBlockPress) {
  const options = [
    I18n.t(ext('blockOption')),
    I18n.t(ext('reportPostOption')),
    I18n.t(ext('reportOptionCancel')),
  ];

  ActionSheet.showActionSheetWithOptions(
    {
      ...DEFAULT_ACTION_SHEET_OPTIONS,
      options,
      cancelButtonIndex: options.indexOf(I18n.t(ext('reportOptionCancel'))),
    },
    index => {
      if (index === 0) {
        onBlockPress();
      }

      if (index === 1) {
        openReportPostActionSheet();
      }
    },
  );
}

// Block and report user
export function openBlockActionSheet(onBlockPress, onReportPress = null) {
  const options = [
    I18n.t(ext('blockOption')),
    I18n.t(ext('reportOption')),
    I18n.t(ext('reportOptionCancel')),
  ];

  ActionSheet.showActionSheetWithOptions(
    {
      ...DEFAULT_ACTION_SHEET_OPTIONS,
      options,
      cancelButtonIndex: options.indexOf(I18n.t(ext('reportOptionCancel'))),
    },
    index => {
      if (index === 0) {
        return onBlockPress();
      }

      if (index === 1) {
        if (onReportPress) {
          return onReportPress();
        }

        return Alert.alert(
          I18n.t(ext('reportSuccessTitle')),
          I18n.t(ext('reportSuccessMessage')),
        );
      }

      return null;
    },
  );
}

// Unblock user
export function openUnblockActionSheet(onUnblockPress) {
  const options = [
    I18n.t(ext('unblockOption')),
    I18n.t(ext('unblockOptionCancel')),
  ];

  ActionSheet.showActionSheetWithOptions(
    {
      ...DEFAULT_ACTION_SHEET_OPTIONS,
      options,
      cancelButtonIndex: options.indexOf(I18n.t(ext('unblockOptionCancel'))),
    },
    index => {
      if (index === 0) {
        onUnblockPress();
      }
    },
  );
}

/**
 * Handles opening of block and report ActionSheet.
 *
 * @param isBlockAllowed Bool flag indicating if block ActionSheet should open
 * @param onBlockPress On press handler for block action
 * @param onReportPress On press handler for report action
 * @return Opens ActionSheet with appropriate values
 */
export function openBlockOrReportActionSheet(
  isBlockAllowed,
  onBlockPress = null,
  onReportPress = null,
) {
  if (isBlockAllowed && onBlockPress) {
    return openBlockAndReportActionSheet(onBlockPress);
  }

  return openReportPostActionSheet(onReportPress);
}

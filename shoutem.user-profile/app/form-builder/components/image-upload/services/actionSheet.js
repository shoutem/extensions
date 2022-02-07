import ActionSheet from 'react-native-action-sheet';

const DEFAULT_COLOR_OPTIONS = {
  tintColor: 'black',
  userInterfaceStyle: 'light',
};

export function openActionSheet(
  actionSheetOptions,
  actionSheetHandlers,
  colorOptions = DEFAULT_COLOR_OPTIONS,
) {
  return ActionSheet.showActionSheetWithOptions(
    {
      ...colorOptions,
      options: actionSheetOptions,
      destructiveButtonIndex: actionSheetOptions.length,
      cancelButtonIndex: actionSheetOptions.length,
    },
    index => {
      if (index === 0 || index === 1) {
        const actionSheetHandler = actionSheetHandlers[index];

        return actionSheetHandler();
      }

      return null;
    },
  );
}

import React, { useCallback, useLayoutEffect } from 'react';
import { Button, Icon } from '@shoutem/ui';
import { composeNavigationStyles } from 'shoutem.navigation';

/**
 * Custom hook for managing navigation options related to the radio screen.
 *
 * @param {object} options - Configuration options for the hook.
 * @property {object} navigation - React Navigation object for accessing navigation functions.
 * @property {boolean} isActiveStream - Indicates whether the radio is currently playing.
 * @property {boolean} isTimerActive - Indicates whether the sleep timer is active.
 * @property {boolean} showSharing - Indicates whether screen should display share option.
 * @property {function} setActionSheetActive - Function to set the visibility of the action sheet.
 * @property {object} style - Styles for UI components.
 */
export const useRadioNavigation = ({
  navigation,
  isActiveStream,
  isTimerActive,
  showSharing,
  setActionSheetActive,
  style,
}) => {
  const setActionSheetVisible = useCallback(
    () => setActionSheetActive(true),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const renderHeaderRight = useCallback(() => {
    const iconName = showSharing ? 'more-horizontal' : 'sleep';
    const iconFill =
      isTimerActive && !showSharing
        ? style.activeSleepIconFill
        : style.inactiveSleepIconFill;

    return (
      <Button
        disabled={!showSharing && !(isActiveStream || isTimerActive)}
        onPress={setActionSheetVisible}
        styleName="tight clear"
      >
        <Icon name={iconName} fill={iconFill} />
      </Button>
    );
  }, [
    isActiveStream,
    isTimerActive,
    setActionSheetVisible,
    showSharing,
    style,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      ...composeNavigationStyles(['clear']),
      headerRight: renderHeaderRight,
      title: '',
    });
  }, [navigation, renderHeaderRight]);
};

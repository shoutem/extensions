import React, { useCallback, useLayoutEffect } from 'react';
import { Button, Icon } from '@shoutem/ui';
import { composeNavigationStyles } from 'shoutem.navigation';

export function useRadioNavigation({
  navigation,
  isPlaying,
  isTimerActive,
  showSharing,
  setActionSheetActive,
  style,
}) {
  const setActionSheetVisible = useCallback(
    () => setActionSheetActive(true),
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
        disabled={!showSharing && !(isPlaying || isTimerActive)}
        onPress={setActionSheetVisible}
        styleName="tight clear"
      >
        <Icon name={iconName} fill={iconFill} />
      </Button>
    );
  }, [isPlaying, isTimerActive, setActionSheetVisible, showSharing, style]);

  useLayoutEffect(() => {
    navigation.setOptions({
      ...composeNavigationStyles(['clear']),
      headerRight: renderHeaderRight,
      title: '',
    });
  }, [navigation, renderHeaderRight]);
}

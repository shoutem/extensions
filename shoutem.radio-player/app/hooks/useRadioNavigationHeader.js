import React, { useCallback, useLayoutEffect } from 'react';
import { Button, Icon } from '@shoutem/ui';
import { composeNavigationStyles } from 'shoutem.navigation';

/**
 * Custom hook for resolving Radio navigation header & header right component - share button.
 *
 * @param {object} options - Configuration options for the hook.
 * @property {object} navigation - React Navigation object for accessing navigation functions.
 * @property {boolean} showSharing - Indicates whether screen should display share option.
 * @property {function} onSharePress - Share button press callback
 */
export const useRadioNavigationHeader = ({
  navigation,
  showSharing,
  onSharePress,
}) => {
  const renderHeaderRight = useCallback(() => {
    if (!showSharing) {
      return null;
    }

    return (
      <Button onPress={onSharePress} styleName="tight clear">
        <Icon name="share" />
      </Button>
    );
  }, [onSharePress, showSharing]);

  useLayoutEffect(() => {
    navigation.setOptions({
      ...composeNavigationStyles(['clear']),
      headerRight: renderHeaderRight,
      title: '',
    });
  }, [navigation, renderHeaderRight]);
};

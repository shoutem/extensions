import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { isAndroid, isWeb } from 'shoutem-core';
import { HeaderBackButton, HeaderCloseButton } from '../components';
import { closeModal, getModalScreens, goBack, HeaderStyles } from '../services';

const ModalStack = createStackNavigator();

function screenOptions(navigationProps) {
  const { navigation } = navigationProps;
  const state = navigation.getState();
  const LeftComponent = state.index < 1 ? HeaderCloseButton : HeaderBackButton;
  const onHeaderLeftPress = state.index < 1 ? closeModal : goBack;

  return {
    headerLeft: props => (
      <LeftComponent {...props} onPress={onHeaderLeftPress} />
    ),
    headerTitleAlign: 'center',
    ...HeaderStyles.noBorder,
    ...(isWeb && {
      cardStyle: { flex: 1 },
    }),
  };
}

export function ModalNavigator({ screens }) {
  const ModalComponents = _.map(getModalScreens(), screen => {
    const { name, component, initialParams = {}, ...otherProps } = screen;

    const resolvedComponent = component || screens[name];

    if (!resolvedComponent) {
      return null;
    }

    const screenId = _.uniqueId(name);

    return (
      <ModalStack.Screen
        name={name}
        component={resolvedComponent}
        initialParams={{ ...initialParams, screenId }}
        key={screenId}
        {...otherProps}
      />
    );
  });

  return (
    <ModalStack.Navigator
      screenOptions={screenOptions}
      // Disable optimization due to the issues with audio
      // banner rendering on Android
      detachInactiveScreens={!isAndroid}
    >
      {ModalComponents}
    </ModalStack.Navigator>
  );
}

ModalNavigator.propTypes = {
  screens: PropTypes.object.isRequired,
};

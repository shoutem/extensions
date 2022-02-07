import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HeaderBackButton, HeaderCloseButton } from '../components';
import { closeModal, getModalScreens, goBack, HeaderStyles } from '../services';

const ModalStack = createStackNavigator();

function screenOptions(navigationProps) {
  const { navigation } = navigationProps;
  const state = navigation.dangerouslyGetState();
  const LeftComponent = state.index < 1 ? HeaderCloseButton : HeaderBackButton;
  const onHeaderLeftPress = state.index < 1 ? closeModal : goBack;

  return {
    headerLeft: props => (
      <LeftComponent {...props} onPress={onHeaderLeftPress} />
    ),
    headerTitleAlign: 'center',
    ...HeaderStyles.noBorder,
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
    <ModalStack.Navigator screenOptions={screenOptions}>
      {ModalComponents}
    </ModalStack.Navigator>
  );
}

ModalNavigator.propTypes = {
  screens: PropTypes.object.isRequired,
};

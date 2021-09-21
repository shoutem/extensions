import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton, HeaderCloseButton } from '../components';
import { getModalScreens, closeModal, goBack, HeaderStyles } from '../services';

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

export function ModalNavigator({ decoratedScreens }) {
  const ModalComponents = _.map(getModalScreens(), screen => {
    const resolvedComponent = screen.component || decoratedScreens[screen.name];
    const screenOptions = screen.options || {};

    if (!resolvedComponent) {
      return null;
    }

    return (
      <ModalStack.Screen
        name={screen.name}
        component={resolvedComponent}
        options={screenOptions}
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
  decoratedScreens: PropTypes.object,
};

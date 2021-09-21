import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '../components';
import { NavigationStacks, HeaderStyles } from '../services';

export function CustomStack({ stackConfig }) {
  if (!stackConfig) {
    return null;
  }

  const NavigationStack =
    stackConfig.stack.NavigationStack || createStackNavigator();

  return (
    <NavigationStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerLeft: props => <HeaderBackButton {...props} />,
        ...HeaderStyles.default,
        ...stackConfig.stack.screenOptions,
      }}
      {...stackConfig.stack.navigatorOptions}
    >
      {_.map(stackConfig.stack.screens, screen => (
        <NavigationStack.Screen
          name={screen.name}
          key={screen.name}
          component={screen.component}
        />
      ))}
    </NavigationStack.Navigator>
  );
}

CustomStack.propTypes = {
  RootStack: PropTypes.node,
  stackConfig: PropTypes.object,
};

export function createCustomStackNavigators(RootStack) {
  const customStacks = NavigationStacks.getRegisteredStacks();

  if (_.isEmpty(customStacks)) {
    return [];
  }

  return _.map(customStacks, stackConfig => (
    <RootStack.Screen name={stackConfig.name} key={stackConfig.name}>
      {() => <CustomStack stackConfig={stackConfig} />}
    </RootStack.Screen>
  ));
}

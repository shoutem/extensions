import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HeaderBackButton } from '../components';
import { HeaderStyles, NavigationStacks } from '../services';

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

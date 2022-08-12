import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HeaderBackButton } from '../components';
import { HeaderStyles, NavigationStacks } from '../services';

export function CustomStack({ stackConfig, parentStackConfig }) {
  if (!stackConfig) {
    return null;
  }

  const NavigationStack =
    stackConfig.stack.NavigationStack || createStackNavigator();

  const defaultScreen = _.get(
    stackConfig,
    'stack.navigatorOptions.initialRouteName',
  );
  const firstScreen = _.get(stackConfig, 'stack.screens[0].name');
  const resolvedFirstRoute = defaultScreen || firstScreen;

  const parentScreenOptionsObject = _.get(
    parentStackConfig,
    'screenOptions',
    {},
  );
  const parentScreenOptionsFunction = _.get(
    parentStackConfig,
    'screenOptions',
    () => {},
  );
  const stackScreenOptionsFunction = _.get(
    stackConfig,
    'stack.screenOptions',
    () => {},
  );

  return (
    <NavigationStack.Navigator
      screenOptions={navProps => ({
        headerTitleAlign: 'center',
        headerLeft: props => <HeaderBackButton {...props} />,
        ...HeaderStyles.default,
        ...stackConfig.stack.screenOptions,
        ...(_.isFunction(stackScreenOptionsFunction) &&
          stackScreenOptionsFunction(navProps)),
        ...parentScreenOptionsObject,
        ...(_.isFunction(parentScreenOptionsFunction) &&
          parentScreenOptionsFunction(navProps)),
      })}
      {..._.get(parentStackConfig, 'navigatorOptions', {})}
      {...stackConfig.stack.navigatorOptions}
    >
      {_.map(stackConfig.stack.screens, screen => (
        <NavigationStack.Screen
          name={screen.name}
          key={screen.name}
          component={screen.component}
          initialParams={{
            isFirstScreen: resolvedFirstRoute === screen.name,
            screenId: _.uniqueId(screen.name),
          }}
        />
      ))}
    </NavigationStack.Navigator>
  );
}

CustomStack.propTypes = {
  parentStackConfig: PropTypes.object,
  stackConfig: PropTypes.object,
};

CustomStack.defaultProps = {
  parentStackConfig: {},
  stackConfig: {},
};

export function createRootCustomStackNavigators(RootStack, rootScreenOptions) {
  const customStacks = NavigationStacks.getRegisteredStacks();

  if (_.isEmpty(customStacks)) {
    return [];
  }

  const rootStacks = _.filter(customStacks, stack => stack.isRootStack);

  return _.map(rootStacks, stackConfig => (
    <RootStack.Screen
      name={stackConfig.name}
      key={stackConfig.name}
      options={rootScreenOptions}
    >
      {() => <CustomStack stackConfig={stackConfig} />}
    </RootStack.Screen>
  ));
}

export function createCustomStackNavigators(
  RootStack,
  parentStackConfig,
  rootScreenOptions,
) {
  const customStacks = NavigationStacks.getRegisteredStacks();

  if (_.isEmpty(customStacks)) {
    return [];
  }

  const stacks = _.filter(customStacks, stack => !stack.isRootStack);

  return _.map(stacks, stackConfig => (
    <RootStack.Screen
      name={stackConfig.name}
      key={stackConfig.name}
      options={rootScreenOptions}
    >
      {() => (
        <CustomStack
          stackConfig={stackConfig}
          parentStackConfig={parentStackConfig}
        />
      )}
    </RootStack.Screen>
  ));
}

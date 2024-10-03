import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { isWeb } from 'shoutem-core';
import { DRAWER, TAB_BAR } from '../const';
import { BackHandlerAndroid } from '../services';

export function withBackHandling(Component) {
  if (isWeb) {
    return Component;
  }

  const ResultComponent = ({ navigation, ...otherProps }) => {
    useFocusEffect(
      useCallback(() => {
        const currentNavState = navigation.getState();
        const parentNavigation = navigation.getParent();
        const rootNavigation = parentNavigation?.getParent();
        const rootNavState = rootNavigation?.getState();
        const parentState = parentNavigation?.getState();
        const rootIndex = _.get(rootNavState, 'index');
        const rootRouteName = _.get(rootNavState, `routes[${rootIndex}].name`);
        const parentIndexRoot = _.get(parentState, 'index') === 0;
        const currentIndexRoot = _.get(currentNavState, 'index') === 0;
        const isDrawerRoot =
          rootRouteName === DRAWER && parentIndexRoot && currentIndexRoot;
        const isTabBarRoot =
          rootRouteName === TAB_BAR && parentIndexRoot && currentIndexRoot;
        const isDrawerOrTabbarRoot = isDrawerRoot || isTabBarRoot;
        const isRoot = rootNavigation?.getParent() === undefined;
        const isGenericMainLayout = rootRouteName === 'root_stack';

        const onBackPress = () => {
          if (BackHandlerAndroid.isAlertDisplayed()) {
            return false;
          }

          if ((isRoot && isGenericMainLayout) || isDrawerOrTabbarRoot) {
            BackHandlerAndroid.displayAlert();
            return true;
          }

          return false;
        };

        BackHandlerAndroid.addListener(onBackPress);

        return () => BackHandlerAndroid.removeListener(onBackPress);
      }, [navigation]),
    );

    return <Component navigation={navigation} {...otherProps} />;
  };

  ResultComponent.propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  return ResultComponent;
}

import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { DRAWER, TAB_BAR } from '../const';
import { BackHandlerAndroid } from '../services';

export function withBackHandling(Component) {
  const ResultComponent = ({ navigation, ...otherProps }) => {
    useFocusEffect(
      useCallback(() => {
        const currentNavState = navigation.dangerouslyGetState();
        const parentNavigation = navigation.dangerouslyGetParent();
        const rootNavigation = parentNavigation?.dangerouslyGetParent();
        const rootNavState = rootNavigation?.dangerouslyGetState();
        const parentState = parentNavigation?.dangerouslyGetState();
        const rootIndex = _.get(rootNavState, 'index');
        const rootRouteName = _.get(rootNavState, `routes[${rootIndex}].name`);
        const parentIndexRoot = _.get(parentState, 'index') === 0;
        const currentIndexRoot = _.get(currentNavState, 'index') === 0;
        const isDrawerRoot =
          rootRouteName === DRAWER && parentIndexRoot && currentIndexRoot;
        const isTabBarRoot =
          rootRouteName === TAB_BAR && parentIndexRoot && currentIndexRoot;
        const isDrawerOrTabbarRoot = isDrawerRoot || isTabBarRoot;
        const isRoot = rootNavigation?.dangerouslyGetParent() === undefined;
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

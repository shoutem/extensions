import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useFocusEffect } from '@react-navigation/native';
import { DRAWER, TAB_BAR } from '../const';
import { BackHandlerAndroid } from '../services';

export function withBackHandling(Component) {
  const ResultComponent = ({ navigation, ...otherProps }) => {
    useFocusEffect(
      useCallback(() => {
        const parentNavigation = navigation.dangerouslyGetParent();
        const rootNavigation = parentNavigation?.dangerouslyGetParent();
        const rootNavState = rootNavigation?.dangerouslyGetState();
        const parentState = parentNavigation?.dangerouslyGetState();
        const rootIndex = _.get(rootNavState, 'index');
        const rootRouteName = _.get(rootNavState, `routes[${rootIndex}].name`);
        const parentIndexRoot = _.get(parentState, 'index') === 0;
        const isDrawerRoot = rootRouteName === DRAWER && parentIndexRoot;
        const isTabBarRoot = rootRouteName === TAB_BAR && parentIndexRoot;
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
      }, []),
    );

    return <Component navigation={navigation} {...otherProps} />;
  };

  ResultComponent.propTypes = {
    navigation: PropTypes.object,
  };

  return ResultComponent;
}

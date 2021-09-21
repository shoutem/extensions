import React, { useCallback } from 'react';
import { BackHandler, ToastAndroid } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useFocusEffect } from '@react-navigation/native';
import { I18n } from 'shoutem.i18n';
import { ext, DRAWER, TAB_BAR } from '../const';

const ALLOW_EXIT_DURATION = 3000;

export function withBackHandling(Component) {
  const ResultComponent = ({ navigation, ...otherProps }) => {
    let exitAlertDisplayed = false;

    const displayExitAlert = () => {
      exitAlertDisplayed = true;
      ToastAndroid.show(I18n.t(ext('androidExitMessage')), ToastAndroid.LONG);
      setTimeout(() => {
        exitAlertDisplayed = false;
      }, ALLOW_EXIT_DURATION);
    };

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
          if (exitAlertDisplayed) {
            return false;
          }

          if ((isRoot && isGenericMainLayout) || isDrawerOrTabbarRoot) {
            displayExitAlert();
            return true;
          }

          return false;
        };

        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () =>
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, []),
    );

    return <Component navigation={navigation} {...otherProps} />;
  };

  ResultComponent.propTypes = {
    navigation: PropTypes.object,
  };

  return ResultComponent;
}

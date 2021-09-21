import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Screen } from '@shoutem/ui';
import { getFirstShortcut } from 'shoutem.application/shared/getFirstShortcut';
import { HeaderBackground } from '../components';
import { mapExtensionSettingsToProps } from '../redux';
import { getRouteParams } from '../services';
import { withChildrenRequired } from './withChildrenRequired';

export function withSubNavigationScreen(Component) {
  class FolderBaseScreen extends PureComponent {
    static propTypes = {
      firstShortcut: PropTypes.object,
      shortcut: PropTypes.object,
      navigationBarImage: PropTypes.string,
      backgroundImageEnabledFirstScreen: PropTypes.bool,
      showTitle: PropTypes.bool,
      fitContainer: PropTypes.bool,
    };

    constructor(props) {
      super(props);

      this.isRootScreen = props.firstShortcut === props.shortcut;
    }

    componentDidMount() {
      const {
        navigation,
        navigationBarImage,
        backgroundImageEnabledFirstScreen,
        fitContainer,
        showTitle,
        shortcut,
      } = this.props;

      const { isRootScreen } = getRouteParams(this.props);

      const shouldDisplayImage =
        backgroundImageEnabledFirstScreen && navigationBarImage && isRootScreen;

      if (!shouldDisplayImage) {
        return;
      }

      const resolvedTitle = showTitle ? _.get(shortcut, 'title', '') : '';

      navigation.setOptions({
        headerBackground: () => (
          <HeaderBackground
            settings={{
              backgroundImage: navigationBarImage,
              backgroundImageEnabledFirstScreen,
              fitContainer,
              showTitle,
            }}
            alwaysShow
          />
        ),
        title: resolvedTitle,
      });
    }

    resolveScreenProps() {
      const { isRootScreen, styleName } = this.props;

      return {
        // Main Navigation Screens does not have NavigationBar, so when Folder screen is Main
        // navigation screen (and has no NavigationBar) stretch screen.
        styleName: isRootScreen ? `${styleName} full-screen` : styleName,
      };
    }

    render() {
      return (
        <Screen {...this.resolveScreenProps()}>
          <Component {...this.props} />
        </Screen>
      );
    }
  }

  const mapStateToProps = state => ({
    firstShortcut: getFirstShortcut(state),
    ...mapExtensionSettingsToProps(state),
  });

  return withChildrenRequired(connect(mapStateToProps)(FolderBaseScreen));
}

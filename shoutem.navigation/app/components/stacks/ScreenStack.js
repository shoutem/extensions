import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isEmptyNavigationState, isEmptyRoute, navigateBack } from '../../redux/core';
import { CardStack, NavigationBar } from '../ui';

export class ScreenStack extends PureComponent {
  static propTypes = {
    ...CardStack.propTypes,
    defaultNavigateBack: PropTypes.func,
  };

  static contextTypes = {
    screens: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    this.renderNavBar = this.renderNavBar.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.handleNavigateBack = this.handleNavigateBack.bind(this);
  }

  getScreen(screenName) {
    return this.context.screens[screenName];
  }

  // We need the outer function because the back button will pass
  // the event argument as the first argument of the onNavigateBack
  // handler. The first argument of our onNavigateBack should be the
  // navigation stack, so this allows us to use the default value by
  // omitting that argument.
  handleNavigateBack() {
    const { onNavigateBack, defaultNavigateBack } = this.props;
    onNavigateBack ? onNavigateBack() : defaultNavigateBack();
  }

  renderNavBar(props) {
    if (isEmptyRoute(props.scene.route)) {
      return null;
    }

    return (
      <NavigationBar.View
        onNavigateBack={this.handleNavigateBack}
        {...props}
      />
    );
  }

  renderScene(props) {
    const { route } = props.scene;

    if (isEmptyRoute(route)) {
      return null;
    }

    const Screen = this.getScreen(route.screen);

    if (!Screen) {
      const errorMessage = `You are trying to navigate to screen (${route.screen}) ` +
        'that doesn\'t exist. Check the exports of your extension or the route ' +
        'you are trying to navigate to.';

      // We use console.error instead of throwing an error because the latter shows
      // a "unhandled promise rejection" message, which is not very helpful
      console.error(errorMessage);

      return null;
    }

    // virtual prop is added here so that we can pass down
    // style from the parent component in case the screen is
    // connected to the theme, see `shoutem.ui.CardStack.sceneContainer`.
    return (
      <Screen virtual {...route.props} screenId={route.key} />
    );
  }

  render() {
    const { navigationState } = this.props;

    if (isEmptyNavigationState(navigationState)) {
      // We don't want to render anything for the empty navigation state.
      return null;
    }

    return (
      <CardStack
        {...this.props}
        renderNavBar={this.renderNavBar}
        renderScene={this.renderScene}
      />
    );
  }
}

const mapDispatchToProps = { defaultNavigateBack: navigateBack };

export default connect(undefined, mapDispatchToProps)(ScreenStack);

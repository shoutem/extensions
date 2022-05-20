import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FadeIn, TimingDriver } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, View } from '@shoutem/ui';
import { ext } from '../const';

class NavigationToolbar extends PureComponent {
  constructor(props) {
    super(props);

    this.driver = new TimingDriver({
      duration: 450,
    });
  }

  componentDidMount() {
    this.driver.toValue(1);
  }

  render() {
    const { goBack, goForward, reload, webNavigationState } = this.props;

    const backIconStyle = !webNavigationState.canGoBack ? 'disabled' : null;
    const forwardIconStyle = !webNavigationState.canGoForward
      ? 'disabled'
      : null;

    return (
      <FadeIn driver={this.driver}>
        <View styleName="container">
          <View styleName="navigation-buttons">
            <Button onPress={goBack} styleName="clear">
              <Icon name="left-arrow" styleName={backIconStyle} />
            </Button>
            <Button onPress={goForward} styleName="clear">
              <Icon name="right-arrow" styleName={forwardIconStyle} />
            </Button>
          </View>
          <View styleName="vertical v-center h-center">
            <Button onPress={reload} styleName="clear">
              <Icon name="refresh" />
            </Button>
          </View>
        </View>
      </FadeIn>
    );
  }
}

NavigationToolbar.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  webNavigationState: PropTypes.object.isRequired,
};

export default connectStyle(ext('NavigationToolbar'))(NavigationToolbar);

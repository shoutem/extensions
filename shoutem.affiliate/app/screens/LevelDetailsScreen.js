import React, { PureComponent } from 'react';
import { LayoutAnimation } from 'react-native';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Screen, ScrollView, SimpleHtml } from '@shoutem/ui';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { ext } from '../const';

export class LevelDetailsScreen extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    const shouldHideInitialHeader = this.isNavigationBarClear(props);
    props.navigation.setOptions({ headerShown: shouldHideInitialHeader });
  }

  componentDidMount() {
    const { navigation } = this.props;
    const { level } = getRouteParams(this.props);

    LayoutAnimation.easeInEaseOut();

    navigation.setOptions({
      headerShown: true,
      title: level.title,
      ...this.getNavBarProps(),
    });
  }

  isNavigationBarClear() {
    const { screenSettings } = getRouteParams(this.props);

    return screenSettings.navigationBarStyle === 'clear';
  }

  getNavBarProps() {
    const { level } = getRouteParams(this.props);

    if (this.isNavigationBarClear()) {
      const style = level.image ? ['clear', 'fade'] : ['boxing'];

      return {
        ...composeNavigationStyles(style),
      };
    }

    return null;
  }

  render() {
    const { level, screenSettings } = getRouteParams(this.props);
    const imageSize = `lg-gutter-bottom ${screenSettings.imageSize || 'large'}`;

    return (
      <Screen>
        <ScrollView>
          <Image
            styleName={imageSize}
            source={{ uri: level.image?.url || '' }}
          />
          <SimpleHtml body={level.description} />
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('LevelDetailsScreen'))(LevelDetailsScreen);

import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { StatusBar, Platform } from 'react-native';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import { ImageGallery, Screen } from '@shoutem/ui';
import { ext } from '../const';

class PhotoFullScreen extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    navigateBack: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      mode: ImageGallery.IMAGE_GALLERY_MODE,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavbarProps());
  }

  componentDidUpdate() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavbarProps());
  }

  getNavbarProps() {
    const { mode } = this.state;
    const {
      photo: { name },
    } = getRouteParams(this.props);

    if (mode === ImageGallery.IMAGE_PREVIEW_MODE) {
      return {
        headerShown: false,
        title: '',
      };
    }

    return {
      ...composeNavigationStyles(['clear']),
      headerShown: true,
      title: name,
    };
  }

  handleGalleryModeChange(newMode) {
    const { mode } = this.state;

    if (Platform.OS === 'ios') {
      const isHidden = newMode === ImageGallery.IMAGE_PREVIEW_MODE;
      StatusBar.setHidden(isHidden, 'fade');
    }

    if (newMode !== mode) {
      this.setState({ mode: newMode });
    }
  }

  render() {
    const { photo } = getRouteParams(this.props);

    return (
      <Screen styleName="paper full-screen">
        <ImageGallery
          data={[photo]}
          onModeChanged={this.handleGalleryModeChange}
          selectedIndex={0}
        />
      </Screen>
    );
  }
}

export default connectStyle(ext('PhotoFullScreen'))(PhotoFullScreen);

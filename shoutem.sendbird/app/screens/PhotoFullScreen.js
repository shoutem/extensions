import React, { PureComponent } from 'react';
import { StatusBar } from 'react-native';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ImageGallery, Screen } from '@shoutem/ui';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { isIos } from 'shoutem-core';
import { ext } from '../const';

class PhotoFullScreen extends PureComponent {
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

    if (isIos) {
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

PhotoFullScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connectStyle(ext('PhotoFullScreen'))(PhotoFullScreen);

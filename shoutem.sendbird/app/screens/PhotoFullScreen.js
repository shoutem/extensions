import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import { StatusBar, Platform } from 'react-native';
import { NavigationBar } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import { ImageGallery, Screen } from '@shoutem/ui';
import { ext } from '../const';

class PhotoFullScreen extends PureComponent {
  static propTypes = {
    photo: PropTypes.object.isRequired,
    navigateBack: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      mode: ImageGallery.IMAGE_GALLERY_MODE,
    };
  }

  getNavbarProps() {
    const { mode } = this.state;
    const { photo: { name } } = this.props;

    if (mode === ImageGallery.IMAGE_PREVIEW_MODE) {
      return {
        styleName: 'clear none',
      };
    }

    return {
      styleName: 'clear',
      title: name,
    };
  }

  handleGalleryModeChange(newMode) {
    const { mode } = this.state;

    if (Platform.OS === 'ios') {
      const isHidden = (newMode === ImageGallery.IMAGE_PREVIEW_MODE);
      StatusBar.setHidden(isHidden, 'fade');
    }

    if (newMode !== mode) {
      this.setState({ mode: newMode });
    }
  }

  render() {
    const { photo } = this.props;

    return (
      <Screen styleName="paper full-screen">
        <NavigationBar {...this.getNavbarProps()} />
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

import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { StatusBar, Platform } from 'react-native';
import { NavigationBar } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import { ImageGallery, Screen, ImageGalleryOverlay } from '@shoutem/ui';
import { ext } from '../const';

function calculateStartingIndex(photo, photos) {
  return _.findIndex(photos, ['id', photo.id]) || 0;
}

function renderImageOverlay(imageData) {
  return (
    <ImageGalleryOverlay
      description={imageData.description}
      styleName="full-screen"
      title={imageData.title}
    />
  );
}

class PhotoDetailsScreen extends PureComponent {
  static propTypes = {
    photos: PropTypes.array,
    photo: PropTypes.object.isRequired,
    navigateBack: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBind(this);

    const { photo, photos } = props;

    this.state = {
      mode: ImageGallery.IMAGE_GALLERY_MODE,
      selectedPhotoIndex: calculateStartingIndex(photo, photos),
    };
  }

  componentDidMount() {
    const { photo, photos } = this.props;

    const selectedPhotoIndex = _.findIndex(photos, ['id', photo.id]) || 0;

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      selectedPhotoIndex,
    });
  }

  onBackButton() {
    const { navigateBack } = this.props;

    navigateBack();
  }

  getNavbarProps() {
    const { selectedPhotoIndex, mode } = this.state;
    const { photos } = this.props;

    if (mode === ImageGallery.IMAGE_PREVIEW_MODE) {
      return {
        styleName: 'clear none',
      };
    }

    const selectedPhoto = photos[selectedPhotoIndex];

    return {
      styleName: 'clear',
      title: `${selectedPhotoIndex + 1} / ${photos.length}`,
      share: {
        title: _.get(selectedPhoto, 'title'),
        link: _.get(selectedPhoto, 'source.uri'),
      },
    };
  }

  handleIndexSelected(index) {
    this.setState({ selectedPhotoIndex: index });
  }

  handleImageGalleryModeChange(newMode) {
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
    const { selectedPhotoIndex } = this.state;
    const { photos } = this.props;

    return (
      <Screen styleName="paper">
        <NavigationBar {...this.getNavbarProps()} />
        <ImageGallery
          data={photos}
          onIndexSelected={this.handleIndexSelected}
          onModeChanged={this.handleImageGalleryModeChange}
          renderImageOverlay={renderImageOverlay}
          selectedIndex={selectedPhotoIndex}
        />
      </Screen>
    );
  }
}

export default connectStyle(ext('PhotoDetailsScreen'))(PhotoDetailsScreen);

import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { StatusBar, Platform } from 'react-native';
import {
  composeNavigationStyles,
  getRouteParams,
  HeaderCloseButton,
} from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import {
  ImageGallery,
  Screen,
  ImageGalleryOverlay,
  ShareButton,
} from '@shoutem/ui';
import { ext } from '../const';

function calculateStartingIndex(photo, photos) {
  const id = _.get(photo, 'id');

  return _.findIndex(photos, { id }) || 0;
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
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    autoBind(this);

    const { photo, photos } = getRouteParams(props);

    this.state = {
      mode: ImageGallery.IMAGE_GALLERY_MODE,
      selectedPhotoIndex: calculateStartingIndex(photo, photos),
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const { photo, photos } = getRouteParams(this.props);
    const id = _.get(photo, 'id');

    const selectedPhotoIndex = _.findIndex(photos, { id }) || 0;

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ selectedPhotoIndex });
    navigation.setOptions(this.getNavbarProps(selectedPhotoIndex));
  }

  componentDidUpdate() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavbarProps());
  }

  getNavbarProps(selectedPhotoIndex) {
    const { selectedPhotoIndex: selectedPhotoIndexState, mode } = this.state;
    const resolvedSelectedPhotoIndex =
      selectedPhotoIndex || selectedPhotoIndexState;

    if (mode === ImageGallery.IMAGE_PREVIEW_MODE) {
      return {
        ...composeNavigationStyles(['clear']),
        headerLeft: null,
        title: '',
      };
    }

    const { photos } = getRouteParams(this.props);
    const selectedPhoto = photos[resolvedSelectedPhotoIndex];

    return {
      ...composeNavigationStyles(['clear']),
      headerLeft: HeaderCloseButton,
      headerRight: this.renderShare(selectedPhoto),

      title: `${resolvedSelectedPhotoIndex + 1} / ${photos.length}`,
    };
  }

  renderShare(selectedPhoto) {
    const title = _.get(selectedPhoto, 'title');
    const link = _.get(selectedPhoto, 'source.uri');

    if (!link) {
      return null;
    }

    return props => (
      <ShareButton
        styleName="clear"
        title={title}
        url={link}
        iconProps={{ style: props.tintColor }}
      />
    );
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
    const { photos } = getRouteParams(this.props);

    return (
      <Screen styleName="paper">
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

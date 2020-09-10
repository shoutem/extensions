import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Platform, StatusBar, Alert } from 'react-native';
import autoBind from 'auto-bind';
import { connect } from 'react-redux';
import { isBusy, isValid } from '@shoutem/redux-io';
import {
  Screen,
  ImageGallery,
  ImageGalleryOverlay,
  View,
  Spinner,
} from '@shoutem/ui';
import { NavigationBar, closeModal } from 'shoutem.navigation';
import { I18n } from 'shoutem.i18n';
import { ext as rssExt } from 'shoutem.rss';
import { getPhotosFeed } from '../redux';
import { remapAndFilterPhotos } from '../services';

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

class PhotoDetails extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    closeModal: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      photos: [],
      mode: null,
      selectedPhotoIndex: null,
    };
  }

  componentDidMount() {
    const { photos, photo, photoNotFound } = this.props;

    if (photoNotFound) {
      this.handleItemNotFound();
    }

    if (photo) {
      this.setState({
        photos,
        mode: ImageGallery.IMAGE_GALLERY_MODE,
        selectedPhotoIndex: calculateStartingIndex(photo, photos),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data, photoNotFound } = this.props;
    const {
      data: nextData,
      photos: nextPhotos,
      photo: nextPhoto,
      photoNotFound: nextPhotoNotFound,
    } = nextProps;

    if (!photoNotFound && nextPhotoNotFound) {
      this.handleItemNotFound();
    }

    if (nextPhoto && nextData !== data) {
      this.setState({
        photos: nextPhotos,
        mode: ImageGallery.IMAGE_GALLERY_MODE,
        selectedPhotoIndex: calculateStartingIndex(nextPhoto, nextPhotos),
      });
    }
  }

  handleItemNotFound() {
    const { closeModal } = this.props;

    const okButton = {
      onPress: () => closeModal(),
    };

    return Alert.alert(
      I18n.t(rssExt('itemNotFoundTitle')),
      I18n.t(rssExt('itemNotFoundMessage')),
      [okButton],
    );
  }

  getNavbarProps() {
    const { selectedPhotoIndex, mode, photos } = this.state;

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
    const { data, photoNotFound } = this.props;
    const { selectedPhotoIndex, photos } = this.state;

    const loading = isBusy(data) || photoNotFound;

    return (
      <Screen styleName="paper full-screen">
        <NavigationBar {...this.getNavbarProps()} />
        {loading && (
          <View styleName="flexible vertical h-center v-center">
            <Spinner />
          </View>
        )}
        {!loading && (
          <ImageGallery
            data={photos}
            onIndexSelected={this.handleIndexSelected}
            onModeChanged={this.handleImageGalleryModeChange}
            renderImageOverlay={renderImageOverlay}
            selectedIndex={selectedPhotoIndex}
          />
        )}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { id, feedUrl } = ownProps;

  const data = getPhotosFeed(state, feedUrl);
  const photos = remapAndFilterPhotos(data);
  const photo = _.find(photos, { id });
  const photoNotFound = isValid(data) && !photo;

  return {
    data,
    photos,
    photo,
    photoNotFound,
  };
};

export const mapDispatchToProps = { closeModal };

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetails);

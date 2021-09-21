import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Platform, StatusBar, Alert } from 'react-native';
import { connect } from 'react-redux';
import { isBusy, isValid } from '@shoutem/redux-io';
import {
  Screen,
  ImageGallery,
  ImageGalleryOverlay,
  View,
  Spinner,
  ShareButton,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { closeModal, HeaderStyles, getRouteParams } from 'shoutem.navigation';
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
    navigation: PropTypes.object.isRequired,
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
    const { photos, photo, photoNotFound, navigation } = this.props;

    navigation.setOptions(this.getNavbarProps());

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

  componentDidUpdate(prevProps, prevState) {
    const {
      selectedPhotoIndex: prevSelectedPhotoIndex,
      photos: prevPhotosState,
    } = prevState;
    const { selectedPhotoIndex, photos: photosState } = this.state;

    const { data, photos, photo, photoNotFound, navigation } = this.props;
    const { data: prevData, photoNotFound: prevPhotoNotFound } = prevProps;

    if (!prevPhotoNotFound && photoNotFound) {
      this.handleItemNotFound();
    }

    if (photo && prevData !== data) {
      this.setState(
        {
          photos,
          mode: ImageGallery.IMAGE_GALLERY_MODE,
          selectedPhotoIndex: calculateStartingIndex(photo, photos),
        },
        () => navigation.setOptions(this.getNavbarProps()),
      );
    }

    if (
      prevSelectedPhotoIndex !== selectedPhotoIndex ||
      prevPhotosState !== photosState
    ) {
      navigation.setOptions(this.getNavbarProps());
    }
  }

  handleItemNotFound() {
    const okButton = {
      onPress: closeModal,
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
        ...HeaderStyles.clear,
        title: '',
      };
    }

    const selectedPhoto = photos[selectedPhotoIndex];
    const title = _.get(selectedPhoto, 'title');
    const link = _.get(selectedPhoto, 'source.uri');

    return {
      headerRight: props => (
        <ShareButton
          styleName="clear"
          iconProps={{ style: props.tintColor }}
          title={title}
          url={link}
        />
      ),
      ...HeaderStyles.clear,
      title: `${selectedPhotoIndex + 1} / ${photos.length}`,
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
      <Screen styleName="paper">
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
  const { id, feedUrl } = getRouteParams(ownProps);

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

export default connect(mapStateToProps, null)(PhotoDetails);

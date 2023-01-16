import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Platform, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { isBusy, isValid } from '@shoutem/redux-io';
import {
  ImageGallery,
  ImageGalleryOverlay,
  Screen,
  ShareButton,
  Spinner,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { closeModal, HeaderStyles } from 'shoutem.navigation';
import { ext as rssExt } from 'shoutem.rss';
import { getPhotosFeed } from '../redux';
import { remapAndFilterPhotos } from '../services';

function calculateStartingIndex(photo, photos) {
  return _.findIndex(photos, ['id', photo.id]) || 0;
}

function handleItemNotFound() {
  return Alert.alert(
    I18n.t(rssExt('itemNotFoundTitle')),
    I18n.t(rssExt('itemNotFoundMessage')),
    [
      {
        onPress: closeModal,
      },
    ],
  );
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

export default function PhotoDetails({
  route: {
    params: { id, feedUrl },
  },
  navigation,
}) {
  const data = useSelector(state => getPhotosFeed(state, feedUrl));

  const photos = useMemo(() => remapAndFilterPhotos(data), [data]);
  const photo = useMemo(() => _.find(photos, { id }), [photos, id]);

  const [mode, setMode] = useState(ImageGallery.IMAGE_PREVIEW_MODE);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(
    calculateStartingIndex(photo, photos),
  );

  useLayoutEffect(() => {
    if (mode === ImageGallery.IMAGE_PREVIEW_MODE) {
      navigation.setOptions({
        ...HeaderStyles.clear,
        title: '',
      });
    }

    const selectedPhoto = photos[selectedPhotoIndex];
    const title = _.get(selectedPhoto, 'title');
    const link = _.get(selectedPhoto, 'source.uri');

    navigation.setOptions({
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
    });
  }, [mode, navigation, photos, selectedPhotoIndex]);

  useEffect(() => {
    if (photoNotFound) {
      handleItemNotFound();
    }

    if (photo) {
      setSelectedPhotoIndex(calculateStartingIndex(photo, photos));
    }
  }, [photo, photos, photoNotFound]);

  const photoNotFound = useMemo(() => isValid(data) && !photo, [data, photo]);
  const loading = useMemo(() => isBusy(data) || photoNotFound, [
    data,
    photoNotFound,
  ]);

  function handleImageGalleryModeChange(newMode) {
    if (Platform.OS === 'ios') {
      const isHidden = newMode === ImageGallery.IMAGE_PREVIEW_MODE;
      StatusBar.setHidden(isHidden, 'fade');
    }

    if (newMode !== mode) {
      setMode(newMode);
    }
  }

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
          onIndexSelected={setSelectedPhotoIndex}
          onModeChanged={handleImageGalleryModeChange}
          renderImageOverlay={renderImageOverlay}
          selectedIndex={selectedPhotoIndex}
        />
      )}
    </Screen>
  );
}

PhotoDetails.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Image } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ListView, TouchableOpacity } from '@shoutem/ui';
import { ext } from '../const';
import { attachmentService } from '../services';

function RecentImages({ onImageSelected, style }) {
  const appState = useRef('active');

  const [images, setImages] = useState([]);
  const [galleryPagination, setGalleryPagination] = useState({});

  useEffect(() => {
    getPhotosInitial();
  }, [getPhotosInitial]);

  useEffect(() => {
    // We need to load photos again after user returns to app
    // in case user added/deleted photos
    const appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState === 'active' && appState.current === 'background') {
          getPhotosInitial();
        }

        appState.current = nextAppState;
      },
    );

    return appStateSubscription.remove;
  }, [getPhotosInitial]);

  const getPhotosInitial = useCallback(() => {
    CameraRoll.getPhotos(attachmentService.CAMERAROLL_OPTIONS)
      .then(res => {
        const imageObjects = _.map(res.edges, data => data.node.image);

        setImages(imageObjects);

        setGalleryPagination({
          hasNextPage: res.page_info.has_next_page,
          after: res.page_info.end_cursor,
        });
      })
      .catch(() => null);
  }, []);

  const loadNextPhotosPage = useCallback(() => {
    if (galleryPagination.hasNextPage === false) {
      return;
    }

    CameraRoll.getPhotos({
      ...attachmentService.CAMERAROLL_OPTIONS,
      ...galleryPagination,
    })
      .then(res => {
        const imageObjects = _.map(res.edges, data => data.node.image);

        setImages(prevImages => setImages([...prevImages, ...imageObjects]));

        setGalleryPagination({
          hasNextPage: res.page_info.has_next_page,
          after: res.page_info.end_cursor,
        });
      })
      .catch(() => null);
  }, [galleryPagination]);

  const handleImageSelected = useCallback(
    image => {
      onImageSelected({ uri: image.uri }, true);
    },
    [onImageSelected],
  );

  const renderRow = useCallback(
    image => (
      <TouchableOpacity onPress={() => handleImageSelected(image)}>
        <Image style={style.image} source={image} />
      </TouchableOpacity>
    ),
    [handleImageSelected, style.image],
  );

  return (
    <ListView
      data={images}
      horizontal
      ListEmptyComponent={null}
      renderRow={renderRow}
      showsHorizontalScrollIndicator={false}
      style={style.recentImagesList}
      onLoadMore={loadNextPhotosPage}
      onLoadMoreThreshold={0.2}
    />
  );
}

RecentImages.propTypes = {
  onImageSelected: PropTypes.func.isRequired,
  style: PropTypes.object,
};

RecentImages.defaultProps = {
  style: {},
};

export default connectStyle(ext('RecentImages'))(RecentImages);

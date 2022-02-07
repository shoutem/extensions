import React, { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  HorizontalPager,
  Icon,
  ImageBackground,
  PageIndicators,
  Spinner,
  Text,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../../const';

export function ImageCarousel({
  images,
  isCircular,
  maxItems,
  onImagesChange,
  onAddImage,
  style,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isLoading, setLoading] = useState(false);

  const isScrollable = useMemo(() => _.size(images) > 1, [images]);
  const setLoadingFalse = useCallback(() => setLoading(false), []);

  function handleRemoveImage() {
    const newImages = [...images];
    newImages.splice(currentIndex, 1);

    return onImagesChange(newImages);
  }

  function handleRemoveButtonPress() {
    Alert.alert(
      I18n.t(ext('removeItemTitle')),
      I18n.t(ext('removeItemMessage')),
      [
        {
          text: I18n.t(ext('cancel')),
          style: 'cancel',
        },
        { text: I18n.t(ext('confirm')), onPress: handleRemoveImage },
      ],
      { cancelable: true },
    );
  }

  function renderOverlay() {
    if (!isScrollable) {
      return null;
    }

    const paginationText = `${currentIndex + 1}/${images.length}`;

    return (
      <View styleName="horizontal h-center" style={style.overlayContainer}>
        <Text style={style.overlayText}>{paginationText}</Text>
        <PageIndicators
          activeIndex={currentIndex}
          count={images.length}
          style={style.pageIndicators}
        />
      </View>
    );
  }

  function renderItem(image) {
    const resolvedStyle = [
      style.image,
      isLoading ? style.imageGalleryHidden : style.imageGalleryShown,
      isCircular && style.roundedImageContainer,
    ];
    const resolvedImageStyle = [isCircular && style.roundedImage];

    return (
      <>
        {isLoading && (
          <View
            styleName="vertical h-center v-center"
            style={style.loadingContainer}
          >
            <Spinner />
          </View>
        )}
        <ImageBackground
          style={resolvedStyle}
          imageStyle={resolvedImageStyle}
          source={{ uri: image.uri }}
          onLoadEnd={setLoadingFalse}
        />
      </>
    );
  }

  const imageData = _.map(images, image =>
    image?.uri ? image : { uri: image },
  );

  const showAddMorePhotosButton = useMemo(() => images.length < maxItems, [
    images,
    maxItems,
  ]);

  return (
    <View style={style.container}>
      <View style={style.galleryContainer}>
        <HorizontalPager
          data={imageData}
          onIndexSelected={setCurrentIndex}
          renderPage={renderItem}
          renderOverlay={renderOverlay}
          selectedIndex={currentIndex}
          scrollEnabled={isScrollable}
        />
        <Button onPress={handleRemoveButtonPress} style={style.carouselButton}>
          <Icon name="close" style={style.carouselIcon} />
        </Button>
      </View>
      {showAddMorePhotosButton && (
        <Button style={style.uploadButton} onPress={onAddImage}>
          <Text style={style.uploadText}>{I18n.t(ext('addMorePhotos'))}</Text>
        </Button>
      )}
    </View>
  );
}

ImageCarousel.propTypes = {
  images: PropTypes.array.isRequired,
  maxItems: PropTypes.number.isRequired,
  onAddImage: PropTypes.func.isRequired,
  isCircular: PropTypes.bool,
  style: PropTypes.object,
  onImagesChange: PropTypes.func,
};

ImageCarousel.defaultProps = {
  style: {},
  isCircular: false,
  onImagesChange: null,
};

export default connectStyle(ext('ImageCarousel'))(ImageCarousel);

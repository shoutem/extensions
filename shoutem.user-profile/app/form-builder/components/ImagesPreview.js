import React, { useCallback, useMemo, useState } from 'react';
import { Modal } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  EmptyStateView,
  HorizontalPager,
  ImageBackground,
  ImageGallery,
  PageIndicators,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { HeaderCloseButton } from 'shoutem.navigation';
import { ext } from '../../const';
import { SHAPE_VALUES, SHAPES } from './image-upload/const';

export function ImagesPreview({
  value: images,
  label,
  showLabel,
  style,
  variant: shape,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullScreenVisible, setFullScreenVisible] = useState(false);

  // Backward compatibility for when we were saving images as a single string
  const resolvedImages = useMemo(
    () => (_.isArray(images) ? images : [images]),
    [images],
  );

  const isCircularImage = shape === SHAPES.CIRCLE;
  const isScrollable = _.size(resolvedImages) > 1;

  const imageData = useMemo(
    () => resolvedImages.map(image => ({ uri: image })),
    [resolvedImages],
  );
  const imageSourceData = useMemo(
    () => resolvedImages.map(image => ({ source: { uri: image } })),
    [resolvedImages],
  );

  const currentImageText = useMemo(
    () => `${currentIndex + 1} / ${resolvedImages.length}`,
    [resolvedImages.length, currentIndex],
  );

  const toggleFullScreenVisible = useCallback(
    () => setFullScreenVisible(prevVisible => !prevVisible),
    [setFullScreenVisible],
  );

  function renderFullScreenPreview() {
    return (
      <Modal visible={fullScreenVisible} transparent>
        <View style={style.galleryHeaderContainer}>
          <HeaderCloseButton
            onPress={toggleFullScreenVisible}
            tintColor={style.closeGalleryIcon}
          />
          <Text style={style.galleryHeaderTitle}>{currentImageText}</Text>
        </View>
        <ImageGallery
          style={style.imageGallery}
          data={imageSourceData}
          onIndexSelected={setCurrentIndex}
          selectedIndex={currentIndex}
        />
      </Modal>
    );
  }

  function renderItem(image) {
    const resolvedImageContainerStyle = [
      style.imageContainer,
      isCircularImage && style.roundedImageContainer,
    ];
    const resolvedImageStyle = [isCircularImage && style.roundedImage];

    return (
      <TouchableOpacity
        disabled={isCircularImage}
        onPress={toggleFullScreenVisible}
      >
        <ImageBackground
          style={resolvedImageContainerStyle}
          imageStyle={resolvedImageStyle}
          source={{ uri: image.uri }}
        />
      </TouchableOpacity>
    );
  }

  function renderOverlay() {
    if (!isScrollable) {
      return null;
    }

    return (
      <View styleName="horizontal h-center" style={style.overlayContainer}>
        <Text style={style.overlayText}>{currentImageText}</Text>
        <PageIndicators
          activeIndex={currentIndex}
          count={images.length}
          style={style.pageIndicators}
        />
      </View>
    );
  }

  return (
    <>
      <View styleName="md-gutter-horizontal sm-gutter-top">
        {showLabel && <Text style={style.label}>{label}</Text>}
        {_.isEmpty(images) && (
          <EmptyStateView
            style={style.emptyGalleryContainer}
            icon="photo"
            message={I18n.t(ext('noImagesUploaded'))}
          />
        )}
        {!_.isEmpty(images) && (
          <View style={style.galleryContainer}>
            <HorizontalPager
              data={imageData}
              onIndexSelected={setCurrentIndex}
              renderPage={renderItem}
              renderOverlay={renderOverlay}
              selectedIndex={currentIndex}
              scrollEnabled={isScrollable}
            />
          </View>
        )}
        {renderFullScreenPreview()}
      </View>
      <Divider styleName="line md-gutter-top" style={style.divider} />
    </>
  );
}

ImagesPreview.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(SHAPE_VALUES).isRequired,
  showLabel: PropTypes.bool,
  style: PropTypes.object,
  value: PropTypes.arrayOf(PropTypes.string),
};

ImagesPreview.defaultProps = {
  showLabel: true,
  style: {},
  value: [],
};

export default connectStyle(ext('ImagesPreview'))(ImagesPreview);

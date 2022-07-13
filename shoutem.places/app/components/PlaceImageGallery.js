import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HorizontalPager, PageIndicators } from '@shoutem/ui';
import { getFirstImage } from '../services/places';
import PlaceImage from './PlaceImage';

export default class PlaceImageGallery extends PureComponent {
  static propTypes = {
    place: PropTypes.object,
    images: PropTypes.array,
    imageAnimationName: PropTypes.string,
    imageStyleName: PropTypes.string,
    imageOverlay: PropTypes.bool,
  };

  static defaultProps = {
    imageOverlay: true,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      selectedImageIndex: 0,
    };
  }

  setSelectedImageIndex(selectedImageIndex) {
    this.setState({ selectedImageIndex });
  }

  renderGalleryOverlay() {
    const imageCount = _.size(this.props.images);

    return (
      <PageIndicators
        activeIndex={this.state.selectedImageIndex}
        count={imageCount}
        styleName="overlay-bottom"
      />
    );
  }

  renderGalleryPage(image) {
    const { place, imageOverlay, imageStyleName } = this.props;
    const { location } = place;

    // The animation is currently null because it flickers when we use HorizontalPager.
    const resolvedAnimation = null;
    const imageSource = image ? { uri: image.url } : undefined;

    return (
      <PlaceImage
        animationName={resolvedAnimation}
        imageOverlay={imageOverlay}
        location={location}
        place={place}
        source={imageSource}
        styleName={imageStyleName}
      />
    );
  }

  render() {
    const hasMultipleImages = _.size(this.props.images) > 1;
    if (hasMultipleImages) {
      return (
        <HorizontalPager
          bounces
          data={this.props.images}
          onIndexSelected={this.setSelectedImageIndex}
          renderOverlay={this.renderGalleryOverlay}
          renderPage={this.renderGalleryPage}
          selectedIndex={this.state.selectedImageIndex}
          surroundingPagesToLoad={0}
        />
      );
    }

    const {
      place,
      imageAnimationName,
      imageOverlay,
      imageStyleName,
    } = this.props;
    const { location } = place;
    const leadImage = getFirstImage(place);
    const resolvedAnimation = imageAnimationName || null;
    const imageSource = leadImage ? { uri: leadImage.url } : undefined;

    return (
      <PlaceImage
        animationName={resolvedAnimation}
        imageOverlay={imageOverlay}
        location={location}
        place={place}
        source={imageSource}
        styleName={imageStyleName}
      />
    );
  }
}

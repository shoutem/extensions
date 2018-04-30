import _ from 'lodash';

import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';

import {
  HorizontalPager,
  Image,
  Overlay,
  PageIndicators,
  Tile,
} from '@shoutem/ui';

import DealImage from './DealImage';

export default class DealImageGallery extends PureComponent {

  static propTypes = {
    children: PropTypes.object,
    deal: PropTypes.object,
    images: PropTypes.array,
    imageAnimationName: PropTypes.string,
    imageStyleName: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.renderGalleryOverlay = this.renderGalleryOverlay.bind(this);
    this.renderGalleryPage = this.renderGalleryPage.bind(this);
    this.setSelectedImageIndex = this.setSelectedImageIndex.bind(this);

    this.state = {
      selectedImageIndex: 0,
    };
  }

  setSelectedImageIndex(selectedImageIndex) {
    this.setState({
      selectedImageIndex,
    });
  }

  hasMultipleImages() {
    return (_.size(this.props.images) > 1);
  }

  renderImage() {
    const {
      children,
      deal,
      animationName,
      imageStyleName,
    } = this.props;

    return (
      <DealImage
        animationName={animationName}
        deal={deal}
        styleName={imageStyleName}
      >
        {!_.isEmpty(children) && (
          <Tile
            animationName="hero"
            styleName="text-centric clear fill-parent"
          >
            <Overlay
              styleName="image-overlay fill-parent"
              style={{ marginBottom: 0 }}
            >
              {children}
            </Overlay>
          </Tile>
        )}
      </DealImage>
    );
  }

  renderGallery() {
    return (
      <HorizontalPager
        bounces
        data={this.props.images}
        onIndexSelected={this.setSelectedImageIndex}
        renderPage={this.renderGalleryPage}
        renderOverlay={this.renderGalleryOverlay}
      />
    );
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
    return (
      <Image
        source={{ uri: image }}
        styleName={this.props.imageStyleName}
      />
    );
  }

  render() {
    if (this.hasMultipleImages()) {
      return this.renderGallery();
    }

    return this.renderImage();
  }

}

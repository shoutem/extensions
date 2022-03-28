import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
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

    autoBindReact(this);

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
    return _.size(this.props.images) > 1;
  }

  renderImage(hasAnimation = true) {
    const { children, deal, animationName, imageStyleName } = this.props;

    const resolvedAnimation = hasAnimation ? animationName : null;

    return (
      <DealImage
        animationName={resolvedAnimation}
        deal={deal}
        isListItemImage={false}
        styleName={imageStyleName}
      >
        {!_.isEmpty(children) && (
          <Tile animationName="hero" styleName="text-centric clear fill-parent">
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
        selectedIndex={this.state.selectedImageIndex}
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
      <Image source={{ uri: image }} styleName={this.props.imageStyleName} />
    );
  }

  render() {
    if (this.hasMultipleImages()) {
      return this.renderGallery();
    }

    // single or no image deals should be rendered without animations
    // to avoid crash on Android 9 (maybe also higher OS)
    return this.renderImage(false);
  }
}

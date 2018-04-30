import React from 'react';
import { connect } from 'react-redux';

import {
  Overlay,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';
import { getDealImages, isDealImageGallery } from '../services';

import { DealDetailsScreen, mapStateToProps, mapDispatchToProps } from './DealDetailsScreen';
import DealImageGallery from '../components/DealImageGallery';

export class LargeDealDetailsScreen extends DealDetailsScreen {

  static propTypes = {
    ...DealDetailsScreen.propTypes,
  }

  constructor(props) {
    super(props);

    this.renderDealDetails = this.renderDealDetails.bind(this);
    this.renderDealImage = this.renderDealImage.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  renderDealImage() {
    const { deal } = this.props;

    if (isDealImageGallery(deal)) {
      return (
        <View>
          <DealImageGallery
            animationName="hero"
            imageStyleName="large-portrait"
            images={getDealImages(deal)}
            deal={deal}
          />
          <View pointerEvents="box-none" styleName="fill-parent">
            <View pointerEvents="box-none" styleName="flexible vertical stretch v-center h-center">
              <Overlay
                pointerEvents="box-none"
                styleName="fill-parent image-overlay"
                style={{ marginBottom: 0 }}
              >
                {this.renderDealDetails(true)}
              </Overlay>
            </View>
          </View>
        </View>
      );
    }

    return (
      <DealImageGallery
        animationName="hero"
        imageStyleName="large-portrait"
        deal={deal}
      >
        {this.renderDealDetails(true)}
      </DealImageGallery>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('LargeDealDetailsScreen', {}))(LargeDealDetailsScreen),
);

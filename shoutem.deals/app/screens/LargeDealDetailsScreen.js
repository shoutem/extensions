import React from 'react';
import autoBindReact from 'auto-bind/react';
import { connect } from 'react-redux';
import { Overlay, View } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import DealImageGallery from '../components/DealImageGallery';
import { getDealImages, isDealImageGallery } from '../services';
import { ext } from '../const';
import {
  DealDetailsScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './DealDetailsScreen';

export class LargeDealDetailsScreen extends DealDetailsScreen {
  static propTypes = {
    ...DealDetailsScreen.propTypes,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
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
            <View
              pointerEvents="box-none"
              styleName="flexible vertical stretch v-center h-center"
            >
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('LargeDealDetailsScreen', {}))(LargeDealDetailsScreen));

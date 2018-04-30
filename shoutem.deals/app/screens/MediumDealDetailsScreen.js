import React from 'react';

import { connect } from 'react-redux';

import {
  ScrollView,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';
import { getDealImages } from '../services';

import { DealDetailsScreen, mapStateToProps, mapDispatchToProps } from './DealDetailsScreen';
import DealImageGallery from '../components/DealImageGallery';

export class MediumDealDetailsScreen extends DealDetailsScreen {

  static propTypes = {
    ...DealDetailsScreen.propTypes,
  };

  constructor(props) {
    super(props);

    this.renderDealDetails = this.renderDealDetails.bind(this);
    this.renderDealImage = this.renderDealImage.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
  }

  renderDealImage() {
    const { deal } = this.props;

    return (
      <DealImageGallery
        animationName="hero"
        imageStyleName="large-banner"
        images={getDealImages(deal)}
        deal={deal}
      />
    );
  }

  renderScreen() {
    return (
      <ScrollView>
        {this.renderHeader()}
        <View styleName="solid horizontal h-center">
          <View styleName="lg-gutter-top lg-gutter-horizontal">
            {this.renderDealDetails()}
          </View>
        </View>
        {this.renderContent()}
        {this.renderFooter()}
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('MediumDealDetailsScreen', {}))(MediumDealDetailsScreen),
);

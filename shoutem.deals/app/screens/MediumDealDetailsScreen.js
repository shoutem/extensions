import React from 'react';
import autoBindReact from 'auto-bind/react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { Screen, ScrollView, View } from '@shoutem/ui';
import DealImageGallery from '../components/DealImageGallery';
import { ext } from '../const';
import { getDealImages } from '../services';
import {
  DealDetailsScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './DealDetailsScreen';

export class MediumDealDetailsScreen extends DealDetailsScreen {
  static propTypes = {
    ...DealDetailsScreen.propTypes,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
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

  render() {
    return (
      <Screen>
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
      </Screen>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('MediumDealDetailsScreen', {}))(MediumDealDetailsScreen));

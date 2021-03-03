import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
import { Button, View, Text } from '@shoutem/ui';
import { ext } from '../../const';

import {
  PlaceDetails,
  mapStateToProps,
  mapDispatchToProps,
} from './PlaceDetails';

import RewardsGaugeProgressBar from '../../components/RewardsGaugeProgressBar';
import PlacePointsRewardListView from '../../components/PlacePointsRewardListView';

const gaugeContainerStyleNames =
  'flexible vertical h-center v-center md-gutter-horizontal lg-gutter-vertical';

export class NoImageGaugeRewardsPlaceDetails extends PlaceDetails {
  static propTypes = {
    ...PlaceDetails.propTypes,
  };

  constructor(props) {
    super(props);

    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.renderLeadImage = this.renderLeadImage.bind(this);
    this.renderPoints = this.renderPoints.bind(this);
    this.renderRewardRow = this.renderRewardRow.bind(this);
    this.renderRightNavBarComponent = this.renderRightNavBarComponent.bind(
      this,
    );
  }

  getNavBarProps() {
    const { place } = this.props;
    const name = _.get(place, 'name', '');

    return {
      title: name.toUpperCase(),
      renderRightComponent: () => this.renderRightNavBarComponent(),
    };
  }

  renderRightNavBarComponent() {
    const { transactions } = this.props;

    return (
      <View virtual styleName="container">
        {_.size(transactions) ? (
          <Button onPress={this.navigateToPointsHistoryScreen}>
            <Text>{I18n.t(ext('navigationHistoryButton'))}</Text>
          </Button>
        ) : null}
      </View>
    );
  }

  renderLeadImage() {
    const { place, rewards } = this.props;
    const { points } = place;

    return (
      <View styleName={gaugeContainerStyleNames}>
        <RewardsGaugeProgressBar
          place={place}
          points={points}
          rewards={rewards}
          onCollectPoints={this.collectPoints}
        />
      </View>
    );
  }

  renderPoints() {
    return null;
  }

  renderRewardRow(reward) {
    const { place } = this.props;

    return (
      <PlacePointsRewardListView
        key={reward.id}
        onPress={this.navigateToRewardDetailsScreen}
        place={place}
        reward={reward}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  connectStyle(ext('NoImageGaugeRewardsPlaceDetails'))(
    NoImageGaugeRewardsPlaceDetails,
  ),
);

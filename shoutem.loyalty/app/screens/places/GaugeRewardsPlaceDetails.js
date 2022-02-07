import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import PlacePointsRewardListView from '../../components/PlacePointsRewardListView';
import RewardsGaugeProgressBar from '../../components/RewardsGaugeProgressBar';
import { ext } from '../../const';
import {
  mapDispatchToProps,
  mapStateToProps,
  PlaceDetails,
} from './PlaceDetails';

const gaugeContainerStyleNames =
  'flexible vertical h-center v-center solid md-gutter-horizontal lg-gutter-vertical';

export class GaugeRewardsPlaceDetails extends PlaceDetails {
  static propTypes = {
    ...PlaceDetails.propTypes,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  renderPoints() {
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
)(connectStyle(ext('GaugeRewardsPlaceDetails'))(GaugeRewardsPlaceDetails));

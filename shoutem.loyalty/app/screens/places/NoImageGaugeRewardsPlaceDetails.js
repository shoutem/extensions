import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { HeaderTextButton } from 'shoutem.navigation';
import PlacePointsRewardListView from '../../components/PlacePointsRewardListView';
import RewardsGaugeProgressBar from '../../components/RewardsGaugeProgressBar';
import { ext } from '../../const';
import {
  mapDispatchToProps,
  mapStateToProps,
  PlaceDetails,
} from './PlaceDetails';

const gaugeContainerStyleNames =
  'flexible vertical h-center v-center md-gutter-horizontal lg-gutter-vertical';

export class NoImageGaugeRewardsPlaceDetails extends PlaceDetails {
  static propTypes = {
    ...PlaceDetails.propTypes,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  getNavBarProps() {
    const { place } = this.props;
    const name = _.get(place, 'name', '');

    return {
      title: name.toUpperCase(),
      headerRight: this.renderRightNavBarComponent,
    };
  }

  renderRightNavBarComponent(props) {
    const { transactions } = this.props;

    const hasTransactions = !!_.size(transactions);

    if (!hasTransactions) {
      return null;
    }

    return (
      <HeaderTextButton
        {...props}
        onPress={this.navigateToPointsHistoryScreen}
        title={I18n.t(ext('navigationHistoryButton'))}
      />
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

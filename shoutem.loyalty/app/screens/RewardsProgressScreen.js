import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { find, next } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { getExtensionSettings } from 'shoutem.application';
import { getUser, loginRequired } from 'shoutem.auth';
import { CmsListScreen } from 'shoutem.cms';
import { getRouteParams } from 'shoutem.navigation';
import RewardMediumListView from '../components/RewardMediumListView';
import { ext } from '../const';
import { getCardStateForPlace } from '../redux';
import { refreshCard } from '../services';
import { RewardsListScreen } from './RewardsListScreen';

/**
 * Displays a list of rewards.
 * The user can redeem a reward once he collects the required number of points on his loyalty card.
 */
export class RewardsProgressScreen extends RewardsListScreen {
  renderRow(reward) {
    const points = _.get(this.props, 'cardState.points', 0);

    return (
      <RewardMediumListView
        key={reward.id}
        onPress={this.navigateToRewardDetails}
        reward={reward}
        points={points}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const extensionSettings = getExtensionSettings(state, ext());
  const programId = _.get(extensionSettings, 'program.id');
  const card = _.get(state[ext()], 'card.data', {});
  const placeId = _.get(getRouteParams(ownProps), 'place.id', null);

  return {
    ...CmsListScreen.createMapStateToProps(
      state => state[ext()].allPointRewards,
    )(state, ownProps),
    card,
    cardState: getCardStateForPlace(state, placeId) || {},
    programId,
    user: getUser(state),
  };
};

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  find,
  next,
  refreshCard,
});

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('RewardsListScreen'))(RewardsProgressScreen)),
);

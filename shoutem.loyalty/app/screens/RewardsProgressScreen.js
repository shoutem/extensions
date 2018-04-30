import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { getCollection } from '@shoutem/redux-io';

import { getExtensionSettings } from 'shoutem.application';
import {
  getUser,
  loginRequired,
} from 'shoutem.auth';

import { ext } from '../const';
import { getCardStateForPlace } from '../redux';
import { RewardsListScreen, mapDispatchToProps } from './RewardsListScreen';
import RewardMediumListView from '../components/RewardMediumListView';

/**
 * Displays a list of rewards.
 * The user can redeem a reward once he collects the required number of points on his loyalty card.
 */
export class RewardsProgressScreen extends RewardsListScreen {
  renderRow(reward) {
    const { cardState } = this.props;

    return (
      <RewardMediumListView
        key={reward.id}
        onPress={this.navigateToRewardDetails}
        reward={reward}
        points={cardState.points || 0}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const parentCategoryId = _.get(ownProps, 'shortcut.settings.parentCategory.id');
  const { allPointRewards, card: { data = {} } } = state[ext()];
  const { place } = ownProps;
  const placeId = place ? place.id : null;

  const extensionSettings = getExtensionSettings(state, ext());
  const programId = _.get(extensionSettings, 'program.id');

  return {
    card: data,
    cardState: getCardStateForPlace(state, placeId) || {},
    parentCategoryId,
    programId,
    data: getCollection(allPointRewards, state),
    user: getUser(state),
  };
};

export default loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('RewardsListScreen'))(RewardsProgressScreen),
));

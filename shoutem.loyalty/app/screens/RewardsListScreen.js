import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  find,
  getCollection,
  isValid,
  next,
  shouldRefresh,
} from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView } from '@shoutem/ui';

import {
  getAppId,
  getExtensionSettings,
  RemoteDataListScreen,
} from 'shoutem.application';
import { getUser, loginRequired } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';

import RewardListView from '../components/RewardListView';
import {
  REWARDS_SCHEMA,
  CARD_STATE_SCHEMA,
  POINT_REWARDS_SCHEMA,
  ext,
} from '../const';
import { refreshCard } from '../services';
import NoProgramScreen from './NoProgramScreen';

const { func, shape, string } = PropTypes;

/**
 * Displays a list of rewards.
 * The user can redeem a reward once he collects the required number of points on his loyalty card.
 */
export class RewardsListScreen extends RemoteDataListScreen {
  static propTypes = {
    ...RemoteDataListScreen.propTypes,
    // Loyalty card for user
    card: shape({
      // Card ID
      id: string,
    }),
    // Parent category ID in Shoutem CMS
    parentCategoryId: string,
    // ID of loyalty program for this extension
    programId: string,
    // Currently logged in user
    user: shape({
      id: string,
    }),

    // Actions
    find: func,
    navigateTo: func,
    next: func,
    // Refreshes the loyalty card
    refreshCard: func,
  };

  constructor(props, context) {
    super(props, context);

    this.renderRow = this.renderRow.bind(this);
    this.navigateToRewardDetails = this.navigateToRewardDetails.bind(this);

    this.state = {
      cmsSchema: REWARDS_SCHEMA,
      schema: POINT_REWARDS_SCHEMA,
    };
  }

  refreshData(prevProps) {
    const { card, user } = this.props;

    const prevCard = _.get(prevProps, 'card');
    const data = _.get(prevProps, 'data');
    const prevUser = _.get(prevProps, 'user');

    if (prevUser !== user && isValid(user)) {
      return this.fetchData();
    }

    const cardId = _.get(card, 'id');
    const prevCardId = _.get(prevCard, 'id');
    const hasNewCardId = cardId !== prevCardId;

    if (hasNewCardId || (cardId && shouldRefresh(data))) {
      return this.fetchData(cardId);
    }
  }

  fetchData(newCardId) {
    const { card, find, parentCategoryId, refreshCard } = this.props;
    const { cmsSchema, schema } = this.state;

    const cardId = card.id || newCardId;

    if (!cardId) {
      refreshCard();
      return;
    }

    find(schema, undefined, {
      query: {
        'filter[app]': getAppId(),
        'filter[schema]': cmsSchema,
        'filter[categories]': parentCategoryId,
        'filter[card]': cardId,
      },
    });

    find(CARD_STATE_SCHEMA, undefined, {
      cardId,
    });
  }

  navigateToRewardDetails(reward) {
    const { navigateTo, parentCategoryId } = this.props;

    navigateTo({
      screen: ext('RewardDetailsScreen'),
      props: {
        reward: { ...reward, parentCategoryId },
      },
    });
  }

  renderRow(reward) {
    return (
      <RewardListView
        key={reward.id}
        onPress={this.navigateToRewardDetails}
        reward={reward}
      />
    );
  }

  renderPlaceholderView() {
    const { data, parentCategoryId } = this.props;

    // If collection doesn't exist (`parentCategoryId` is undefined), notify user to create
    // content and reload app, because `parentCategoryId` is retrieved through app configuration
    if (_.isUndefined(parentCategoryId) || _.isEmpty(data)) {
      return (
        <EmptyStateView
          icon="gift"
          message={I18n.t(ext('noRewardsForStore'))}
        />
      );
    }

    return super.renderPlaceholderView(data);
  }

  shouldRenderPlaceholderView() {
    const { parentCategoryId, data } = this.props;

    return _.isUndefined(parentCategoryId) || super.shouldRenderPlaceholderView(data);
  }

  render() {
    const { programId } = this.props;

    return programId ? super.render() : (<NoProgramScreen />);
  }
}

export const mapStateToProps = (state, ownProps) => {
  const parentCategoryId = _.get(ownProps, 'shortcut.settings.parentCategory.id');
  const { allPointRewards, card: { data = {} } } = state[ext()];

  const extensionSettings = getExtensionSettings(state, ext());
  const programId = _.get(extensionSettings, 'program.id');

  return {
    card: data,
    parentCategoryId,
    programId,
    data: getCollection(allPointRewards, state),
    user: getUser(state),
  };
};

export const mapDispatchToProps = { find, navigateTo, next, refreshCard };

export default loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('RewardsListScreen'))(RewardsListScreen),
));

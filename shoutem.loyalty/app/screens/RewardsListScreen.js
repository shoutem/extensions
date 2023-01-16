import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { find, isValid, next, shouldRefresh } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView } from '@shoutem/ui';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { getUser, loginRequired } from 'shoutem.auth';
import { CmsListScreen } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import RewardListView from '../components/RewardListView';
import {
  CARD_STATE_SCHEMA,
  ext,
  POINT_REWARDS_SCHEMA,
  REWARDS_SCHEMA,
} from '../const';
import { refreshCard } from '../services';
import NoProgramScreen from './NoProgramScreen';

/**
 * Displays a list of rewards.
 * The user can redeem a reward once he collects the required number of points on his loyalty card.
 */
export class RewardsListScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    // Loyalty card for user
    card: PropTypes.shape({
      // Card ID
      id: PropTypes.string,
    }),
    // Parent category ID in Shoutem CMS
    parentCategoryId: PropTypes.string,
    // ID of loyalty program for this extension
    programId: PropTypes.string,
    // Currently logged in user
    user: PropTypes.shape({
      id: PropTypes.string,
    }),
    // Actions
    find: PropTypes.func,
    next: PropTypes.func,
    // Refreshes the loyalty card
    refreshCard: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      cmsSchema: REWARDS_SCHEMA,
      schema: POINT_REWARDS_SCHEMA,
      searchEnabled: false, // loyalty API doesn't support query param
    };
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props;
    const { user: prevUser } = prevProps;

    if (user.id && user.id !== prevUser.id) {
      this.refreshData(prevProps);
      return;
    }

    super.componentDidUpdate(prevProps);
  }

  refreshData(prevProps) {
    const { programId } = this.props;

    if (!programId) {
      return null;
    }

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

    return null;
  }

  onCategorySelected(category) {
    super.onCategorySelected(category);

    const cardId = _.get(this.props, 'card.id');

    this.fetchData(cardId);
  }

  fetchData(newCardId) {
    const { programId } = this.props;

    if (!programId) {
      return;
    }

    const { card, find, refreshCard, channelId, user } = this.props;
    const { cmsSchema, schema } = this.state;

    const cardId = _.get(card, 'id', newCardId);
    const categoryId = _.get(this.props, 'selectedCategory.id');

    if (!cardId && user?.id) {
      refreshCard();
      return;
    }

    if (_.isString(cardId) && categoryId) {
      find(schema, undefined, {
        query: {
          'filter[categories]': categoryId,
          'filter[app]': getAppId(),
          'filter[schema]': cmsSchema,
          'filter[card]': cardId,
          'filter[channels]': channelId,
        },
      });

      find(CARD_STATE_SCHEMA, undefined, {
        cardId,
      });
    }
  }

  navigateToRewardDetails(reward) {
    const { parentCategoryId } = this.props;

    navigateTo(ext('RewardDetailsScreen'), {
      reward: {
        ...reward,
        parentCategoryId,
      },
      analyticsPayload: {
        itemId: reward.id,
        itemName: reward.title,
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

    return (
      _.isUndefined(parentCategoryId) || super.shouldRenderPlaceholderView(data)
    );
  }

  render() {
    const { programId, navigation } = this.props;

    if (!programId) {
      return <NoProgramScreen navigation={navigation} />;
    }

    return super.render();
  }
}

export function mapStateToProps(state, ownProps) {
  const extensionSettings = getExtensionSettings(state, ext());
  const programId = _.get(extensionSettings, 'program.id');
  const card = _.get(state[ext()], 'card.data', {});

  return {
    ...CmsListScreen.createMapStateToProps(
      state => state[ext()].allPointRewards,
    )(state, ownProps),
    card,
    programId,
    user: getUser(state),
  };
}

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  find,
  next,
  refreshCard,
});

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('RewardsListScreen'))(RewardsListScreen)),
);

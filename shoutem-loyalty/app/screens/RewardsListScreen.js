import React from 'react';

import _ from 'lodash';
import { connect } from 'react-redux';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import {
  find,
  getCollection,
  getOne,
  next,
  shouldRefresh,
} from '@shoutem/redux-io';

import {
  getAppId,
  getExtensionSettings,
  ListScreen,
} from 'shoutem.application';

import {
  getUser,
  loginRequired,
} from 'shoutem.auth';

import {
  CMS_REWARDS_SCHEMA,
  CARD_STATE_SCHEMA,
  REWARDS_SCHEMA,
  ext,
} from '../const';

import { refreshCard } from '../redux';

import NoProgramScreen from './NoProgramScreen';

const { func, number, shape, string } = React.PropTypes;

/**
 * Displays a list of rewards.
 * The user can redeem a reward once he collects the required number of points on his loyalty card.
 */
export class RewardsListScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
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
      id: number,
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

    this.state = {
      cmsSchema: CMS_REWARDS_SCHEMA,
      schema: REWARDS_SCHEMA,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { card: { id } } = this.props;
    const { card: { id: nextId }, data } = nextProps;

    const hasNewCardId = !id && nextId;

    if (hasNewCardId || (nextId && shouldRefresh(data))) {
      this.fetchData(nextId);
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
      'filter[app]': getAppId(),
      'filter[schema]': cmsSchema,
      'filter[category]': parentCategoryId,
      'filter[card]': cardId,
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
    const { id, image, pointsRequired, title } = reward;

    return (
      <TouchableOpacity
        key={id}
        onPress={() => this.navigateToRewardDetails(reward)}
      >
        <Row>
          <Image
            styleName="small placeholder"
            source={{ uri: image.url }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>{title}</Subtitle>
            <Subtitle>{`${pointsRequired} points`}</Subtitle>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }

  render() {
    const { programId } = this.props;

    return programId ? super.render() : (<NoProgramScreen />);
  }
}

export const mapStateToProps = (state, ownProps) => {
  const parentCategoryId = _.get(ownProps, 'shortcut.settings.parentCategory.id');
  const { allRewards, card } = state[ext()];

  const { programId } = getExtensionSettings(state, ext());

  return {
    card: getOne(card, state),
    parentCategoryId,
    programId,
    data: getCollection(allRewards, state),
    user: getUser(state),
  };
};

export const mapDispatchToProps = { find, navigateTo, next, refreshCard };

export default loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('RewardsListScreen'))(RewardsListScreen),
), true);

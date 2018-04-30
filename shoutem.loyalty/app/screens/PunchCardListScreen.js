import React from 'react';
import _ from 'lodash';

import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  ImageBackground,
  Tile,
  Title,
  TouchableOpacity,
} from '@shoutem/ui';

import {
  getCollection,
} from '@shoutem/redux-io';

import {
  loginRequired,
} from 'shoutem.auth';

import {
  CMS_PUNCHCARDS_SCHEMA,
  PUNCH_REWARDS_SCHEMA,
  ext,
} from '../const';

import Stamps from '../components/Stamps';
import {
  mapStateToProps as rewardsListMapStateToProps,
  RewardsListScreen,
  mapDispatchToProps,
} from './RewardsListScreen';

/**
 * Displays a list of punch cards. A punch card is a reward that has points assigned to it.
 * The user can redeem it once he collects the required number of points on the card itself.
 */
export class PunchCardListScreen extends RewardsListScreen {
  static propTypes = {
    ...RewardsListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);

    this.renderRow = this.renderRow.bind(this);

    this.state = {
      ...this.state,
      cmsSchema: CMS_PUNCHCARDS_SCHEMA,
      schema: PUNCH_REWARDS_SCHEMA,
    };
  }

  renderRow(reward) {
    const title = _.get(reward, 'title', '');
    const image = _.get(reward, 'image');
    const id = _.get(reward, 'id');

    const iconStyle = { color: '#ffffff' };

    return (
      <TouchableOpacity
        key={id}
        onPress={() => this.navigateToRewardDetails(reward)}
      >
        <ImageBackground
          source={{ uri: image && image.url }}
          styleName="large-banner placeholder"
        >
          <Tile>
            <Title styleName="lg-gutter">{title.toUpperCase()}</Title>
            <Stamps
              iconStyle={iconStyle}
              reward={reward}
            />
          </Tile>
        </ImageBackground>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { allPunchCards } = state[ext()];

  return {
    ...rewardsListMapStateToProps(state, ownProps),
    data: getCollection(allPunchCards, state),
  };
};

export default loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PunchCardListScreen'))(PunchCardListScreen),
));

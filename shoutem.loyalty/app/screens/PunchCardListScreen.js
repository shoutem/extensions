import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { find, next } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  ImageBackground,
  Tile,
  Title,
  TouchableOpacity,
} from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { getUser, loginRequired } from 'shoutem.auth';
import { CmsListScreen } from 'shoutem.cms';
import Stamps from '../components/Stamps';
import { CMS_PUNCHCARDS_SCHEMA, PUNCH_REWARDS_SCHEMA, ext } from '../const';
import { refreshCard } from '../services';
import { RewardsListScreen } from './RewardsListScreen';

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

    autoBindReact(this);

    this.state = {
      ...this.state,
      cmsSchema: CMS_PUNCHCARDS_SCHEMA,
      schema: PUNCH_REWARDS_SCHEMA,
    };
  }

  onCategorySelected(category) {
    super.onCategorySelected(category);

    const cardId = _.get(this.props, 'card.id');

    this.fetchData(cardId);
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
            <Stamps iconStyle={iconStyle} reward={reward} />
          </Tile>
        </ImageBackground>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const extensionSettings = getExtensionSettings(state, ext());
  const programId = _.get(extensionSettings, 'program.id');
  const card = _.get(state[ext()], 'card.data', {});

  return {
    ...CmsListScreen.createMapStateToProps(state => state[ext()].allPunchCards)(
      state,
      ownProps,
    ),
    card,
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
  )(connectStyle(ext('PunchCardListScreen'))(PunchCardListScreen)),
);

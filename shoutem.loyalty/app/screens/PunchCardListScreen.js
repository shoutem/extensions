import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
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
import { assets } from 'shoutem.layouts';
import Stamps from '../components/Stamps';
import { CMS_PUNCHCARDS_SCHEMA, ext, PUNCH_REWARDS_SCHEMA } from '../const';
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
    const { card } = this.props;

    super.onCategorySelected(category);

    // Base class will return data = [] if no card. No need to fetch again
    if (card) {
      this.fetchData(card.id);
    }
  }

  renderRow(reward) {
    const { id, image, title = '' } = reward;

    const rewardImage = image ? { uri: image.url } : assets.noImagePlaceholder;

    const iconStyle = { color: '#ffffff' };

    return (
      <TouchableOpacity
        key={id}
        onPress={() => this.navigateToRewardDetails(reward)}
      >
        <ImageBackground
          source={rewardImage}
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
  const programId = extensionSettings.program?.id;
  const card = state[ext()]?.card?.data;

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

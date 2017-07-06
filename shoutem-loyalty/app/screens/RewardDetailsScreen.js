import React from 'react';

import { connect } from 'react-redux';

import {
  closeModal,
  navigateBack,
  openInModal,
} from '@shoutem/core/navigation';

import {
  Button,
  Caption,
  Image,
  Html,
  Screen,
  ScrollView,
  Title,
  Text,
  View,
} from '@shoutem/ui';

import {
  getOne,
 } from '@shoutem/redux-io';

import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';
import { isPunchCard } from '../redux';

import { reward as rewardShape } from '../components/shapes';
import Stamps from '../components/Stamps';

const { func, number, shape } = React.PropTypes;

/**
 * Shows details for a general reward or a punch card.
 * If the user loyalty card has enough points he can see a button to redeem the reward.
 */
export class RewardDetailsScreen extends React.Component {
  static propTypes = {
    // User loyalty card
    card: shape({
      // Points on the card
      points: number,
    }),
    // Reward description
    reward: rewardShape,
    // Opens the redeem reward or stamp a punch card flow in a new modal screen
    openInModal: func,
    // Navigates back to list of rewards when the redeem or stamp flow starts
    navigateBack: func,
  };

  constructor(props) {
    super(props);

    this.performAction = this.performAction.bind(this);
  }

  getNavBarProps() {
    const { reward: image } = this.props;

    return {
      styleName: image ? 'clear' : 'no-border',
      animationName: image ? 'solidify' : 'boxing',
    };
  }

  performAction(redeem) {
    const { reward, navigateBack, openInModal } = this.props;

    navigateBack();
    openInModal({
      screen: ext('VerificationScreen'),
      props: {
        reward,
        redeem,
      },
    });
  }

  renderImage() {
    const { reward } = this.props;
    const { image } = reward;

    return image ?
      <Image
        source={{ uri: image && image.url }}
        styleName="large placeholder"
      />
      :
      <View styleName="sm-gutter-top" />;
  }

  renderActionButton() {
    const { card: { points: cardPoints = 0 }, reward } = this.props;
    const { points = 0, pointsRequired } = reward;

    if (!isPunchCard(reward) && cardPoints < pointsRequired) {
      return null;
    }

    const shouldRedeem = !isPunchCard(reward) || points >= pointsRequired;

    return (
      <Button
        styleName="secondary md-gutter-horizontal lg-gutter-top"
        onPress={() => this.performAction(shouldRedeem)}
      >
        <Text>{shouldRedeem ? 'REDEEM' : 'STAMP CARD'}</Text>
      </Button>
    );
  }

  render() {
    const { reward } = this.props;

    const { description, image, pointsRequired, title } = reward;

    const screenStyle = image ? 'full-screen paper' : 'paper';

    return (
      <Screen styleName={screenStyle}>
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderImage()}
          <View styleName="content xl-gutter-horizontal vertical h-center">
            <Title styleName="h-center xl-gutter-top md-gutter-bottom">{title}</Title>
            {isPunchCard(reward) ?
              <Stamps reward={reward} />
              :
              <Caption>{`${pointsRequired} points`}</Caption>
            }
            {this.renderActionButton()}
          </View>
          <View styleName="lg-gutter-top md-gutter-horizontal">
            <Html body={description} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export const mapStateToProps = (state) => {
  const { cardState } = state[ext()];

  return {
    card: getOne(cardState, state),
  };
};

export default connect(mapStateToProps, { closeModal, navigateBack, openInModal })(
  connectStyle(ext('RewardDetailsScreen'))(RewardDetailsScreen),
);

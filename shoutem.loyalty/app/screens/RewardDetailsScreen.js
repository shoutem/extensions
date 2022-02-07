import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Image,
  Screen,
  ScrollView,
  SimpleHtml,
  Text,
  Tile,
  Title,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getRouteParams,
  openInModal,
} from 'shoutem.navigation';
import RewardProgressBar from '../components/RewardProgressBar';
import { cardStateShape } from '../components/shapes';
import Stamps from '../components/Stamps';
import { ext } from '../const';
import { getCardStateForPlace, isPunchCard } from '../redux';

/**
 * Shows details for a reward or a punch card.
 * If the user's loyalty card has enough points, he can see an option to redeem the reward.
 * A reward can belong to a place or to a single card, not related to a place.
 */
export class RewardDetailsScreen extends PureComponent {
  static propTypes = {
    // User's loyalty card state
    cardState: cardStateShape,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getNavBarProps() {
    return {
      ...composeNavigationStyles(['clear', 'solidify']),
    };
  }

  handleAction(redeem) {
    const { reward } = getRouteParams(this.props);

    openInModal(ext('VerificationScreen'), {
      reward,
      redeem,
    });
  }

  renderImage() {
    const { reward } = getRouteParams(this.props);
    const { image } = reward;

    return (
      <Image
        source={{ uri: image && image.url }}
        styleName="large placeholder"
        animationName="hero"
      />
    );
  }

  renderSummary() {
    const {
      cardState: { points = 0 },
    } = this.props;
    const { reward } = getRouteParams(this.props);
    const { pointsRequired, title } = reward;

    return (
      <Tile>
        <View styleName="content vertical">
          <Title styleName="h-center xl-gutter-top md-gutter-bottom">
            {title}
          </Title>
          {isPunchCard(reward) && (
            <View styleName="vertical h-center">
              <Stamps reward={reward} />
            </View>
          )}
          {!isPunchCard(reward) && (
            <View>
              <Caption styleName="h-center md-gutter-bottom">
                {I18n.t(ext('rewardPointRequirement'), {
                  count: pointsRequired || 0,
                })}
              </Caption>
              <RewardProgressBar
                points={points}
                pointsRequired={pointsRequired}
              />
            </View>
          )}
          {this.renderActionButton()}
        </View>
      </Tile>
    );
  }

  renderActionButton() {
    const {
      cardState: { points: cardPoints = 0 },
    } = this.props;
    const { reward } = getRouteParams(this.props);
    const { points = 0, pointsRequired } = reward;

    if (!isPunchCard(reward) && cardPoints < pointsRequired) {
      return null;
    }

    const shouldRedeem = !isPunchCard(reward) || points >= pointsRequired;

    return (
      <View styleName="h-center vertical">
        <Button
          styleName="secondary md-gutter"
          onPress={() => this.handleAction(shouldRedeem)}
        >
          <Text>
            {shouldRedeem
              ? I18n.t(ext('punchCardRedeemButton'))
              : I18n.t(ext('punchCardStampButton'))}
          </Text>
        </Button>
      </View>
    );
  }

  render() {
    const { reward } = getRouteParams(this.props);
    const { description } = reward;

    return (
      <Screen styleName="paper">
        <ScrollView>
          {this.renderImage()}
          {this.renderSummary()}
          <View styleName="md-gutter-horizontal">
            {description ? <SimpleHtml body={description} /> : null}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { place } = getRouteParams(ownProps);
  const placeId = place ? place.id : null;

  return {
    cardState: getCardStateForPlace(state, placeId) || {},
  };
};

export default connect(mapStateToProps)(
  connectStyle(ext('RewardDetailsScreen'))(RewardDetailsScreen),
);

import PropTypes from 'prop-types';
import React, {
  Component,
} from 'react';

import { connect } from 'react-redux';

import {
  getCollection,
  isBusy,
 } from '@shoutem/redux-io';

import {
  Button,
  Caption,
  Text,
  Tile,
  Title,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';

import { refreshCardState, refreshTransactions } from '../services';

import {
  placeShape,
 } from './shapes';

/**
 * A component for place loyalty points layout.
 */
class PlaceLoyaltyPointsView extends Component {
  static propTypes = {
    cardStates: PropTypes.array,
    // The place
    place: placeShape.isRequired,
    // Called when collect points is pressed
    onCollectPointsPress: PropTypes.func,
    // Refreshes card state
    refreshCardState: PropTypes.func,
    // Refreshes transactions on the loyalty card
    refreshTransactions: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.refreshCardState = this.refreshCardState.bind(this);
  }

  refreshCardState() {
    this.props.refreshCardState();
    this.props.refreshTransactions();
  }

  render() {
    const { cardStates, place, onCollectPointsPress } = this.props;
    const isRefreshingPoints = isBusy(cardStates);

    return (
      <Tile>
        <View styleName="content h-center lg-gutter-vertical vertical">
          <Caption>{I18n.t(ext('pointsCollected'))}</Caption>
          <Title styleName="md-gutter-top">
            {place.points || I18n.t(ext('noPointsCollected'))}
          </Title>
          <View styleName="horizontal lg-gutter-top">
            <Button
              onPress={onCollectPointsPress}
              styleName="secondary md-gutter-right"
            >
              <Text>{I18n.t(ext('collectPointsButton'))}</Text>
            </Button>
            <Button
              styleName={`${isRefreshingPoints && 'muted'}`}
              onPress={this.refreshCardState}
            >
              <Text>{I18n.t(ext('pointsHistoryButton'))}</Text>
            </Button>
          </View>
        </View>
      </Tile>
    );
  }
}

export const mapStateToProps = (state) => {
  const { allCardStates } = state[ext()];

  return {
    cardStates: getCollection(allCardStates, state),
  };
};

export default connect(mapStateToProps, { refreshCardState, refreshTransactions })(
  connectStyle(ext('PlaceLoyaltyPointsView'))(PlaceLoyaltyPointsView),
);

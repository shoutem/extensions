import _ from 'lodash';

import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  Icon,
  ImageBackground,
  Tile,
  View,
} from '@shoutem/ui';

import DealRedeemTimer from './DealRedeemTimer';
import { dealStatusShape, getDealImages } from '../services';

export default class DealImage extends Component {

  static propTypes = {
    activeCoupon: PropTypes.object,
    children: PropTypes.node,
    deal: PropTypes.object,
    dealStatus: dealStatusShape,
    renderTimer: PropTypes.bool,
    styleName: PropTypes.string,
  };

  static defaultProps = {
    dealStatus: {},
    renderTimer: true,
  };

  constructor(props) {
    super(props);

    this.handleTimerEnd = this.handleTimerEnd.bind(this);

    this.state = {
      dealStatus: props.dealStatus,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dealStatus } = nextProps;

    this.setState({
      dealStatus,
    });
  }

  handleTimerEnd() {
    const { dealStatus } = this.state;

    this.setState({
      dealStatus: {
        ...dealStatus,
        couponClaimed: false,
      },
    });
  }

  renderInnerContent() {
    const {
      deal,
      activeCoupon,
      renderTimer,
    } = this.props;

    const {
      dealStatus: {
        couponClaimed,
        couponRedeemed,
        dealRedeemed,
      },
    } = this.state;

    if (renderTimer) {
      if (couponClaimed) {
        const couponExpiresAt = _.get(activeCoupon, 'expiresAt');

        return (
          <Tile styleName="text-centric sm-gutter overlay">
            <View styleName="flexible middleCenter fill-parent space-around" virtual>
              {couponExpiresAt && (
                <DealRedeemTimer
                  deal={deal}
                  styleName="h-center"
                  endTime={couponExpiresAt}
                  onTimerEnd={this.handleTimerEnd}
                />
              )}
            </View>
          </Tile>
        );
      }

      if (couponRedeemed || dealRedeemed) {
        return (
          <Tile styleName="text-centric sm-gutter overlay">
            <Icon name="checkbox-on" />
          </Tile>
        );
      }
    }

    return this.props.children;
  }

  render() {
    const { deal } = this.props;
    const images = getDealImages(deal);
    const leadImage = _.first(images);

    return (
      <ImageBackground
        {...this.props}
        source={{ uri: leadImage }}
        styleName={`placeholder ${this.props.styleName}`}
      >
        {this.renderInnerContent()}
      </ImageBackground>
    );
  }
}

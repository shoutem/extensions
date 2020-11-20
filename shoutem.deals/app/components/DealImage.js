import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import {
  Icon,
  ImageBackground,
  Tile,
  View,
} from '@shoutem/ui';

import { dealStatusShape, getDealImages } from '../services';
import DealRedeemTimer from './DealRedeemTimer';

export default class DealImage extends PureComponent {
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

    autoBindReact(this);

    this.state = {
      dealStatus: props.dealStatus,
    };
  }

  componentDidUpdate() {
    const { dealStatus } = this.props;

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
    const { deal, styleName } = this.props;
    const images = getDealImages(deal);
    const leadImage = _.first(images);

    return (
      <ImageBackground
        {...this.props}
        source={{ uri: leadImage }}
        styleName={`placeholder ${styleName}`}
      >
        {this.renderInnerContent()}
      </ImageBackground>
    );
  }
}

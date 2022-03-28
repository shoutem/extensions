import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Icon, ImageBackground, Tile, View } from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import { dealStatusShape, getDealImages } from '../services';
import DealRedeemTimer from './DealRedeemTimer';

export default class DealImage extends PureComponent {
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
    const { deal, activeCoupon, renderTimer } = this.props;

    const {
      dealStatus: { couponClaimed },
    } = this.state;

    if (renderTimer) {
      if (couponClaimed) {
        const couponExpiresAt = _.get(activeCoupon, 'expiresAt');

        return (
          <Tile styleName="text-centric sm-gutter overlay">
            <View styleName="flexible middleCenter fill-parent space-around">
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

      const {
        dealStatus: { couponRedeemed, dealRedeemed },
      } = this.state;

      if (couponRedeemed || dealRedeemed) {
        return (
          <Tile styleName="text-centric sm-gutter overlay">
            <Icon name="checkbox-on" />
          </Tile>
        );
      }
    }

    const { children } = this.props;

    return children;
  }

  render() {
    const { deal, isListItemImage, styleName } = this.props;

    const leadImage = _.first(getDealImages(deal));

    const resolvedPlaceholderSource = isListItemImage
      ? assets.noImagePlaceholder
      : null;

    const resolvedDealImage = leadImage
      ? { uri: leadImage }
      : resolvedPlaceholderSource;

    return (
      <ImageBackground
        {...this.props}
        source={resolvedDealImage}
        styleName={`placeholder ${styleName}`}
      >
        {this.renderInnerContent()}
      </ImageBackground>
    );
  }
}

DealImage.propTypes = {
  deal: PropTypes.object.isRequired,
  activeCoupon: PropTypes.object,
  children: PropTypes.node,
  dealStatus: dealStatusShape,
  isListItemImage: PropTypes.bool,
  renderTimer: PropTypes.bool,
  styleName: PropTypes.string,
};

DealImage.defaultProps = {
  activeCoupon: {},
  children: undefined,
  dealStatus: {},
  isListItemImage: true,
  renderTimer: true,
  styleName: '',
};

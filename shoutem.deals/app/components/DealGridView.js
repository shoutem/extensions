import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';

import {
  Caption,
  Card,
  Text,
  TouchableOpacity,
  Subtitle,
  View,
} from '@shoutem/ui';

import { ext } from '../const';
import {
  dealStatusShape,
  formatPrice,
  getDealActiveCoupon,
  getDealStatus,
} from '../services';
import {
  getDeal,
  getLastDealAction,
  getLastDealTransaction,
  getLastDealStatusTransaction,
} from '../redux';

import DealImage from './DealImage';

export class DealGridView extends PureComponent {

  static propTypes = {
    activeCoupon: PropTypes.object,
    dealId: PropTypes.string,
    deal: PropTypes.object,
    dealStatus: dealStatusShape,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    onPress: () => {},
  };

  constructor(props) {
    super(props);

    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    this.props.onPress(this.props.deal);
  }

  render() {
    const {
      activeCoupon,
      deal,
      dealStatus,
    } = this.props;

    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Card styleName="flexible">
          <DealImage
            activeCoupon={activeCoupon}
            deal={deal}
            dealStatus={dealStatus}
            styleName="medium-wide"
          />

          <View styleName="content space-between">
            <Subtitle numberOfLines={3}>{deal.title}</Subtitle>
            <View styleName="md-gutter-top flexbox">
              <View styleName="flexible horizontal space-between">
                <Text>
                  <Text>
                    {formatPrice(deal.discountPrice, deal.currency)}
                  </Text>
                  &nbsp;
                  <Caption styleName="line-through">
                    {formatPrice(deal.regularPrice, deal.currency)}
                  </Caption>
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { deal } = ownProps;
  const lastDealTransaction = getLastDealTransaction(state, deal.id);
  const lastDealStatusTransaction = getLastDealStatusTransaction(state, deal.id);
  const lastDealAction = getLastDealAction(state, deal.id);
  const activeCoupon = getDealActiveCoupon(lastDealStatusTransaction);

  return {
    activeCoupon,
    deal: getDeal(state, deal.id),
    dealStatus: getDealStatus(deal, lastDealStatusTransaction),
    lastDealAction,
    lastDealTransaction,
    lastDealStatusTransaction,
  };
};

export default connect(mapStateToProps)(
  connectStyle(ext('DealGridView'), {})(DealGridView),
);

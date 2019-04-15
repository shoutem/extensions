import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import {
  Caption,
  Divider,
  Screen,
  ListView,
  Row,
  Subtitle,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView } from '@shoutem/ui-addons';

import { I18n } from 'shoutem.i18n';
import { NavigationBar } from 'shoutem.navigation';

import {
  selectShippingMethod,
  refreshShippingMethods,
} from '../../redux/actionCreators';

import {
  shop as shopShape,
  shippingMethods as shippingMethodsShape,
} from '../../components/shapes';

import CartFooter from '../../components/CartFooter';
import { ext } from '../../const';

/*
 * Used to get a user friendly caption for delivery dates.
 * Shopify bridge returns an array where the first item is the earliest delivery date
 * measured in miliseconds from 1970 and the second item is the latest delivery date.
 * This function formats it to something user friendly such as '2-5 days' or '5 days'
 * // TODO: Will we use this '2-5 days' format in the UI
 *
 */
const getDeliveryRangeCaption = ([startDateInMiliseconds, endDateInMiliseconds]) => {
  const daysInBetweenFirst = 1 + moment(startDateInMiliseconds).diff(moment(), 'days');
  const daysInBetweenLast = 1 + moment(endDateInMiliseconds).diff(moment(), 'days');

  let plural;
  let deliveryDays;

  if (daysInBetweenLast - daysInBetweenFirst === 0) {
    plural = daysInBetweenFirst > 1;
    deliveryDays = daysInBetweenFirst;
  } else {
    plural = true;
    deliveryDays = [daysInBetweenFirst, daysInBetweenLast].join('-');
  }

  return `${deliveryDays} day${plural ? 's' : ''}`;
};

const renderEmptyScreen = () => {
  const message = I18n.t(ext('shippingMethodFetchErrorMessage'));

  return (
    <EmptyStateView message={message} />
  );
};

const { func } = PropTypes;

/**
 * Lets the user select between one of the available shipping methods
 */
class ShippingMethodScreen extends PureComponent {
  static propTypes = {
    // Refreshes available shipping methods each time this screen is loaded
    refreshShippingMethods: func.isRequired,
    // Dispatched when a shipping method is selected
    selectShippingMethod: func.isRequired,
    // Shipping methods statusobject
    shippingMethods: shippingMethodsShape.isRequired,
    // Shop details, used to display currency
    shop: shopShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.proceedToPayment = this.proceedToPayment.bind(this);
    this.renderShippingMethod = this.renderShippingMethod.bind(this);
  }

  componentWillMount() {
    const { refreshShippingMethods } = this.props;

    refreshShippingMethods();
  }

  proceedToPayment(method) {
    const { selectShippingMethod } = this.props;

    selectShippingMethod(method);
  }

  renderShippingMethod(method) {
    const { deliveryRange, title, price } = method;
    const { currency } = this.props.shop;

    return (
      <TouchableOpacity onPress={() => this.proceedToPayment(method)}>
        <Row>
          <View
            styleName="vertical stretch space-between"
          >
            <Subtitle>{title}</Subtitle>
            <Text>{`${price} ${currency}`}</Text>
            {deliveryRange ?
              <Caption>{`${I18n.t(ext('estimatedDeliveryTime'))}${getDeliveryRangeCaption(deliveryRange)}`}</Caption>
              :
              null
            }
          </View>
        </Row>
      </TouchableOpacity>
    );
  }

  renderShippingMethods() {
    const { isLoading, methods = [] } = this.props.shippingMethods;

    return (
      <Screen>
        <NavigationBar
          title={I18n.t(ext('shippingScreenNavBarTitle'))}
        />
        <View style={{ marginTop: 30 }} />
        <ListView
          data={methods}
          loading={isLoading}
          renderRow={this.renderShippingMethod}
        />
        <Divider styleName="line" />
        <CartFooter />
      </Screen>
    );
  }

  render() {
    const { error, isLoading, methods } = this.props.shippingMethods;
    const noItems = !isLoading && !_.size(methods);

    return error || noItems ? renderEmptyScreen() : this.renderShippingMethods();
  }
}

const mapStateToProps = (state) => {
  const { shippingMethods, shop } = state[ext()];

  return {
    shippingMethods,
    shop,
  };
};

export default connect(
  mapStateToProps, { refreshShippingMethods, selectShippingMethod })(
    connectStyle(ext('ShippingMethodScreen'))(ShippingMethodScreen),
);

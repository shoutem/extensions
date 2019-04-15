import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { connect } from 'react-redux';

import {
  Heading,
  Screen,
  Button,
  Caption,
  Divider,
  ListView,
  Overlay,
  Row,
  ScrollView,
  Subtitle,
  Text,
  View,
} from '@shoutem/ui';

import {
  InlineMap,
} from '@shoutem/ui-addons';

import { connectStyle } from '@shoutem/theme';
import { NavigationBar, closeModal } from 'shoutem.navigation';

import { I18n } from 'shoutem.i18n';

import { ext } from '../../const';
import {
  cart as cartShape,
  customer as customerShape,
  shippingMethod as shippingMethodShape,
  shop as shopShape,
} from '../../components/shapes';

import CartFooter from '../../components/CartFooter';
import CartItem from '../../components/CartItem';

import { checkoutCompleted } from '../../redux/actionCreators';

const { func } = PropTypes;

const GEOCODE_API_KEY = 'AIzaSyAvAszYWg777gS9PNkrhGDR_gglRPiRh0g';

const getNavBarProps = () => (
  {
    renderLeftComponent: () => null,
    title: I18n.t(ext('orderCompletedNavBarTitle')),
  }
);

const getCoordinateObject = (lat, lng) => (
  {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }
);

const renderAddress = (customer, addressType) => {
  const { firstName, lastName, address1, city, zip, countryName } = customer;

  return (
    <Row>
      <View styleName="vertical">
        <Text>{addressType}</Text>
        <Text styleName="sm-gutter-top">{`${firstName} ${lastName}`}</Text>
        <Text>{`${address1}`}</Text>
        <Text>{`${zip} ${city}`}</Text>
        <Text>{`${countryName}`}</Text>
      </View>
    </Row>
  );
};

const renderShippingMethod = method => (
  <Row>
    <View styleName="vertical">
      <Text>{I18n.t(ext('chosenShippingMethodTitle'))}</Text>
      <Text styleName="sm-gutter-top">{method.title}</Text>
    </View>
  </Row>
);

class OrderCompleteScreen extends PureComponent {
  static propTypes = {
    // A list of cart items, where an item is defined by a combination of product, its variant
    // and quantity
    cart: cartShape.isRequired,
    // Action dispatched when the user returns to shop
    checkoutCompleted: func,
    // Used to return back to shop
    closeModal: func,
    // The customer that completed the checkout
    customer: customerShape,
    // Selected shipping method, used to display a summary after checkout
    selectedShippingMethod: shippingMethodShape,
    // Shop properties, currently used just to display currency
    shop: shopShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.renderOrderSummaryRow = this.renderOrderSummaryRow.bind(this);
    this.returnToShop = this.returnToShop.bind(this);

    this.state = {};
  }

  componentWillMount() {
    this.getShippingAddressLocation();
  }

  getShippingAddressLocation() {
    const { address1, city, zip } = this.props.customer;
    const address = `${address1} ${zip}, ${city}`;

    const endpoint =
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&sensor=true&key=${GEOCODE_API_KEY}`;

    /* eslint-disable no-undef */
    fetch(endpoint)
      .then(response => response.json())
      .then((responseJson) => {
        if (responseJson.status === 'ZERO_RESULTS' || !responseJson.results) {
          return;
        }

        const { lat, lng } = responseJson.results[0].geometry.location;

        this.setState({ lat, lng });
      });
  }

  returnToShop() {
    const { checkoutCompleted, closeModal } = this.props;

    checkoutCompleted();
    closeModal();
  }

  renderThankYouMessage() {
    const { customer } = this.props;

    return (
      <Row>
        <Heading styleName="h-center lg-gutter">
          {I18n.t(ext('thankYouMessage'), { firstNameOfBuyer: firstName })}
        </Heading>
      </Row>
    );
  }

  renderMap() {
    const { address1, city, zip } = this.props.customer;
    const { lat, lng } = this.state;

    if (!lat && !lng) {
      return null;
    }

    const coordinateObject = getCoordinateObject(lat, lng);

    return (
      <InlineMap
        style={{ height: 160 }}
        markers={[coordinateObject]}
        markerImage={require('../../assets/images/pin-dark.png')}
        initialRegion={coordinateObject}
      >
        <Overlay styleName="fill-parent">
          <View>
            <Subtitle>{`${city.toUpperCase()}`}</Subtitle>
            <Caption styleName="bold">{`${address1}, ${zip}`}</Caption>
          </View>
        </Overlay>
      </InlineMap>
    );
  }

  renderConfirmationMessage() {
    const { email } = this.props.customer;

    return (
      <Row>
        <View styleName="vertical">
          <Text>{I18n.t(ext('orderConfirmationTitle'))}</Text>
          <Text styleName="sm-gutter-top">
            {I18n.t(ext('orderConfirmationMessage'))}
          </Text>
          <Text styleName="bold">{`${email}.`}</Text>
        </View>
      </Row>
    );
  }

  renderCustomerInformation() {
    const { customer, selectedShippingMethod } = this.props;

    return (
      <View>
        <Divider styleName="section-header">
          <Caption>{I18n.t(ext('customerInformationTitle'))}</Caption>
        </Divider>
        {renderAddress(customer, I18n.t(ext('shippingAddress')))}
        {renderShippingMethod(selectedShippingMethod)}
        {renderAddress(customer, I18n.t(ext('billingAddress')))}
      </View>
    );
  }

  renderOrderSummary() {
    const { cart } = this.props;

    return (
      <View>
        <Divider styleName="section-header">
          <Caption>{I18n.t(ext('orderSummary'))}</Caption>
        </Divider>
        <ListView
          data={cart}
          renderRow={this.renderOrderSummaryRow}
        />
      </View>
    );
  }

  renderOrderSummaryRow(cartItem) {
    const { shop } = this.props;

    return <CartItem cartItem={cartItem} shop={shop} />;
  }

  renderBackToShopButton() {
    return (
      <View styleName="horizontal h-center lg-gutter">
        <Button
          styleName="secondary"
          onPress={this.returnToShop}
        >
          <Text styleName="bold">{I18n.t(ext('returnToShopButton'))}</Text>
        </Button>
      </View>
    );
  }

  render() {
    return (
      <Screen>
        <NavigationBar {...getNavBarProps()} />
        <ScrollView>
          {this.renderThankYouMessage()}
          {this.renderMap()}
          {this.renderConfirmationMessage()}
          {this.renderCustomerInformation()}
          {this.renderOrderSummary()}
          <Divider styleName="line" />
          <CartFooter withShipping />
        </ScrollView>
        <Divider styleName="line" />
        {this.renderBackToShopButton()}
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const { cart, customer, payment, selectedShippingMethod, shop } = state[ext()];

  return {
    cart,
    customer,
    payment,
    selectedShippingMethod,
    shop,
  };
};

export default connect(mapStateToProps, { checkoutCompleted, closeModal })(
  connectStyle(ext('OrderCompleteScreen'))(OrderCompleteScreen),
);

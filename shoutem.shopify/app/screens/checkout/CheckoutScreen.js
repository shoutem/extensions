import React, { PureComponent } from 'react';
import { Alert, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import countryData from 'world-countries';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { I18n } from 'shoutem.i18n';
import { NavigationBar } from 'shoutem.navigation';

import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  DropDownMenu,
  FormGroup,
  Screen,
  ScrollView,
  Title,
  TextInput,
  View,
} from '@shoutem/ui';

import CartFooter from '../../components/CartFooter';
import { customer as customerShape } from '../../components/shapes';
import { updateCustomerInformation } from '../../redux/actionCreators';
import { getFieldLabel } from '../../services/getFormFieldLabel';
import { ext } from '../../const';

const { func } = PropTypes;

const loadCountries = () =>
  _.sortBy(_.map(countryData, ({ name: { common: name }, cca2 }) =>
    ({ name, cca2 })), 'name');

const emptyOption = { name: 'Select', cca2: '' };
const countries = [emptyOption, ...loadCountries()];

// Move element in array from one index to another
const arrayMove = function(arr, from, to) {
  return arr.splice(to, 0, arr.splice(from, 1)[0]);
};

// Reorder Countries in checkout
['US', 'CA'].map((country, i) => {
  const countryIndex = countries.findIndex((c) => c.cca2 === country);

  // Move country after placeholder option
  arrayMove(countries, countryIndex, 1 + i);
});

/**
 * Lets the user enter his email and address when performing a checkout with selected
 * cart items. If the information he enters is valid, the component forwards him to the
 * next step - the web checkout
 */
class CheckoutScreen extends PureComponent {
  static propTypes = {
    // The customer performing the checkout
    customer: customerShape,
    // Action dispatched when proceeding to the next step
    updateCustomerInformation: func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onCountrySelected = this.onCountrySelected.bind(this);
    this.proceedToWebCheckout = this.proceedToWebCheckout.bind(this);
    this.renderInput = this.renderInput.bind(this);

    this.fields = [{
      autoCapitalize: 'none',
      name: 'email',
      label: getFieldLabel('email'),
      keyboardType: 'email-address',
    },
    {
      name: 'firstName',
      label: getFieldLabel('firstName'),
    },
    {
      name: 'lastName',
      label: getFieldLabel('lastName'),
    },
    {
      name: 'address1',
      label: getFieldLabel('address1'),
    },
    {
      name: 'city',
      label: getFieldLabel('city'),
    },
    {
      name: 'province',
      label: getFieldLabel('province'),
    },
    {
      name: 'zip',
      label: getFieldLabel('zip'),
    }];

    this.state = { ...props.customer };
  }

  onCountrySelected(country) {
    this.setState({ countryCode: country.cca2, countryName: country.name });
  }

  proceedToWebCheckout() {
    const { updateCustomerInformation, cart } = this.props;
    const { countryCode } = this.state;

    const values = _.map(this.fields, ({ name }) => this.state[name]);

    if (_.some(values, _.isEmpty) || !countryCode) {
      Alert.alert(
        I18n.t(ext('checkoutFormErrorTitle')),
        I18n.t(ext('checkoutFormErrorMessage'))
      );

      return;
    }

    const customerInformation = { ...this.state };

    var cartItems = [];
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      cartItems.push({
        id: item.variant.id,
        quantity: item.quantity
      });
    }

    updateCustomerInformation(customerInformation, cartItems);
  }

  renderInput(field) {
    const { autoCapitalize, name, label, keyboardType } = field;

    return (
      <FormGroup key={name}>
        <Caption>{label.toUpperCase()}</Caption>
        <TextInput
          placeholder={label}
          autoCapitalize={autoCapitalize || 'words'}
          autoCorrect={false}
          keyboardAppearance="light"
          keyboardType={keyboardType || 'default'}
          onChangeText={text => this.setState({ [name]: text })}
          returnKeyType="done"
          value={this.state[name]}
        />
        <Divider styleName="line sm-gutter-bottom" />
      </FormGroup>
    );
  }

  renderCountryPicker() {
    const { countryCode } = this.state;

    const selectedCountry = _.find(countries, { 'cca2': countryCode });

    return (
      <FormGroup>
        <Caption>{I18n.t(ext('countrySelectionTitle'))}</Caption>
        <DropDownMenu
          onOptionSelected={this.onCountrySelected}
          options={countries}
          selectedOption={selectedCountry || countries[0]}
          styleName={countryCode ? '' : 'empty'}
          titleProperty={'name'}
          valueProperty={'cca2'}
        />
      </FormGroup>
    );
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
        <NavigationBar title={I18n.t(ext('checkoutNavBarTitle'))} />
        <View>
          <ScrollView>
            {_.map(this.fields, this.renderInput)}
            {this.renderCountryPicker()}
            <Divider styleName="line" />
            <CartFooter
              action={I18n.t(ext('checkoutContinueButton'))}
              onActionButtonClicked={this.proceedToWebCheckout}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  const { customer, cart } = state[ext()];

  return {
    customer,
    cart,
  };
};

export default connect(mapStateToProps, { updateCustomerInformation })(
  connectStyle(ext('CheckoutScreen'))(CheckoutScreen),
);

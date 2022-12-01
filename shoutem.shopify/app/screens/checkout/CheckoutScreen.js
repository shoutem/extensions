import React, { PureComponent } from 'react';
import { Alert, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import countryData from 'world-countries';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  DropDownMenu,
  FormGroup,
  Keyboard,
  ScrollView,
  TextInput,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { goBack, navigateTo } from 'shoutem.navigation';
import { CartFooter } from '../../components/cart';
import { customer as customerShape } from '../../components/shapes';
import { ext } from '../../const';
import { updateCustomerInformation } from '../../redux/actionCreators';
import { formatAutocompleteData } from '../../services';
import { getFieldLabel } from '../../services/getFormFieldLabel';

const KEYBOARD_OFFSET = Keyboard.calculateKeyboardOffset();

const loadCountries = () =>
  _.sortBy(
    _.map(countryData, ({ name: { common: name }, cca2 }) => ({ name, cca2 })),
    'name',
  );

const emptyOption = { name: 'Select', cca2: '' };
const countries = [emptyOption, ...loadCountries()];

// Move element in array from one index to another
const arrayMove = function(arr, from, to) {
  return arr.splice(to, 0, arr.splice(from, 1)[0]);
};

// Reorder Countries in checkout
['US', 'CA'].map((country, i) => {
  const countryIndex = countries.findIndex(c => c.cca2 === country);

  // Move country after placeholder option
  arrayMove(countries, countryIndex, 1 + i);
});

/**
 * Lets the user enter his email and address when performing a checkout with selected
 * cart items. If the information he enters is valid, the component forwards him to the
 * next step - the web checkout
 */
class CheckoutScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.fields = [
      {
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
      },
    ];

    this.state = { ...props.customer };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ title: I18n.t(ext('checkoutNavBarTitle')) });
  }

  onCountrySelected(country) {
    this.setState({ countryCode: country.cca2, countryName: country.name });
  }

  proceedToWebCheckout() {
    const { updateCustomerInformation, cart } = this.props;
    const { countryCode } = this.state;

    const values = _.map(this.fields, ({ name }) => _.get(this.state, name));

    if (_.some(values, _.isEmpty) || !countryCode) {
      Alert.alert(
        I18n.t(ext('checkoutFormErrorTitle')),
        I18n.t(ext('checkoutFormErrorMessage')),
      );

      return;
    }

    const customerInformation = { ...this.state };

    const cartItems = [];
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      cartItems.push({
        id: item.variant.id,
        quantity: item.quantity,
      });
    }

    updateCustomerInformation(customerInformation, cartItems);
  }

  handleAddressFieldPress() {
    navigateTo(ext('SelectAddressScreen'), {
      onAddressSelected: this.handleAddressSelected,
    });
  }

  handleAddressSelected(_shortInfo, longInfo) {
    const {
      street,
      streetNumber,
      postalCode,
      city,
      countryName,
      countryCode,
      province,
    } = formatAutocompleteData(longInfo);

    this.setState({
      ...(street && { address1: `${street} ${streetNumber}` }),
      ...(postalCode && { zip: postalCode }),
      ...(city && { city }),
      ...(countryName && { countryName }),
      ...(countryCode && { countryCode }),
      ...(province && { province }),
    });

    goBack();
  }

  renderInput(field) {
    const { autoCapitalize, name, label, keyboardType } = field;
    const { [name]: currentValue } = this.state;

    const isAddressField = name === 'address1';
    const handlePress = isAddressField
      ? this.handleAddressFieldPress
      : undefined;

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
          onPressIn={handlePress}
          returnKeyType="done"
          value={currentValue}
        />
        <Divider styleName="line sm-gutter-bottom" />
      </FormGroup>
    );
  }

  renderCountryPicker() {
    const { countryCode } = this.state;

    const selectedCountry = _.find(countries, { cca2: countryCode });

    return (
      <FormGroup>
        <Caption>{I18n.t(ext('countrySelectionTitle'))}</Caption>
        <DropDownMenu
          onOptionSelected={this.onCountrySelected}
          options={countries}
          selectedOption={selectedCountry || countries[0]}
          styleName={countryCode ? '' : 'empty'}
          titleProperty="name"
          valueProperty="cca2"
        />
      </FormGroup>
    );
  }

  render() {
    const { style } = this.props;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={KEYBOARD_OFFSET}
        style={style.container}
      >
        <ScrollView>
          {_.map(this.fields, this.renderInput)}
          {this.renderCountryPicker()}
          <Divider styleName="line" />
        </ScrollView>
        <CartFooter
          action={I18n.t(ext('checkoutContinueButton'))}
          onActionButtonClicked={this.proceedToWebCheckout}
        />
      </KeyboardAvoidingView>
    );
  }
}

CheckoutScreen.propTypes = {
  cart: PropTypes.object.isRequired,
  customer: customerShape.isRequired,
  navigation: PropTypes.object.isRequired,
  updateCustomerInformation: PropTypes.func.isRequired,
  style: PropTypes.object,
};

CheckoutScreen.defaultProps = {
  style: {},
};

const mapStateToProps = state => {
  const { customer, cart } = state[ext()];

  return {
    customer,
    cart,
  };
};

export default connect(mapStateToProps, { updateCustomerInformation })(
  connectStyle(ext('CheckoutScreen'))(CheckoutScreen),
);

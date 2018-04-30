import PropTypes from 'prop-types';
import React, {
  Component,
} from 'react';

import { Alert } from 'react-native';
import { connect } from 'react-redux';

import {
  Caption,
  Divider,
  DropDownMenu,
  FormGroup,
  Screen,
  ScrollView,
  TextInput,
} from '@shoutem/ui';

import _ from 'lodash';

import { NavigationBar } from '@shoutem/ui/navigation';
import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import countryData from 'world-countries';

import { ext } from '../../const';
import CartFooter from '../../components/CartFooter';
import { customer as customerShape } from '../../components/shapes';
import { updateCustomerInformation } from '../../redux/actionCreators';

const { func } = PropTypes;

// TODO: Where to put this transformation? We need it because the ListView can reference
// only first level and not nested properties
const loadCountries = () => _.sortBy(_.map(countryData, ({ name: { common: name }, cca2 }) =>
({ name, cca2 })), 'name');

/**
 * Lets the user enter his email and address when performing a checkout with selected
 * cart items. If the information he enters is valid, the component forwards him to the
 * next step, usually selecting a shipping method
 */
class CheckoutScreen extends Component {
  static propTypes = {
    // The customer performing the checkout
    customer: customerShape,
    // Action dispatched when proceeding to the next step
    updateCustomerInformation: func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onCountrySelected = this.onCountrySelected.bind(this);
    this.proceedToShippingMethod = this.proceedToShippingMethod.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.fields = [{
      autoCapitalize: 'none',
      name: 'email',
      label: I18n.t(ext('checkoutEmail')),
      keyboardType: 'email-address',
    },
    {
      name: 'firstName',
      label: I18n.t(ext('checkoutFirstName')),
    },
    {
      name: 'lastName',
      label: I18n.t(ext('checkoutLastName')),
    },
    {
      name: 'address1',
      label: I18n.t(ext('checkoutAddress')),
    },
    {
      name: 'city',
      label: I18n.t(ext('checkoutCity')),
    },
    {
      name: 'province',
      label: I18n.t(ext('checkoutProvince')),
    },
    {
      name: 'zip',
      label: I18n.t(ext('checkoutPostalCode')),
    }];

    this.state = { ...props.customer };
  }

  onCountrySelected(country) {
    this.setState({ countryCode: country.cca2, countryName: country.name });
  }

  proceedToShippingMethod() {
    const { updateCustomerInformation } = this.props;
    const { countryCode } = this.state;
    const values = _.map(this.fields, ({ name }) => this.state[name]);

    if (_.some(values, _.isEmpty) || !countryCode) {
      Alert.alert(I18n.t(ext('checkoutFormErrorTitle')), I18n.t(ext('checkoutFormErrorMessage')));
      return;
    }
    // TODO: Local state contains only customer info so this is a clean practical way of getting
    // all of these values. Any other ideas?
    const customerInformation = { ...this.state };

    updateCustomerInformation(customerInformation);
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
    const emptyOption = { name: I18n.t(ext('countrySelectionPlaceholder')), cca2: '' };
    const countries = [emptyOption, ...loadCountries()];
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
      <Screen>
        <NavigationBar title={I18n.t(ext('checkoutNavBarTitle'))} />
        <ScrollView>
          {_.map(this.fields, this.renderInput)}
          {this.renderCountryPicker()}
        </ScrollView>
        <Divider styleName="line" />
        <CartFooter
          action={I18n.t(ext('checkoutContinueButton'))}
          onActionButtonClicked={this.proceedToShippingMethod}
        />
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const { customer } = state[ext()];

  return {
    customer,
  };
};

export default connect(mapStateToProps, { updateCustomerInformation })(
  connectStyle(ext('CheckoutScreen'))(CheckoutScreen),
);

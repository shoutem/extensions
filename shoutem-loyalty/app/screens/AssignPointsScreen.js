import React from 'react';
import _ from 'lodash';

import { Alert } from 'react-native';
import { connect } from 'react-redux';

import {
  Button,
  Caption,
  Divider,
  FormGroup,
  Screen,
  ScrollView,
  Switch,
  View,
  Text,
  TextInput,
} from '@shoutem/ui';

import { getExtensionSettings } from 'shoutem.application';

import {
  invalidate,
} from '@shoutem/redux-io';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { getUser } from 'shoutem.auth';

import { ext } from '../const';

import { createTransaction } from '../redux';

const fields = [{
  name: 'amount',
  label: 'Receipt sum',
  keyboardType: 'numeric',
},
{
  name: 'receiptCode',
  label: 'Receipt code',
}];

const CURRENCY_PREFIX = '$ ';

const { bool, func, shape, string } = React.PropTypes;

const showNoReceiptCodeAlert = () => {
  Alert.alert(
  'No receipt code',
  'Please enter a receipt code!',
  );
};

/**
 * Lets the cashier enter details about the user's shop activity and save the transaction.
 * The user can get loyalty points for visits or purchases. The server calculates points based
 * on transaction details and rules defined for the program.
 */
export class AssignPointsScreen extends React.Component {
  static propTypes = {
    // Creates a transaction with activity details
    createTransaction: func,
    // An already verified PIN
    pin: string,
    // True if a receipt code is required, false otherwise
    requireReceiptCode: bool,
    // User performing the activity
    user: shape({
      name: string,
    }),
  };

  constructor(props) {
    super(props);

    this.renderInput = this.renderInput.bind(this);
    this.processTransaction = this.processTransaction.bind(this);

    this.state = { purchase: false, visit: false };
  }

  processTransaction() {
    const { createTransaction, pin, requireReceiptCode } = this.props;
    const { receiptCode } = this.state;

    if (requireReceiptCode && !receiptCode) {
      showNoReceiptCodeAlert();
      return;
    }

    const data = { ...this.state, amount: parseFloat(this.state.amount) };

    createTransaction(data, pin);
  }

  renderInput(field) {
    const { name, label, keyboardType } = field;

    const prefix = name === 'amount' ? CURRENCY_PREFIX : '';
    const value = this.state[name];

    return (
      <FormGroup key={name}>
        <Caption>{label.toUpperCase()}</Caption>
        <TextInput
          placeholder={label}
          keyboardType={keyboardType || 'default'}
          onChangeText={text => this.setState({ [name]: text.slice(prefix.length) })}
          returnKeyType="done"
          value={`${prefix}${value || ''}`}
        />
        <Divider styleName="line sm-gutter-bottom" />
      </FormGroup>
    );
  }

  renderActivityDetails() {
    const { visit, purchase } = this.state;

    return (
      <View>
        <Divider styleName="section-header">
          <Caption>ASSIGN POINTS FOR</Caption>
        </Divider>
        <View styleName="horizontal v-center solid space-between md-gutter">
          <Caption>Customer visited this store</Caption>
          <Switch
            value={visit}
            onValueChange={value => this.setState({ visit: value })}
          />
        </View>
        <View styleName="horizontal v-center solid space-between md-gutter">
          <Caption>Customer made a purchase</Caption>
          <Switch
            value={purchase}
            onValueChange={value => this.setState({ purchase: value })}
          />
        </View>
      </View>
    );
  }

  renderPurchaseDetails() {
    return (
      <View>
        <Divider styleName="section-header">
          <Caption>ENTER PURCHASE DETAILS</Caption>
        </Divider>
        {_.map(fields, this.renderInput)}
      </View>
    );
  }

  render() {
    const { user: { name } } = this.props;
    const { purchase } = this.state;

    return (
      <Screen>
        <NavigationBar title="ASSIGN POINTS" />
        <ScrollView>
          <View styleName="solid md-gutter">
            <Caption styleName="muted">CUSTOMER E-MAIL</Caption>
            <Text styleName="sm-gutter-top">{name}</Text>
          </View>
          {this.renderActivityDetails()}
          { purchase ? this.renderPurchaseDetails() : null }
          <View styleName="vertical h-center">
            <Button
              styleName="secondary lg-gutter-vertical"
              style={{ width: 200 }}
              onPress={this.processTransaction}
            >
              <Text>CONFIRM</Text>
            </Button>
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export const mapStateToProps = (state) => {
  const { requireReceiptCode } = getExtensionSettings(state, ext());

  return {
    requireReceiptCode,
    user: getUser(state),
  };
};

export default connect(mapStateToProps, { createTransaction, invalidate, navigateTo })(
  connectStyle(ext('AssignPointsScreen'))(AssignPointsScreen),
);

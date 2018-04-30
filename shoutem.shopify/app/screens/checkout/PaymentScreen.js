import PropTypes from 'prop-types';
import React, {
  Component,
} from 'react';

import { Alert } from 'react-native';
import { connect } from 'react-redux';

import _ from 'lodash';

import {
  Caption,
  Divider,
  FormGroup,
  Screen,
  ScrollView,
  Spinner,
  TextInput,
  View,
} from '@shoutem/ui';

import { NavigationBar } from '@shoutem/ui/navigation';
import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import { ext } from '../../const';
import CartFooter from '../../components/CartFooter';
import { payment as paymentShape } from '../../components/shapes';
import { completeCheckout } from '../../redux/actionCreators';

const { func } = PropTypes;

const renderProcessingPaymentMessage = () => <Spinner styleName="xl-gutter-top" />;

/**
 * Lets the user enter his credit card details and complete the checkout.
 */
class PaymentScreen extends Component {
  static propTypes = {
    // Dispatched when the user tries to make a payment
    completeCheckout: func,
    // Payment processing status and card details
    payment: paymentShape,
  };

  constructor(props) {
    super(props);
    this.completeCheckout = this.completeCheckout.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.fields = [{
      name: 'number',
      label: 'Card number',
      keyboardType: 'numeric',
    },
    {
      name: 'expiryMonth',
      label: 'Expiry month (mm)',
      keyboardType: 'numeric',
    },
    {
      name: 'expiryYear',
      label: 'Expiry year (yy)',
      keyboardType: 'numeric',
    },
    {
      name: 'cvv',
      label: 'Security code',
      keyboardType: 'numeric',
    },
    {
      name: 'firstName',
      label: 'First name',
    },
    {
      name: 'lastName',
      label: 'Last name',
    }]

    this.state = {};
  }

  completeCheckout() {
    const { completeCheckout } = this.props;

    const values = _.map(this.fields, ({ name }) => this.state[name]);
    if (_.some(values, _.isEmpty)) {
      Alert.alert(I18n.t(ext('paymentInfoFormErrorTitle')), I18n.t(ext('paymentInfoFormErrorMessage')));
      return;
    }
    const creditCard = _.reduce(this.fields, (result, field) => {
      const { name } = field;
      return { ...result, [name]: this.state[name] };
    }, {});

    completeCheckout(creditCard);
  }

  renderInput(field) {
    const { name, label, keyboardType } = field;

    return (
      <FormGroup key={name}>
        <Caption>{label.toUpperCase()}</Caption>
        <TextInput
          placeholder={label}
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

  renderPaymentForm() {
    return (
      <View styleName="flexible">
        <ScrollView style={{ paddingTop: 30 }}>
          {_.map(this.fields, this.renderInput)}
        </ScrollView>
        <Divider styleName="line" />
        <CartFooter
          action={I18n.t(ext('completePaymentButton'))}
          onActionButtonClicked={this.completeCheckout}
          withShipping
        />
      </View>
    );
  }

  render() {
    const { isProcessing } = this.props.payment;

    return (
      <Screen>
        <NavigationBar
          title={I18n.t(ext('paymentScreenNavBarTitle'))}
        />
        { isProcessing ? renderProcessingPaymentMessage() : this.renderPaymentForm() }
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const { payment } = state[ext()];

  return {
    payment,
  };
};

export default connect(mapStateToProps, { completeCheckout })(
  connectStyle(ext('PaymentScreen'))(PaymentScreen),
);

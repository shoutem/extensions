import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import CashierForm from './CashierForm';

export default class CashierFormWrapper extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      currentPlaceId: props.initialPlaceId,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { initialPlaceId } = this.props;
    const { initialPlaceId: nextInitialPlaceId } = nextProps;

    if (initialPlaceId !== nextInitialPlaceId) {
      this.setState({ currentPlaceId: initialPlaceId });
    }
  }

  handleCashierSubmit(values) {
    const { currentPlaceId } = this.state;
    const cashier = { ...values, location: currentPlaceId };
    return this.props.onSubmit(cashier);
  }

  handlePlaceChange(placeId) {
    this.setState({ currentPlaceId: placeId });
  }

  render() {
    const { currentPlaceId } = this.state;

    return (
      <CashierForm
        {...this.props}
        currentPlaceId={currentPlaceId}
        onPlaceChange={this.handlePlaceChange}
        onSubmit={this.handleCashierSubmit}
      />
    );
  }
}

CashierFormWrapper.propTypes = {
  initialPlaceId: PropTypes.string,
  onSubmit: PropTypes.func,
};

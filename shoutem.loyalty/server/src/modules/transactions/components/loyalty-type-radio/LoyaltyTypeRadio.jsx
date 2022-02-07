import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { Radio } from '@shoutem/react-web-ui';

export default class LoyaltyTypeRadio extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleRadioClick() {
    const { loyaltyType, onSelected } = this.props;
    onSelected(loyaltyType);
  }

  render() {
    const { loyaltyType, currentLoyaltyType, children } = this.props;

    return (
      <Radio
        checked={loyaltyType === currentLoyaltyType}
        inline
        name="loyalty-type-radio"
        onClick={this.handleRadioClick}
      >
        {children}
      </Radio>
    );
  }
}

LoyaltyTypeRadio.propTypes = {
  loyaltyType: PropTypes.string,
  currentLoyaltyType: PropTypes.string,
  onSelected: PropTypes.func,
  children: PropTypes.node,
};

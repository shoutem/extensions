import React, { Component, PropTypes } from 'react';
import { Radio } from '@shoutem/react-web-ui';

export default class LoyaltyTypeRadio extends Component {
  constructor(props) {
    super(props);

    this.handleRadioClick = this.handleRadioClick.bind(this);
  }

  handleRadioClick() {
    const { loyaltyType, onSelected } = this.props;
    onSelected(loyaltyType);
  }

  render() {
    const {
      loyaltyType,
      currentLoyaltyType,
      children,
    } = this.props;

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


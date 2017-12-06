import React, { PropTypes } from 'react';
import _ from 'lodash';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { LOYALTY_TYPES } from 'src/const';
import LoyaltyTypeRadio from '../loyalty-type-radio';
import './style.scss';

export default function LoyaltyTypeRadioGroup({ loyaltyType, onLoyaltyTypeChanged }) {
  return (
    <FormGroup className="loyalty-type-radio-group">
      <ControlLabel>
        Type of loyalty
      </ControlLabel>
      <LoyaltyTypeRadio
        currentLoyaltyType={loyaltyType}
        loyaltyType={LOYALTY_TYPES.POINTS}
        onSelected={onLoyaltyTypeChanged}
      >
        Points card
      </LoyaltyTypeRadio>
      <LoyaltyTypeRadio
        currentLoyaltyType={loyaltyType}
        loyaltyType={LOYALTY_TYPES.PUNCH}
        onSelected={onLoyaltyTypeChanged}
      >
        Punch card
      </LoyaltyTypeRadio>
      <LoyaltyTypeRadio
        currentLoyaltyType={loyaltyType}
        loyaltyType={LOYALTY_TYPES.MULTI}
        onSelected={onLoyaltyTypeChanged}
      >
        Multicard
      </LoyaltyTypeRadio>
    </FormGroup>
  );
}

LoyaltyTypeRadioGroup.propTypes = {
  loyaltyType: PropTypes.oneOf(_.values(LOYALTY_TYPES)),
  onLoyaltyTypeChanged: PropTypes.func,
};

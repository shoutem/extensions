import React from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LOYALTY_TYPES } from 'src/const';
import LoyaltyTypeRadio from '../loyalty-type-radio';
import LOCALIZATION from './localization';
import './style.scss';

export default function LoyaltyTypeRadioGroup({
  loyaltyType,
  onLoyaltyTypeChanged,
}) {
  return (
    <FormGroup className="loyalty-type-radio-group">
      <ControlLabel>
        {i18next.t(LOCALIZATION.TYPE_OF_LOYALTY_TITLE)}
      </ControlLabel>
      <LoyaltyTypeRadio
        currentLoyaltyType={loyaltyType}
        loyaltyType={LOYALTY_TYPES.POINTS}
        onSelected={onLoyaltyTypeChanged}
      >
        {i18next.t(LOCALIZATION.POINTS_CARD_TITLE)}
      </LoyaltyTypeRadio>
      <LoyaltyTypeRadio
        currentLoyaltyType={loyaltyType}
        loyaltyType={LOYALTY_TYPES.PUNCH}
        onSelected={onLoyaltyTypeChanged}
      >
        {i18next.t(LOCALIZATION.PUNCH_CARD_TITLE)}
      </LoyaltyTypeRadio>
      <LoyaltyTypeRadio
        currentLoyaltyType={loyaltyType}
        loyaltyType={LOYALTY_TYPES.MULTI}
        onSelected={onLoyaltyTypeChanged}
      >
        {i18next.t(LOCALIZATION.MULTICARD_TITLE)}
      </LoyaltyTypeRadio>
    </FormGroup>
  );
}

LoyaltyTypeRadioGroup.propTypes = {
  loyaltyType: PropTypes.oneOf(_.values(LOYALTY_TYPES)),
  onLoyaltyTypeChanged: PropTypes.func,
};

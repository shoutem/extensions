import React from 'react';
import PropTypes from 'prop-types';
import { Subtitle, Overlay } from '@shoutem/ui';

export const PriceOverlay = ({ price }) => {
  if (!price) {
    return null;
  }

  return (
    <Overlay>
      <Subtitle styleName="sm-gutter-horizontal">{price}</Subtitle>
    </Overlay>
  );
};

PriceOverlay.propTypes = {
  price: PropTypes.number,
};

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';

const DEFAULT_TITLE = 'Default Title';

function CartCaption({ item, variantTitle, quantity }) {
  const variantText = useMemo(() => {
    if (variantTitle === item.title || variantTitle === DEFAULT_TITLE) {
      return '';
    }

    return `${variantTitle}  ·  `;
  }, [item.title, variantTitle]);

  return (
    <Caption ellipsizeMode="middle" numberOfLines={1}>
      {variantText}
      {I18n.t(ext('itemQuantity'))}
      {quantity}
    </Caption>
  );
}

CartCaption.propTypes = {
  item: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
  variantTitle: PropTypes.string,
};

CartCaption.defaultProps = {
  variantTitle: DEFAULT_TITLE,
};

export default connectStyle(ext('CartCaption'))(CartCaption);

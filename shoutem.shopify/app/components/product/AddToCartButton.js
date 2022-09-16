import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';

function AddToCartButton({ onPress, isFeatured, showTitle, style }) {
  const resolvedIconStyle = useMemo(
    () => [style.icon, isFeatured && style.featuredIcon],
    [isFeatured, style],
  );

  return (
    <Button onPress={onPress} style={style.container}>
      <Icon
        name="add-to-cart"
        width={style.iconSize}
        height={style.iconSize}
        style={resolvedIconStyle}
      />
      {showTitle && (
        <Text style={style.title}>{I18n.t(ext('addToCartButton'))}</Text>
      )}
    </Button>
  );
}

AddToCartButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  isFeatured: PropTypes.bool,
  showTitle: PropTypes.bool,
  style: PropTypes.object,
};

AddToCartButton.defaultProps = {
  isFeatured: false,
  showTitle: false,
  style: {},
};

export default connectStyle(ext('AddToCartButton'))(
  React.memo(AddToCartButton),
);

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Text, View } from '@shoutem/ui';
import { ext } from '../../const';

function CartIcon({ cartSize, onPress, style, iconProps }) {
  const badge = useMemo(() => (cartSize < 10 ? cartSize : '...'), [cartSize]);

  return (
    <Button styleName="clear" style={style} onPress={onPress}>
      <Icon name="cart" {...iconProps} />
      {!!cartSize && (
        <View styleName="badge">
          <Text>{badge}</Text>
        </View>
      )}
    </Button>
  );
}

CartIcon.propTypes = {
  cartSize: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  iconProps: PropTypes.object,
  style: PropTypes.object,
};

CartIcon.defaultProps = {
  style: {},
  iconProps: {},
};

export default connectStyle(ext('CartIcon'), {}, () => {}, { virtual: true })(
  CartIcon,
);

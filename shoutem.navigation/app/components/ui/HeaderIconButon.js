import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@shoutem/ui';

export default function HeaderIconButton({ onPress, tintColor, iconName }) {
  return (
    <Button
      styleName="clear tight"
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Icon name={iconName} style={tintColor} />
    </Button>
  );
}

HeaderIconButton.propTypes = {
  onPress: PropTypes.func,
  tintColor: PropTypes.object,
  iconName: PropTypes.string.isRequired,
};

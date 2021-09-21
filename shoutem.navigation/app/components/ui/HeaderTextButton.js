import React from 'react';
import PropTypes from 'prop-types';
import { Button, Subtitle } from '@shoutem/ui';

export default function HeaderTextButton({ onPress, tintColor, title }) {
  return (
    <Button
      styleName="clear tight"
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Subtitle style={{ color: tintColor.color }}>{title}</Subtitle>
    </Button>
  );
}

HeaderTextButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  tintColor: PropTypes.object,
};

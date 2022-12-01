import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, TouchableOpacity } from '@shoutem/ui';
import { ext } from '../../const';

export function QuickAddOptionItem({ name, onPress, selected, style }) {
  function handlePress() {
    onPress(name);
  }

  return (
    <TouchableOpacity
      style={[style.container, selected && style.selectedContainer]}
      onPress={handlePress}
      disabled={selected}
    >
      <Text style={[style.title, selected && style.selectedTitle]}>{name}</Text>
    </TouchableOpacity>
  );
}

QuickAddOptionItem.propTypes = {
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  style: PropTypes.object,
};

QuickAddOptionItem.defaultProps = {
  selected: false,
  style: {},
};

export default connectStyle(ext('QuickAddOptionItem'))(QuickAddOptionItem);

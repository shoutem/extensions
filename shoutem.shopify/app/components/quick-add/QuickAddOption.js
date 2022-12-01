import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { ext } from '../../const';
import QuickAddOptionItem from './QuickAddOptionItem';

export function QuickAddOption({
  option,
  onValueSelected,
  selectedValue,
  style,
}) {
  function handleValueSelected(value) {
    onValueSelected({
      name: option.name,
      value,
    });
  }

  return (
    <View style={style.container}>
      <Text style={style.caption}>{option.name}</Text>
      <View style={style.valuesContainer}>
        {_.map(option.values, value => (
          <QuickAddOptionItem
            key={value}
            name={value}
            onPress={handleValueSelected}
            selected={selectedValue === value}
          />
        ))}
      </View>
    </View>
  );
}

QuickAddOption.propTypes = {
  option: PropTypes.shape({
    name: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onValueSelected: PropTypes.func.isRequired,
  selectedValue: PropTypes.string,
  style: PropTypes.object,
};

QuickAddOption.defaultProps = {
  selectedValue: undefined,
  style: {},
};

export default connectStyle(ext('QuickAddOption'))(QuickAddOption);

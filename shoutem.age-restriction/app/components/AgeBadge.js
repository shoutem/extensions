import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { ext } from '../const';

export function AgeBadge({ age, style }) {
  return (
    <View style={style.container}>
      <Text style={style.text}>{age}</Text>
    </View>
  );
}

AgeBadge.propTypes = {
  age: PropTypes.string.isRequired,
  style: PropTypes.object,
};

AgeBadge.defaultProps = {
  style: {},
};

export default connectStyle(ext('AgeBadge'))(React.memo(AgeBadge));

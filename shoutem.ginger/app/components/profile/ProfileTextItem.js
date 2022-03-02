import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Divider, Text, View } from '@shoutem/ui';
import { ext } from '../../const';

function ProfileTextItem({ label, value, style }) {
  if (_.isEmpty(value)) {
    return null;
  }

  return (
    <>
      <View styleName="horizontal v-center md-gutter-horizontal sm-gutter-vertical">
        <View style={style.labelContainer}>
          <Text style={style.label}>{_.upperFirst(label)}</Text>
        </View>
        <View styleName="flexible md-gutter-horizontal">
          <Text>{value}</Text>
        </View>
      </View>
      <Divider styleName="line" style={style.divider} />
    </>
  );
}

ProfileTextItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
};

ProfileTextItem.defaultProps = {
  style: {},
};

export default connectStyle(ext('ProfileTextItem'))(ProfileTextItem);

import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Divider, Icon, Row, Text, TouchableOpacity } from '@shoutem/ui';
import { ext } from '../const';

function SettingDetailsNavigationItem({ disabled, onPress, style, title }) {
  const resolvedStyleName = disabled ? 'muted' : '';

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Row styleName="small">
        <Text styleName={resolvedStyleName}>{title}</Text>
        <Icon name="right-arrow" style={style.icon} />
      </Row>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
}

SettingDetailsNavigationItem.propTypes = {
  disabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default connectStyle(ext('SettingDetailsNavigationItem'))(
  SettingDetailsNavigationItem,
);

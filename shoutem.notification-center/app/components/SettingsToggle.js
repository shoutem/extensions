import React from 'react';
import { Platform, Switch } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Divider, Row, Text, View } from '@shoutem/ui';
import { ext } from '../const';

function SettingsToggle({ onChange, style, title, value }) {
  const resolvedThumbColor = Platform.OS === 'ios' ? null : style.trackColor;

  return (
    <View>
      <Row styleName="small space-between">
        <Text>{title}</Text>
        <Switch
          ios_backgroundColor={{ true: style.trackColor }}
          onChange={onChange}
          thumbColor={resolvedThumbColor}
          trackColor={{ true: style.trackColor }}
          value={value}
        />
      </Row>
      <Divider styleName="line" />
    </View>
  );
}

SettingsToggle.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
};

export default connectStyle(ext('SettingsToggle'))(SettingsToggle);

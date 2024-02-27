import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Divider, Row, Switch, Text, View } from '@shoutem/ui';
import { ext } from '../const';

function SettingsToggle({ onChange, title, value }) {
  return (
    <View>
      <Row styleName="small space-between">
        <Text>{title}</Text>
        <Switch value={value} onValueChange={onChange} />
      </Row>
      <Divider styleName="line" />
    </View>
  );
}

SettingsToggle.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default connectStyle(ext('SettingsToggle'))(SettingsToggle);

import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Text, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../../const';

const SettingsOption = ({ text, iconName, onPress, style }) => (
  <TouchableOpacity
    onPress={onPress}
    styleName="md-gutter-vertical sm-gutter-horizontal"
  >
    <View styleName="horizontal v-center space-between">
      <View styleName="horizontal v-center">
        <Icon name={iconName} style={style.icon} />
        <Text styleName="sm-gutter-left" style={style.text}>
          {text}
        </Text>
      </View>
      <Icon name="right-arrow" style={style.arrowIcon} />
    </View>
  </TouchableOpacity>
);

SettingsOption.propTypes = {
  iconName: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default connectStyle(ext('SettingsOption'))(SettingsOption);

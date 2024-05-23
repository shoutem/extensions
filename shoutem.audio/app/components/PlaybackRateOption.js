import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Icon, Text, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const PlaybackRateOption = ({ text, value, selected, onPress, style }) => (
  <TouchableOpacity
    onPress={() => onPress(value)}
    styleName="md-gutter-vertical lg-gutter-horizontal"
  >
    <View styleName="horizontal v-center">
      {selected && <Icon name="checkbox-on" style={style.icon} />}
      <Text styleName={selected ? 'sm-gutter-left' : 'lg-gutter-left'}>
        {text}
        {value === 1 && (
          <Caption>{` ${I18n.t(ext('normalRateCaption'))}`}</Caption>
        )}
      </Text>
    </View>
  </TouchableOpacity>
);

PlaybackRateOption.propTypes = {
  style: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

PlaybackRateOption.defaultProps = { selected: false };

export default connectStyle(ext('PlaybackRateOption'))(PlaybackRateOption);

import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, TouchableOpacity } from '@shoutem/ui';
import { ext } from '../../const';

const SkipTrackControl = ({ onPress, disabled, style }) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={onPress}
    style={[style.button, disabled && style.disabled]}
  >
    <Icon name="skip-next" style={style.skipIcon} />
  </TouchableOpacity>
);

SkipTrackControl.propTypes = {
  style: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

SkipTrackControl.defaultProps = {
  disabled: false,
};

export default connectStyle(ext('SkipTrackControl'))(SkipTrackControl);

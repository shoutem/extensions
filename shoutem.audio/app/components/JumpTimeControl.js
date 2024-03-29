import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon } from '@shoutem/ui';
import { ext } from '../const';

export const JumpTimeControl = ({ iconName, disabled, onPress, style }) => (
  <Button
    disabled={disabled}
    onPress={onPress}
    style={[disabled && style.disabled, style.container]}
    styleName="clear"
  >
    <Icon name={iconName} style={style.icon} />
  </Button>
);

JumpTimeControl.propTypes = {
  iconName: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

JumpTimeControl.defaultProps = {
  disabled: false,
  style: {},
};

export default connectStyle(ext('JumpTimeControl'))(JumpTimeControl);

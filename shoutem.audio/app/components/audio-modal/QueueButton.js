import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, TouchableOpacity } from '@shoutem/ui';
import { ext } from '../../const';

/**
 * Button that opens queue list view inside audio modal.
 */
const QueueButton = ({ onPress, style }) => (
  <TouchableOpacity style={style.container} onPress={onPress}>
    <Icon name="queue" />
  </TouchableOpacity>
);

QueueButton.propTypes = {
  style: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default connectStyle(ext('QueueButton'))(QueueButton);

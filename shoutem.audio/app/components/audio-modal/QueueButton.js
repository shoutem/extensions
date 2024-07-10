import React from 'react';
import PropTypes from 'prop-types';
import { Icon, TouchableOpacity } from '@shoutem/ui';

/**
 * Button that opens queue list view inside audio modal.
 */
const QueueButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name="queue" />
    </TouchableOpacity>
  );
};

QueueButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default QueueButton;

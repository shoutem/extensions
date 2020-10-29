import React from 'react';
import PropTypes from 'prop-types';

export default function None() {
  return <div />;
}

None.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  childShortcuts: PropTypes.array.isRequired,
};

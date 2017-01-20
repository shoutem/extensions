import React, { PropTypes } from 'react';

export default class None extends React.Component {
  render() {
    return (
      <div></div>
    );
  }
}

None.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  childShortcuts: PropTypes.array.isRequired,
};

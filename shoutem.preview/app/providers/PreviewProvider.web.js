import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';


export function PreviewProvider({ children }) {
  return children;
}

PreviewProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default React.memo(PreviewProvider);

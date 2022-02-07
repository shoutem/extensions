import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ext } from '../const';
import { getAccessToken } from '../redux';

export const AuthContext = React.createContext();

export function AuthProvider({ accessToken, content }) {
  const context = { [ext()]: { accessToken } };

  return <AuthContext.Provider value={context}>{content}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  content: PropTypes.node.isRequired,
  accessToken: PropTypes.string,
};

AuthProvider.defaultProps = {
  accessToken: undefined,
};

function mapStateToProps(state) {
  return {
    accessToken: getAccessToken(state),
  };
}

export default connect(mapStateToProps)(AuthProvider);

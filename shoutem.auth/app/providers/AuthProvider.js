import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { after, priorities, setPriority } from 'shoutem-core';
import { ext } from '../const';
import { getAccessToken, getUser } from '../redux';

export const AuthContext = React.createContext();

function AuthProvider({ accessToken, children, user }) {
  const context = { [ext()]: { accessToken, user } };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  accessToken: PropTypes.string,
  user: PropTypes.object,
};

AuthProvider.defaultProps = {
  accessToken: undefined,
  user: {},
};

function mapStateToProps(state) {
  return {
    accessToken: getAccessToken(state),
    user: getUser(state),
  };
}

const ConnectedAuthProvider = connect(mapStateToProps, null)(AuthProvider);

export const renderProvider = setPriority(children => {
  return <ConnectedAuthProvider>{children}</ConnectedAuthProvider>;
}, after(priorities.REDUX));

import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors } from '../redux';

export const LocalizationContext = React.createContext();

function LocalizationProvider({ children, selectedLocale }) {
  return (
    <LocalizationContext.Provider value={selectedLocale}>
      {children}
    </LocalizationContext.Provider>
  );
}

LocalizationProvider.propTypes = {
  children: PropTypes.node,
  context: PropTypes.object,
  selectedLocale: PropTypes.string
};

const mapStateToProps = state => ({
  selectedLocale: selectors.getSelectedLocale(state),
});

export default connect(mapStateToProps, null)(LocalizationProvider);

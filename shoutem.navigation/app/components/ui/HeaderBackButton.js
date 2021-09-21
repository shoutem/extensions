import React from 'react';
import PropTypes from 'prop-types';
import HeaderIconButton from './HeaderIconButon';

export default function HeaderBackButton(props) {
  return <HeaderIconButton iconName="back" {...props} />;
}

HeaderBackButton.propTypes = {
  onPress: PropTypes.func,
  tintColor: PropTypes.object,
};

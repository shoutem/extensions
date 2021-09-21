import React from 'react';
import PropTypes from 'prop-types';
import HeaderIconButton from './HeaderIconButon';

export default function HeaderCloseButton(props) {
  return <HeaderIconButton iconName="close" {...props} />;
}

HeaderCloseButton.propTypes = {
  onPress: PropTypes.func,
  tintColor: PropTypes.object,
};

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormInput } from '@shoutem/react-web-ui';
import './style.scss';

export default function FormTextInput({ isMultiLine, label, value }) {
  const element = isMultiLine ? 'textarea' : 'input';
  const classes = classNames({
    'form-text-input__textarea': isMultiLine,
  });

  return (
    <FormInput
      className={classes}
      element={element}
      name={label}
      value={value}
      readOnly
    />
  );
}

FormTextInput.propTypes = {
  isMultiLine: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

FormTextInput.defaultProps = {
  value: '',
};

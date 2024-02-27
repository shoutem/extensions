import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { TextInput } from './shared';

const FormInput = React.forwardRef((props, ref) => {
  const {
    emptyFieldErrorMessage = I18n.t(
      ext('pushNotificationsInputRequiredFieldError'),
    ),
    onChangeText,
    onSubmitEditing,
    required,
    value,
    ...otherProps
  } = props;

  const [error, setError] = useState();

  function handleSubmit() {
    if (required && _.isEmpty(value)) {
      return setError(emptyFieldErrorMessage);
    }

    if (_.isFunction(onSubmitEditing)) {
      onSubmitEditing();
    }

    return setError(null);
  }

  function handleTextChange(value) {
    setError(null);

    if (_.isFunction(onChangeText)) {
      onChangeText(value);
    }
  }

  return (
    <TextInput
      ref={ref}
      errorMessage={error}
      value={value}
      onBlur={handleSubmit}
      onChangeText={handleTextChange}
      onSubmitEditing={handleSubmit}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...otherProps}
    />
  );
});

FormInput.displayName = 'FormInput';

FormInput.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  emptyFieldErrorMessage: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  onSubmitEditing: PropTypes.func,
};

FormInput.defaultProps = {
  emptyFieldErrorMessage: undefined,
  onSubmitEditing: null,
  required: true,
  value: undefined,
};

export default FormInput;

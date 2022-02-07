import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from '@shoutem/ui';
import { useForm } from '../hooks';

export default function Form({
  containerStyle,
  initialValues,
  onSubmit,
  schema,
  SubmitButtonComponent,
}) {
  const form = useForm({ schema, initialValues, onSubmit });

  return (
    <ScrollView contentContainerStyle={containerStyle}>
      {form.renderFields()}
      {form.renderSubmitButton(SubmitButtonComponent)}
    </ScrollView>
  );
}

Form.propTypes = {
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  initialValues: PropTypes.object,
  SubmitButtonComponent: PropTypes.node,
};

Form.defaultProps = {
  containerStyle: {},
  initialValues: {},
  SubmitButtonComponent: null,
};

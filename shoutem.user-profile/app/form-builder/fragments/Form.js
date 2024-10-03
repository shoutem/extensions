import React from 'react';
import { KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';
import { Keyboard, ScrollView } from '@shoutem/ui';
import { isAndroid } from 'shoutem-core';
import { useForm } from '../hooks';

const KEYBOARD_AVOIDING_BEHAVIOUR = isAndroid ? 'null' : 'padding';
const KEYBOARD_DISMISS_MODE = isAndroid ? 'on-drag' : 'interactive';

export default function Form({
  containerStyle,
  initialValues,
  onSubmit,
  schema,
  SubmitButtonComponent,
}) {
  const KEYBOARD_OFFSET = Keyboard.calculateKeyboardOffset();

  const form = useForm({ schema, initialValues, onSubmit });

  return (
    <KeyboardAvoidingView
      behavior={KEYBOARD_AVOIDING_BEHAVIOUR}
      keyboardVerticalOffset={KEYBOARD_OFFSET}
    >
      <ScrollView
        keyboardDismissMode={KEYBOARD_DISMISS_MODE}
        styleName="flexible"
        contentContainerStyle={containerStyle}
      >
        {form.renderFields()}
        {form.renderSubmitButton(SubmitButtonComponent)}
      </ScrollView>
    </KeyboardAvoidingView>
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

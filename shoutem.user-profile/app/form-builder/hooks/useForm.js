import { useEffect, useState } from 'react';
import _ from 'lodash';
import { FormBuilder } from '../services';

export function useForm({ schema, initialValues, onSubmit }) {
  const [values, setValues] = useState({});
  const [fields, setFields] = useState({});

  function setInitialValues() {
    if (!_.isEmpty(initialValues)) {
      return setValues(initialValues);
    }

    // If initial values aren't provided, set all fields to empty state
    const emptyStateValues = _.reduce(
      fields,
      (result, field) => ({
        ...result,
        [field.fieldName]: '',
      }),
      {},
    );

    return setValues(emptyStateValues);
  }

  function registerFields() {
    const resolvedFields = _.reduce(
      schema,
      (result, field, key) => {
        if (field.editable === false) {
          return result;
        }

        return {
          ...result,
          [key]: {
            ...field,
            fieldName: key,
          },
        };
      },
      [],
    );

    setFields(resolvedFields);
  }

  useEffect(() => {
    registerFields();
    setInitialValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderFields() {
    const fieldValues = _.values(fields);
    const sortedfields = _.sortBy(fieldValues, 'displayPriority');

    return _.map(sortedfields, field =>
      FormBuilder.mapFormFieldToView(
        field,
        handleValueChange,
        getValue,
        getError,
      ),
    );
  }

  function renderSubmitButton(CustomSubmitButton = null) {
    const onPress = () => submit(onSubmit);

    return FormBuilder.mapSubmitButtonToView(onPress, CustomSubmitButton);
  }

  function clearFieldError(name) {
    setFields({
      ...fields,
      [name]: { ...fields[name], hasError: false, errorMessage: null },
    });
  }

  function handleValueChange(name, value) {
    if (getError(name)) {
      clearFieldError(name);
    }

    setValues(values => ({ ...values, [name]: value }));
  }

  function getValue(name, defaultValue = null) {
    return values[name] || defaultValue;
  }

  function getError(name) {
    const { hasError = false, errorMessage = null } = fields[name];

    return {
      hasError,
      errorMessage,
    };
  }

  function validateFields() {
    let isValid = true;

    const updatedFields = _.reduce(
      fields,
      (result, field, key) => {
        const { required, fieldName } = field;
        const isRequired = required?.value || false;
        const errorMessage = required?.errorMessage;

        const value = values[fieldName];

        const isRequiredAndEmpty = isRequired && _.isEmpty(value);

        if (isRequiredAndEmpty) {
          isValid = false;
        }

        const resolvedErrorMessage = !isRequiredAndEmpty ? null : errorMessage;

        return {
          ...result,
          [key]: {
            ...fields[key],
            hasError: isRequiredAndEmpty,
            errorMessage: resolvedErrorMessage,
          },
        };
      },
      {},
    );

    setFields(updatedFields);

    return isValid;
  }

  function submit() {
    const isValid = validateFields();

    if (isValid && _.isFunction(onSubmit)) {
      return onSubmit(values);
    }

    return null;
  }

  return {
    renderFields,
    renderSubmitButton,
    submit,
  };
}

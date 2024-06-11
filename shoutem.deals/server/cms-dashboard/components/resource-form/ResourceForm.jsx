import React from 'react';
import { Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getFormState } from '../../redux';
import {
  getEditorCreateAbortButtonLabel,
  getEditorCreateConfirmButtonLabel,
  getEditorUpdateAbortButtonLabel,
  getEditorUpdateConfirmButtonLabel,
  getFormPropertyKeys,
  resolveIsArrayPropertiesChanged,
  resolveSchemaElements,
  validateResourceForm,
} from '../../services';
import './style.scss';

function ResourceForm({
  schema,
  canonicalName,
  assetManager,
  submitting,
  pristine,
  fields,
  onCancel,
  touch,
  loadSchema,
  loadResources,
  googleApiKey,
  handleSubmit,
  ownInitialValues,
  values,
  error,
}) {
  const id = _.get(fields, 'id');
  const inEditMode = !_.isEmpty(id.value);

  // needs to be calculated again, as error prop is not returing validation errors
  // fixed in v6 redux-form, but we are using v5
  const validationErrors = validateResourceForm(schema, values);

  let disabled = submitting || pristine || !_.isEmpty(validationErrors);
  if (disabled) {
    // needs to be calculated manually, as touch or pristine don't work for arrays
    // fixed in v6 redux-form, but we are using v5
    disabled = !resolveIsArrayPropertiesChanged(
      schema,
      values,
      ownInitialValues,
    );
  }

  const options = {
    assetManager,
    canonicalName,
    googleApiKey,
    touch,
    loadSchema,
    loadResources,
  };
  const elements = resolveSchemaElements(schema, fields, options);

  return (
    <form className="resource-form" onSubmit={handleSubmit}>
      {elements}
      <ButtonToolbar>
        <Button
          bsSize="large"
          bsStyle="primary"
          disabled={disabled}
          type="submit"
        >
          <LoaderContainer isLoading={submitting}>
            {inEditMode
              ? getEditorUpdateConfirmButtonLabel(schema)
              : getEditorCreateConfirmButtonLabel(schema)}
          </LoaderContainer>
        </Button>
        <Button bsSize="large" disabled={submitting} onClick={onCancel}>
          {inEditMode
            ? getEditorUpdateAbortButtonLabel(schema)
            : getEditorCreateAbortButtonLabel(schema)}
        </Button>
      </ButtonToolbar>
      {error && (
        <div className="has-error">
          <HelpBlock>{error}</HelpBlock>
        </div>
      )}
    </form>
  );
}

ResourceForm.propTypes = {
  assetManager: PropTypes.object,
  canonicalName: PropTypes.string,
  error: PropTypes.string,
  fields: PropTypes.object,
  googleApiKey: PropTypes.string,
  handleSubmit: PropTypes.func,
  loadResources: PropTypes.func,
  loadSchema: PropTypes.func,
  ownInitialValues: PropTypes.func,
  pristine: PropTypes.bool,
  schema: PropTypes.object,
  submitting: PropTypes.bool,
  touch: PropTypes.func,
  values: PropTypes.object,
  onCancel: PropTypes.func,
};

export function resolveResourceForm(schema) {
  const formKey = _.get(schema, 'name', 'resource');
  const propertyKeys = getFormPropertyKeys(schema);

  return reduxForm({
    getFormState,
    form: formKey,
    fields: ['id', ...propertyKeys],
    validate: resource => validateResourceForm(schema, resource),
  })(ResourceForm);
}

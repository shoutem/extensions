import React, { useCallback, useState } from 'react';
import { Button, ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormInput, LoaderContainer } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default function AppForm({ app, onSubmit }) {
  const initialPropertyId = app?.propertyId || '';
  const initialServiceAccountKeyJson = app?.serviceAccountKeyJson || '';

  const [propertyId, setPropertyId] = useState(initialPropertyId);
  const [propertyIdError, setPropertyIdError] = useState(null);
  const [serviceAccountKeyJson, setServiceAccountKeyJson] = useState(
    initialServiceAccountKeyJson,
  );
  const [serviceAccountKeyJsonError, setServiceAccountKeyJsonError] = useState(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleOnChangePropertyId = useCallback(event => {
    setPropertyId(event?.target?.value);
    setPropertyIdError(null);
    setError(null);
  }, []);

  const handleOnChangeServiceAccountKeyJson = useCallback(event => {
    setServiceAccountKeyJson(event?.target?.value);
    setServiceAccountKeyJsonError(null);
    setError(null);
  }, []);

  const handleOnSubmit = useCallback(async () => {
    setError(null);

    if (_.isEmpty(propertyId)) {
      setPropertyIdError(i18next.t(LOCALIZATION.REQUIRED_FIELD_MESSAGE));
      return;
    }

    if (_.isEmpty(serviceAccountKeyJson)) {
      setServiceAccountKeyJsonError(
        i18next.t(LOCALIZATION.REQUIRED_FIELD_MESSAGE),
      );
      return;
    }

    setSubmitting(true);

    if (_.isFunction(onSubmit)) {
      try {
        await onSubmit({ propertyId, serviceAccountKeyJson });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        setError(i18next.t(LOCALIZATION.ERROR_MESSAGE));
      }
    }

    setSubmitting(false);
  }, [propertyId, serviceAccountKeyJson, onSubmit]);

  const calculateHasChanges = useCallback(() => {
    if (propertyId !== initialPropertyId) {
      return true;
    }

    if (serviceAccountKeyJson !== initialServiceAccountKeyJson) {
      return true;
    }

    return false;
  }, [
    propertyId,
    serviceAccountKeyJson,
    initialPropertyId,
    initialServiceAccountKeyJson,
  ]);

  const hasChanges = calculateHasChanges();
  const hasErrors = propertyIdError || serviceAccountKeyJsonError;

  return (
    <div className="app-form">
      <FormInput
        elementId="propertyId"
        name={i18next.t(LOCALIZATION.PROPERTY_ID)}
        value={propertyId}
        error={propertyIdError}
        debounceTimeout={0}
        onChange={handleOnChangePropertyId}
      />
      <FormGroup
        controlId="serviceAccountKeyJson"
        validationState={serviceAccountKeyJsonError ? 'error' : 'success'}
      >
        <ControlLabel>
          {i18next.t(LOCALIZATION.SERVICE_ACCOUNT_KEY_JSON)}
        </ControlLabel>
        <textarea
          className="form-control"
          cols="4"
          type="text"
          value={serviceAccountKeyJson}
          onChange={handleOnChangeServiceAccountKeyJson}
        />
        {!!serviceAccountKeyJsonError && (
          <HelpBlock>{serviceAccountKeyJsonError}</HelpBlock>
        )}
      </FormGroup>
      {error && (
        <FormGroup validationState="error">
          <HelpBlock>{error}</HelpBlock>
        </FormGroup>
      )}
      <div className="footer">
        <Button
          bsStyle="primary"
          bsSize="large"
          disabled={!hasChanges || hasErrors}
          type="submit"
          onClick={handleOnSubmit}
        >
          <LoaderContainer isLoading={submitting}>
            {i18next.t(LOCALIZATION.SAVE)}
          </LoaderContainer>
        </Button>
      </div>
    </div>
  );
}

AppForm.propTypes = {
  app: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

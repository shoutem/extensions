import React from 'react';
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { ext } from 'context';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { validateFirebaseConfig } from '../services';
import LOCALIZATION from './localization';
import './style.scss';

const renderFormGroup = (formElement, label, children) => {
  const error = formElement.touched && formElement.error;

  return (
    <FormGroup
      controlId={formElement.name}
      validationState={error ? 'error' : 'success'}
    >
      <ControlLabel>{label}</ControlLabel>
      {children}
      <HelpBlock>{error && <span>{error}</span>}</HelpBlock>
    </FormGroup>
  );
};

function SettingsForm({
  handleSubmit,
  submitting,
  globalError,
  pristine,
  fields: {
    projectName,
    serverKey,
    serviceAccountKeyJson,
    googleServicesJson,
    googleServiceInfoPlist,
  },
}) {
  return (
    <form className="firebase-settings-form" onSubmit={handleSubmit}>
      {renderFormGroup(
        projectName,
        i18next.t(LOCALIZATION.FORM_PROJECT_SLUG),
        <FormControl type="text" disabled={submitting} {...projectName} />,
      )}
      {serverKey?.value &&
        renderFormGroup(
          serverKey,
          i18next.t(LOCALIZATION.FORM_SERVER_KEY),
          <FormControl type="text" disabled {...serverKey} />,
        )}
      {renderFormGroup(
        serviceAccountKeyJson,
        i18next.t(LOCALIZATION.FORM_SERVICE_ACCOUNT_KEY_JSON),
        <textarea
          className="form-control"
          cols="4"
          type="text"
          disabled={submitting}
          {...serviceAccountKeyJson}
        />,
      )}
      {renderFormGroup(
        googleServicesJson,
        i18next.t(LOCALIZATION.FORM_GOOGLE_SERVICES_JSON),
        <textarea
          className="form-control"
          cols="4"
          type="text"
          disabled={submitting}
          {...googleServicesJson}
        />,
      )}
      {renderFormGroup(
        googleServiceInfoPlist,
        i18next.t(LOCALIZATION.FORM_GOOGLE_SERVICES_PLIST),
        <textarea
          className="form-control"
          cols="2"
          type="text"
          disabled={submitting}
          {...googleServiceInfoPlist}
        />,
      )}
      {globalError && (
        <div className="has-error">
          <HelpBlock>{globalError}</HelpBlock>
        </div>
      )}
      <div className="firebase-settings-form__footer">
        <Button
          bsStyle="primary"
          bsSize="large"
          disabled={submitting || pristine}
          type="submit"
        >
          <LoaderContainer isLoading={submitting}>
            {i18next.t(LOCALIZATION.BUTTON_SAVE)}
          </LoaderContainer>
        </Button>
      </div>
    </form>
  );
}

SettingsForm.propTypes = {
  fields: PropTypes.object.isRequired,
  globalError: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    googleServiceInfoPlist: PropTypes.string,
    googleServicesJson: PropTypes.string,
    projectName: PropTypes.string,
    serverKey: PropTypes.string,
    serviceAccountKeyJson: PropTypes.string,
  }).isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: `${ext()}-firebaseSettings`,
  fields: [
    'projectName',
    'serverKey',
    'serviceAccountKeyJson',
    'googleServicesJson',
    'googleServiceInfoPlist',
  ],
  validate: validateFirebaseConfig,
})(SettingsForm);

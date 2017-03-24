import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { ext } from 'context';
import { validateFirebaseConfig } from '../services';
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
      <HelpBlock>
        {error && <span>{error}</span>}
      </HelpBlock>
    </FormGroup>
  );
};

function SettingsForm({
  handleSubmit,
  submitting,
  globalError,
  fields: {
    projectName,
    serverKey,
    googleServicesJson,
    googleServiceInfoPlist,
  },
}) {
  return (
    <form
      className="firebase-settings-form"
      onSubmit={handleSubmit}
    >
      {renderFormGroup(projectName, 'Project slug', (
        <FormControl
          type="text"
          disabled={submitting}
          {...projectName}
        />
      ))}
      {renderFormGroup(serverKey, 'Server key', (
        <FormControl
          type="text"
          disabled={submitting}
          {...serverKey}
        />
      ))}
      {renderFormGroup(googleServicesJson, 'google-services.json (Android app)', (
        <textarea
          className="form-control"
          cols="4"
          type="text"
          disabled={submitting}
          {...googleServicesJson}
        />
      ))}
      {renderFormGroup(googleServiceInfoPlist, 'GoogleService-Info.plist (iOS app)', (
        <textarea
          className="form-control"
          cols="2"
          type="text"
          disabled={submitting}
          {...googleServiceInfoPlist}
        />
      ))}
      {globalError &&
        <div className="has-error">
          <HelpBlock>{globalError}</HelpBlock>
        </div>}
      <div className="firebase-settings-form__footer">
        <Button
          bsStyle="primary"
          bsSize="large"
          disabled={submitting}
          type="submit"
        >
          <LoaderContainer isLoading={submitting}>
            Save
          </LoaderContainer>
        </Button>
      </div>
    </form>
  );
}

SettingsForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  fields: PropTypes.object,
  globalError: PropTypes.string,
  initialValues: PropTypes.shape({
    projectName: PropTypes.string,
    serverKey: PropTypes.string,
    googleServicesJson: PropTypes.string,
    googleServiceInfoPlist: PropTypes.string,
  }),
};

SettingsForm.defaultProps = {
  currentConfig: {},
};

export default reduxForm({
  form: `${ext()}-firebaseSettings`,
  fields: ['projectName', 'serverKey', 'googleServicesJson', 'googleServiceInfoPlist'],
  validate: validateFirebaseConfig,
})(SettingsForm);

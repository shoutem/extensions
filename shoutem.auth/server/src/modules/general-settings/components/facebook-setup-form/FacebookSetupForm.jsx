import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { LoaderContainer, ReduxFormElement } from '@shoutem/react-web-ui';
import { Row, Col, Button, ButtonToolbar, HelpBlock, ControlLabel } from 'react-bootstrap';
import { getFormState } from 'src/redux';
import { validateProviderSetup } from '../../services';

export function FacebookSetupForm({
  submitting,
  pristine,
  fields,
  handleSubmit,
  error,
}) {
  const { appId, appName } = fields;
  const actionsDisabled = submitting || pristine;

  return (
    <form className="facebook-setup-form" onSubmit={handleSubmit}>
      <h3>Facebook Login setup</h3>
      <ControlLabel>
        You will need to setup a Facebook application to enable Facebook login.
      </ControlLabel>
      <Row>
        <Col xs="6">
          <ReduxFormElement
            disabled={submitting}
            elementId="appId"
            field={appId}
            name="App ID"
          />
        </Col>
        <Col xs="6">
          <ReduxFormElement
            disabled={submitting}
            elementId="facebookAppName"
            field={appName}
            name="App Name"
          />
        </Col>
      </Row>
      <ButtonToolbar>
        <Button bsStyle="primary" disabled={actionsDisabled} type="submit">
          <LoaderContainer isLoading={submitting}>
            Save
          </LoaderContainer>
        </Button>
      </ButtonToolbar>
      {error &&
        <div className="has-error">
          <HelpBlock>{error}</HelpBlock>
        </div>
      }
    </form>
  );
}

FacebookSetupForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  fields: PropTypes.object,
  error: PropTypes.string,
};

export default reduxForm({
  getFormState,
  form: 'facebookSetupForm',
  fields: [
    'appId',
    'appName',
  ],
  validate: validateProviderSetup,
})(FacebookSetupForm);

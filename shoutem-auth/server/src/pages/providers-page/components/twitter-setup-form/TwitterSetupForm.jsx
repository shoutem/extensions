import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { LoaderContainer, ReduxFormElement } from '@shoutem/react-web-ui';
import { Row, Col, Button, ButtonToolbar, HelpBlock, ControlLabel } from 'react-bootstrap';
import { getFormState } from 'src/redux';
import { validateProviderSetup } from '../../services';

export function TwitterSetupForm({
  submitting,
  pristine,
  fields,
  handleSubmit,
  error,
  twitterSettingsUrl,
}) {
  const { consumerKey, consumerKeySecret } = fields;
  const actionsDisabled = submitting || pristine;

  return (
    <form className="twitter-setup-form" onSubmit={handleSubmit}>
      <h3>Twitter Login setup</h3>
      <ControlLabel>
        Make sure you’ve configured your Twitter app under application
        <a href={twitterSettingsUrl}> Settings</a>
      </ControlLabel>
      <Row>
        <Col xs="6">
          <ReduxFormElement
            elementId="consumerKey"
            name="Consumer Key"
            field={consumerKey}
            disabled={submitting}
          />
        </Col>
        <Col xs="6">
          <ReduxFormElement
            elementId="consumerKeySecret"
            name="Consumer Key Secret"
            field={consumerKeySecret}
            disabled={submitting}
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

TwitterSetupForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  fields: PropTypes.object,
  error: PropTypes.string,
  twitterSettingsUrl: PropTypes.string,
};

export default reduxForm({
  getFormState,
  form: 'twitterSetupForm',
  fields: [
    'consumerKey',
    'consumerKeySecret',
  ],
  validate: validateProviderSetup,
})(TwitterSetupForm);

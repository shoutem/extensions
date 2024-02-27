import React, { PureComponent } from 'react';
import {
  Alert,
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

export class TermsOfServicePage extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      termsOfServiceUrl: props.termsOfServiceUrl,
      loading: false,
      error: null,
    };
  }

  saveEnabled() {
    const { termsOfServiceUrl } = this.state;
    const { termsOfServiceUrl: oldTermsOfServiceUrl } = this.props;

    return (
      !_.isEmpty(termsOfServiceUrl) &&
      termsOfServiceUrl !== oldTermsOfServiceUrl
    );
  }

  handlePolicyChange(event) {
    const newText = event.target.value;

    this.setState({ termsOfServiceUrl: newText, error: null });
  }

  async handleSave() {
    const { extension, updateExtensionSettingsAction } = this.props;
    const { termsOfServiceUrl } = this.state;

    this.setState({ loading: true, error: null });

    try {
      await updateExtensionSettingsAction(extension, { termsOfServiceUrl });
      this.setState({ loading: false, error: null });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      this.setState({
        loading: false,
        error: i18next.t(LOCALIZATION.ERROR_MESSAGE),
      });
    }
  }

  render() {
    const { termsOfServiceUrl, loading, error } = this.state;

    const saveEnabled = this.saveEnabled();

    return (
      <div className="terms-of-service-page">
        <ControlLabel>{i18next.t(LOCALIZATION.HEADING_TITLE)}</ControlLabel>
        <Alert className="terms-of-service-alert-container">
          <div className="alert-title">
            {i18next.t(LOCALIZATION.ALERT_TITLE)}
          </div>
          {i18next.t(LOCALIZATION.ALERT_DESCRIPTION)}
        </Alert>
        <FormGroup>
          <ControlLabel>
            {i18next.t(LOCALIZATION.PRIVACY_POLICY_FORM_TITLE)}
          </ControlLabel>
          <FormControl
            className="form-control"
            onChange={this.handlePolicyChange}
            type="text"
            value={termsOfServiceUrl}
          />
        </FormGroup>
        {error && (
          <FormGroup validationState="error">
            <HelpBlock>{error}</HelpBlock>
          </FormGroup>
        )}
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!saveEnabled}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={loading}>
              {i18next.t(LOCALIZATION.SAVE_BUTTON)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

TermsOfServicePage.propTypes = {
  extension: PropTypes.object.isRequired,
  termsOfServiceUrl: PropTypes.string.isRequired,
  updateExtensionSettingsAction: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);

  return {
    extension,
    termsOfServiceUrl: _.get(extension, 'settings.termsOfServiceUrl'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExtensionSettingsAction: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfServicePage);

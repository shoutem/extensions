import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
  FormControl,
  Alert,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { updateExtensionSettings, getExtension } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

export class TermsOfServicePage extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      termsOfServiceUrl: props.termsOfServiceUrl,
      loading: false,
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

    this.setState({ termsOfServiceUrl: newText });
  }

  handleSave() {
    const { extension, updateExtensionSettingsAction } = this.props;
    const { termsOfServiceUrl } = this.state;

    this.setState({ loading: true });

    updateExtensionSettingsAction(extension, { termsOfServiceUrl })
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const { termsOfServiceUrl, loading } = this.state;

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
  termsOfServiceUrl: PropTypes.string,
  updateExtensionSettingsAction: PropTypes.func,
  extension: PropTypes.object,
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

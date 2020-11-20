import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
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

export class PrivacyPolicyPage extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      privacyPolicyUrl: props.privacyPolicyUrl,
      loading: false,
    };
  }

  saveEnabled() {
    const { privacyPolicyUrl } = this.state;
    const { privacyPolicyUrl: oldprivacyPolicyUrl } = this.props;

    return (
      !_.isEmpty(privacyPolicyUrl) && privacyPolicyUrl !== oldprivacyPolicyUrl
    );
  }

  handlePolicyChange(event) {
    const newText = event.target.value;

    this.setState({ privacyPolicyUrl: newText });
  }

  handleSave() {
    const { extension, updateExtensionSettingsAction } = this.props;
    const { privacyPolicyUrl } = this.state;

    this.setState({ loading: true });

    updateExtensionSettingsAction(extension, { privacyPolicyUrl })
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const { privacyPolicyUrl, loading } = this.state;

    const saveEnabled = this.saveEnabled();

    return (
      <div className="privacy-policy-page">
        <ControlLabel>{i18next.t(LOCALIZATION.HEADING_TITLE)}</ControlLabel>
        <Alert className="privacy-policy-alert-container">
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
            value={privacyPolicyUrl}
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

PrivacyPolicyPage.propTypes = {
  privacyPolicyUrl: PropTypes.string,
  updateExtensionSettingsAction: PropTypes.func,
  extension: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);

  return {
    extension,
    privacyPolicyUrl: _.get(extension, 'settings.privacyPolicyUrl'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExtensionSettingsAction: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicyPage);

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

export class PrivacyPolicyPage extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      privacyPolicyUrl: props.privacyPolicyUrl,
      loading: false,
      error: null,
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

    this.setState({ privacyPolicyUrl: newText, error: null });
  }

  async handleSave() {
    const { extension, updateExtensionSettingsAction } = this.props;
    const { privacyPolicyUrl } = this.state;

    this.setState({ loading: true, error: null });

    try {
      await updateExtensionSettingsAction(extension, { privacyPolicyUrl });
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
    const { privacyPolicyUrl, loading, error } = this.state;

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

PrivacyPolicyPage.propTypes = {
  extension: PropTypes.object.isRequired,
  privacyPolicyUrl: PropTypes.string.isRequired,
  updateExtensionSettingsAction: PropTypes.func.isRequired,
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

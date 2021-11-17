import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import { PERMISSIONS_DUMMY_JSON_URL } from '../../const';
import './style.scss';

class SettingsPage extends PureComponent {
  static propTypes = {
    extension: PropTypes.object.isRequired,
    updateExtensionSettings: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    const permissionsToOverwrite =
      props.extension.settings.permissionsToOverwrite;

    this.state = {
      error: null,
      inProgress: false,
      jsonError: null,
      permissionsToOverwrite,
      successfullyUpdated: false,
    };
  }

  handleSave() {
    const parsedJson = this.validateAndParseJson();

    if (!parsedJson) {
      return this.setState({
        jsonError: i18next.t(LOCALIZATION.INVALID_JSON_ERROR_TEXT),
        inProgress: false,
        successfullyUpdated: false,
      });
    }

    const { extension, updateExtensionSettings } = this.props;
    const { permissionsToOverwrite } = this.state;

    const newSettings = {
      permissionsToOverwrite: _.isEmpty(parsedJson)
        ? null
        : permissionsToOverwrite,
    };

    this.setState({ error: '', inProgress: true });

    return updateExtensionSettings(extension, newSettings)
      .then(() =>
        this.setState({
          inProgress: false,
          successfullyUpdated: true,
          permissionsToOverwrite: _.isEmpty(parsedJson)
            ? ''
            : permissionsToOverwrite,
        }),
      )
      .catch(() => {
        this.setState({
          error: i18next.t(LOCALIZATION.SETTINGS_UPDATE_ERROR),
          inProgress: false,
          successfullyUpdated: false,
        });
      });
  }

  handleTextAreaTextChange(event) {
    const permissionsToOverwrite = event.target.value;

    this.setState({
      permissionsToOverwrite,
      jsonError: null,
      successfullyUpdated: false,
    });
  }

  validateAndParseJson() {
    const { permissionsToOverwrite } = this.state;

    try {
      const parsedJson = JSON.parse(permissionsToOverwrite);

      // !_.isObject(parsedJson) - because double quotations are JSON parseable
      if (!parsedJson || !_.isObject(parsedJson)) {
        return null;
      }

      return parsedJson;
    } catch (e) {
      this.setState({
        jsonError: i18next.t(LOCALIZATION.INVALID_JSON_ERROR_TEXT),
        inProgress: false,
        successfullyUpdated: false,
      });

      return null;
    }
  }

  hasChanges() {
    const { permissionsToOverwrite: nextPermissionsToOverwrite } = this.state;
    const { extension } = this.props;
    const currentPermissionsToOverwrite = JSON.stringify(
      extension.settings.permissionsToOverwrite,
    );

    return currentPermissionsToOverwrite !== nextPermissionsToOverwrite;
  }

  render() {
    const {
      error,
      inProgress,
      jsonError,
      permissionsToOverwrite,
      successfullyUpdated,
    } = this.state;

    return (
      <div className="permissions-settings-page">
        <h3>{i18next.t(LOCALIZATION.PERMISSIONS_RATIONALE_TITLE)}</h3>
        <FormGroup>
          <ControlLabel>
            {i18next.t(LOCALIZATION.PERMISSIONS_OVERWRITE_DESCRIPTION)}
          </ControlLabel>
          <textarea
            className="form-control permissions-settings-page__permissions-overwrite-textarea"
            type="text"
            disabled={false}
            value={permissionsToOverwrite}
            onChange={this.handleTextAreaTextChange}
          />
          <HelpBlock className="text-error">
            {jsonError && <span>{jsonError}</span>}
          </HelpBlock>
        </FormGroup>
        <div className="permissions-settings-page__dummy_json">
          <p>
            <Trans i18nKey={LOCALIZATION.DOWNLOAD_DUMMY_JSON_TEXT}>
              To download the example permissions JSON file click{' '}
              <a
                href={PERMISSIONS_DUMMY_JSON_URL}
                rel="noopener noreferrer"
                target="_blank"
                downloads="true"
              >
                here
              </a>
            </Trans>
          </p>
        </div>
        <div className="save-button permissions-settings-page__footer">
          <Button
            bsStyle="primary"
            disabled={!this.hasChanges()}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.SAVE_BUTTON)}
            </LoaderContainer>
          </Button>
          {error && <HelpBlock className="text-error">{error}</HelpBlock>}
          {successfullyUpdated && (
            <span className="permissions-settings-page__text-success">
              {i18next.t(LOCALIZATION.UPDATE_SUCCESS_TEXT)}
            </span>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;

  return {
    extension: getExtension(state, extensionName),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);

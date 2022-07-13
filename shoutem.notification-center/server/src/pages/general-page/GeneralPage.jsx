import React, { PureComponent } from 'react';
import { Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import ext from 'src/const';
import { ChimeUploader, NotificationSettings } from 'src/modules/settings';
import { invalidateCurrentBuild } from 'src/redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import { isBusy, isInitialized } from '@shoutem/redux-io';
import LOCALIZATION from './localization';
import './style.scss';

function valuesChanged(initialValues, currentValues) {
  return JSON.stringify(initialValues) !== JSON.stringify(currentValues);
}

class GeneralPage extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const {
      extension: { settings = {} },
    } = props;

    const {
      chime = {},
      scheduledNotificationsEnabled = false,
      reminder = {},
    } = settings;

    this.state = {
      chime,
      reminder,
      scheduledNotificationsEnabled,
      shouldInvalidateCurrentBuild: false,
      error: false,
      submitting: false,
    };
  }

  handleChimeUpload(chime, shouldInvalidateCurrentBuild) {
    this.setState({ chime, shouldInvalidateCurrentBuild });
  }

  handleChimeDelete(shouldInvalidateCurrentBuild) {
    this.setState({
      chime: { fileName: null, fileUrl: null },
      shouldInvalidateCurrentBuild,
    });
  }

  handleReminderMessageChange(event) {
    const { reminder } = this.state;

    const message = event.target.value;
    const newReminder = { ...reminder, message };

    this.setState({ reminder: newReminder });
  }

  handleReminderToggle(enabledString) {
    const {
      extension: { settings = {} },
    } = this.props;

    const enabled = enabledString === 'true';
    const message = enabled ? settings.reminder?.message : '';

    this.setState({ reminder: { message, enabled } });
  }

  handleScheduledNotificationsToggle(enabledString) {
    const scheduledNotificationsEnabled = enabledString === 'true';

    this.setState({ scheduledNotificationsEnabled });
  }

  handleSave() {
    const {
      extension,
      invalidateCurrentBuild,
      updateExtensionSettings,
    } = this.props;
    const {
      chime,
      reminder,
      scheduledNotificationsEnabled,
      shouldInvalidateCurrentBuild,
    } = this.state;

    if (reminder.enabled && _.isEmpty(reminder.message)) {
      this.setState({ error: i18next.t(LOCALIZATION.ERROR_MESSAGE) });
      return;
    }

    this.setState({ submitting: true });

    const newSettings = {
      ...extension.settings,
      chime,
      reminder,
      scheduledNotificationsEnabled,
    };

    updateExtensionSettings(extension, newSettings).then(() => {
      if (shouldInvalidateCurrentBuild) {
        invalidateCurrentBuild(extension.app);
      }

      this.setState({
        chime,
        error: null,
        submitting: false,
      });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  render() {
    const {
      extension,
      extension: { settings = {} },
    } = this.props;
    const {
      chime,
      error,
      reminder,
      scheduledNotificationsEnabled,
      submitting,
    } = this.state;

    const appId = extension.app;
    const appsUrl = settings.services?.core?.apps;
    const initialValues = {
      chime: settings.chime,
      reminder: settings.reminder,
      scheduledNotificationsEnabled: settings.scheduledNotificationsEnabled,
    };
    const currentValues = {
      chime,
      reminder,
      scheduledNotificationsEnabled,
    };
    const saveButtonDisabled =
      submitting || !valuesChanged(initialValues, currentValues);
    const isLoading =
      submitting || !isInitialized(extension) || isBusy(extension);

    return (
      <form className="settings-page" onSubmit={this.handleSubmit}>
        <LoaderContainer isOverlay isLoading={isLoading}>
          <ChimeUploader
            appsUrl={appsUrl}
            appId={appId}
            chime={chime}
            onDelete={this.handleChimeDelete}
            onUploadSuccess={this.handleChimeUpload}
          />
          <NotificationSettings
            appId={appId}
            appsUrl={appsUrl}
            onReminderMessageChange={this.handleReminderMessageChange}
            onScheduledNotificationsToggle={
              this.handleScheduledNotificationsToggle
            }
            onToggleReminder={this.handleReminderToggle}
            reminder={reminder}
            scheduledNotificationsEnabled={scheduledNotificationsEnabled}
          />
          <ButtonToolbar>
            <Button
              bsSize="large"
              bsStyle="primary"
              disabled={saveButtonDisabled}
              type="submit"
            >
              <LoaderContainer isLoading={submitting}>
                {i18next.t(LOCALIZATION.BUTTON_SAVE)}
              </LoaderContainer>
            </Button>
          </ButtonToolbar>
          {error && (
            <div className="has-error">
              <HelpBlock>{error}</HelpBlock>
            </div>
          )}
        </LoaderContainer>
      </form>
    );
  }
}

GeneralPage.propTypes = {
  extension: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const extension = getExtension(state, ext());

  return { extension };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      invalidateCurrentBuild,
      updateExtensionSettings,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralPage);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { LoaderContainer, Switch } from '@shoutem/react-web-ui';
import { shouldLoad, isError } from '@shoutem/redux-io';
import { isInitialized, isBusy } from '@shoutem/redux-io/status';
import {
  updateShortcutSettings,
  fetchShortcuts,
  getShortcuts,
} from '@shoutem/redux-api-sdk';
import {
  loadRssMonitor,
  getRssMonitor,
  enableMonitoring,
  disableMonitoring,
} from '../redux';
import { MonitoredScreensTable } from '../components';
import LOCALIZATION from './localization';

class Rss extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      toggling: false,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { appId, extensionName, fetchShortcuts, loadRssMonitor } = nextProps;

    if (shouldLoad(nextProps, props, 'shortcuts')) {
      fetchShortcuts();
    }

    if (shouldLoad(nextProps, props, 'rssMonitor')) {
      loadRssMonitor(extensionName, appId);
    }
  }

  async handleToggleMonitoring() {
    const { extensionName, appId, rssMonitor } = this.props;

    this.setState({ toggling: true });

    if (isError(rssMonitor)) {
      await this.props.enableMonitoring(extensionName, appId);
      await this.props.loadRssMonitor(extensionName, appId);
    } else {
      await this.props.disableMonitoring(extensionName, appId, rssMonitor);
    }

    this.setState({ toggling: false });
  }

  render() {
    const { extensionName, shortcuts, rssMonitor } = this.props;
    const { toggling } = this.state;

    const shorcutsLoading = !isInitialized(shortcuts) || isBusy(shortcuts);
    const rssLoading = !isInitialized(rssMonitor) || isBusy(rssMonitor);
    const isLoading = shorcutsLoading || (rssLoading && !toggling);

    const rssMonitoringEnabled = !isError(rssMonitor);

    return (
      <LoaderContainer isLoading={isLoading}>
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <FormGroup className="switch-form-group">
          <ControlLabel>
            {i18next.t(LOCALIZATION.FORM_SWITCH_LABEL)}
          </ControlLabel>
          <Switch
            onChange={this.handleToggleMonitoring}
            value={rssMonitoringEnabled}
          />
        </FormGroup>
        <LoaderContainer isLoading={toggling}>
          {rssMonitoringEnabled && (
            <MonitoredScreensTable
              extensionName={extensionName}
              shortcuts={shortcuts}
              onShortcutSettingsUpdate={this.props.updateShortcutSettings}
            />
          )}
        </LoaderContainer>
      </LoaderContainer>
    );
  }
}

Rss.propTypes = {
  appId: PropTypes.string.isRequired,
  extensionName: PropTypes.string.isRequired,
  shortcuts: PropTypes.array,
  rssMonitor: PropTypes.object,
  fetchShortcuts: PropTypes.func,
  updateShortcutSettings: PropTypes.func,
  loadRssMonitor: PropTypes.func,
  enableMonitoring: PropTypes.func,
  disableMonitoring: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    shortcuts: getShortcuts(state),
    rssMonitor: getRssMonitor(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchShortcuts,
      updateShortcutSettings,
      loadRssMonitor,
      enableMonitoring,
      disableMonitoring,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Rss);

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getExtensionInstallation } from 'environment';
import {
  getExtensionSettings,
  updateExtensionSettings,
} from '../builder-sdk';
import Trackers from './components/Trackers';

export class TrackersPage extends Component {
  constructor(props) {
    super(props);
    this.handleUpdateTrackers = this.handleUpdateTrackers.bind(this);
  }

  handleUpdateTrackers(trackers) {
    const { extensionInstallation, updateSettings } = this.props;
    return updateSettings(extensionInstallation, { trackers });
  }

  render() {
    const { extensionInstallation } = this.props;
    const settings = getExtensionSettings(extensionInstallation);
    return (
      <Trackers
        trackers={settings.trackers}
        updateTrackers={this.handleUpdateTrackers}
      />
    );
  }
}

TrackersPage.propTypes = {
  extensionInstallation: PropTypes.object,
  updateSettings: PropTypes.func,
};

function mapStateToProps() {
  return {
    extensionInstallation: getExtensionInstallation(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSettings: (extension, settings) => dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackersPage);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ext } from 'context';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import SettingsForm from './components/SettingsForm';
import { fetchFirebaseConfig, updateFirebaseConfig } from './actions';
import LOCALIZATION from './localization';
import './style.scss';

export class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.props.fetchConfig();
  }

  handleSave(updatedConfig) {
    const { currentConfig, updateConfig } = this.props;
    const config = {
      ...currentConfig,
      ...updatedConfig,
    };
    return updateConfig(config);
  }

  render() {
    const { currentConfig, isLoading, error } = this.props;
    return (
      <div className="firebase-settings">
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <LoaderContainer isLoading={isLoading}>
          <SettingsForm
            onSubmit={this.handleSave}
            initialValues={currentConfig}
            globalError={error}
          />
        </LoaderContainer>
      </div>
    );
  }
}

SettingsPage.propTypes = {
  currentConfig: PropTypes.shape({
    googleServiceInfoPlist: PropTypes.string,
    googleServicesJson: PropTypes.string,
    projectName: PropTypes.string,
    serverKey: PropTypes.string,
  }),
  error: PropTypes.string,
  fetchConfig: PropTypes.func,
  isLoading: PropTypes.bool,
  updateConfig: PropTypes.func,
};

function mapStateToProps(state) {
  const { firebase } = state[ext()];
  return {
    isLoading: !firebase.configLoaded,
    currentConfig: firebase.config,
    error: firebase.error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchConfig: () => dispatch(fetchFirebaseConfig()),
    updateConfig: config => dispatch(updateFirebaseConfig(config)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);

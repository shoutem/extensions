import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { ext } from 'context';
import { fetchFirebaseConfig, updateFirebaseConfig } from './actions';
import SettingsForm from './components/SettingsForm';
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
        <h3>Firebase configuration</h3>
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
  isLoading: PropTypes.bool,
  fetchConfig: PropTypes.func,
  updateConfig: PropTypes.func,
  error: PropTypes.string,
  currentConfig: PropTypes.shape({
    projectName: PropTypes.string,
    serverKey: PropTypes.string,
    googleServicesJson: PropTypes.string,
    googleServiceInfoPlist: PropTypes.string,
  }),
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

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { Switch } from '@shoutem/react-web-ui';
import './style.scss';

export default class ProviderFormWrapper extends Component {
  constructor(props) {
    super(props);

    this.handleProviderSetupSave = this.handleProviderSetupSave.bind(this);
    this.handleProviderEnabledToggle = this.handleProviderEnabledToggle.bind(this);
    this.renderProviderSetup = this.renderProviderSetup.bind(this);
  }

  handleProviderSetupSave(values) {
    const { providerId, onSetupUpdate } = this.props;
    const settingsPatch = {
      providers: {
        [providerId]: values,
      },
    };

    return onSetupUpdate(settingsPatch);
  }

  handleProviderEnabledToggle() {
    const {
      providerId,
      providerSettings,
      onSetupUpdate,
    } = this.props;
    const enabled = _.get(providerSettings, 'enabled', false);

    const settingsPatch = {
      providers: {
        [providerId]: { enabled: !enabled },
      },
    };

    onSetupUpdate(settingsPatch);
  }

  renderProviderSetup() {
    const { children, providerSettings } = this.props;
    const initialValues = _.omit(providerSettings, 'enabled');

    return (
      <div className="provider-form-wrapper__setup">
        {React.Children.map(children, child => (
          React.cloneElement(child, {
            initialValues,
            onSubmit: this.handleProviderSetupSave,
          })
        ))}
      </div>
    );
  }

  render() {
    const { title, providerSettings, className } = this.props;
    const { enabled } = providerSettings;
    const classes = classNames('provider-form-wrapper', className);

    return (
      <div className={classes}>
        <FormGroup>
          <ControlLabel>{title}</ControlLabel>
          <Switch
            onChange={this.handleProviderEnabledToggle}
            value={enabled}
          />
        </FormGroup>
        {enabled && this.renderProviderSetup()}
      </div>
    );
  }
}

ProviderFormWrapper.propTypes = {
  providerId: PropTypes.string,
  title: PropTypes.string,
  providerSettings: PropTypes.object,
  children: PropTypes.node,
  onSetupUpdate: PropTypes.func,
  className: PropTypes.string,
};
